# 访客统计 Worker（Cloudflare Workers + Analytics Engine）

自建、无第三方统计服务、**没有公开读取接口**。Worker 只负责写入，数据在 Cloudflare 后台看。

> **当前已部署**：`https://xibrer-analytics.wxwjkl123.workers.dev`
> 前端用的 endpoint：`https://xibrer-analytics.wxwjkl123.workers.dev/hit`

## 部署后如果卡住

部署时如果报 `✘ [ERROR] fetch failed`（而且日志里只有 `-- START CF API REQUEST` 没有响应），先别怀疑令牌或配置——大概率是**网络层**问题。本机实测过：node 的 fetch（undici）只解析到 Cloudflare 的 **IPv6** 地址并全部超时，而 PowerShell 走 IPv4 完全正常。重试一次往往就好了；持续失败可以试：

```bash
NODE_OPTIONS=--dns-result-order=ipv4first npx wrangler deploy
```

（注意：这条环境变量是否真的起作用未被证实——本机加不加它，独立探测都只拿到 IPv6。把它当缓解手段而不是确定的修复。）

如果报 `You need to enable Analytics Engine [code: 10089]`，那是**账户级开关**没开，不是令牌权限问题：先去 https://dash.cloudflare.com/<account_id>/workers/analytics-engine 点一次 Enable。这一步没有 API 可做，只能手动点。

## 它收集什么

| 字段 | 内容 | 例子 |
|---|---|---|
| `blob1` | 类型 | `pageview` / `event` |
| `blob2` | 路径 | `/en/publications/wang2024bp/` |
| `blob3` | 事件名（仅 event） | `pdf:wang2024bp` |
| `blob4` | **仅来源域名** | `scholar.google.com` |
| `blob5` | 国家（Cloudflare 边缘提供） | `CN` |
| `blob6` | 设备粗分类 | `desktop` / `mobile` / `tablet` / `bot` |
| `double1` | 计数 1 | `1` |

**不收集**：IP 地址、cookie、用户标识、完整来源 URL（可能带查询参数）。数据里无法还原某个人的访问轨迹。前端还会尊重 `DNT` 与 `Sec-GPC`，命中就直接不发。

## 部署

```bash
cd workers/analytics
npx wrangler login      # 浏览器授权，只需一次
npx wrangler deploy
```

部署完会打印一个地址，形如：

```
https://xibrer-analytics.<你的子域>.workers.dev
```

**接口是 `/hit`**，所以完整地址是 `https://xibrer-analytics.<你的子域>.workers.dev/hit`。

然后在 GitHub 仓库里加一个 **Variable**（Settings → Secrets and variables → Actions → **Variables**，不是 Secrets）：

| Name | Value |
|---|---|
| `ANALYTICS_ENDPOINT` | `https://xibrer-analytics.<你的子域>.workers.dev/hit` |

`deploy.yml` 会把它作为 `NEXT_PUBLIC_ANALYTICS_ENDPOINT` 传给构建。**不设置这个变量，前端就完全不注入统计脚本**——所以在部署 Worker 之前，站点行为和现在完全一样。

想临时关掉统计：删掉这个 Variable 重新构建即可。

## 怎么看数据

Cloudflare Dashboard → **Workers & Pages → Analytics Engine → `pageviews` → SQL**。下面的 `_sample_interval` 是 Analytics Engine 的标准聚合权重。

总 PV（近 7 天）：

```sql
SELECT SUM(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview' AND timestamp > NOW() - INTERVAL '7' DAY
```

最受欢迎的页面：

```sql
SELECT blob2 AS path, SUM(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY path
ORDER BY views DESC
LIMIT 25
```

**出站点击**（哪几篇论文真的有人想读——这是这个统计里最有价值的一项）：

```sql
SELECT blob3 AS event, SUM(_sample_interval) AS clicks
FROM pageviews
WHERE blob1 = 'event'
GROUP BY event
ORDER BY clicks DESC
LIMIT 25
```

来源：

```sql
SELECT blob4 AS referrer, SUM(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview' AND blob4 != ''
GROUP BY referrer
ORDER BY views DESC
LIMIT 25
```

中英文各占多少：

```sql
SELECT
  CASE WHEN blob2 LIKE '/zh/%' THEN 'zh'
       WHEN blob2 LIKE '/en/%' THEN 'en'
       ELSE 'other' END AS locale,
  SUM(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY locale
ORDER BY views DESC
```

按天趋势：

```sql
SELECT toStartOfDay(timestamp) AS day, SUM(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY day
ORDER BY day
```

国家和设备：

```sql
SELECT blob5 AS country, COUNT(*) AS hits
FROM pageviews
GROUP BY country
ORDER BY hits DESC
LIMIT 20;
```

想看真实访客（排除爬虫）就在 `WHERE` 里加 `AND blob6 != 'bot'`。

## 免费额度与限制

| 项 | Workers Free |
|---|---|
| Analytics Engine 写入 | 100,000 数据点/天 |
| Analytics Engine 查询 | 10,000 次/天 |
| Worker 请求 | 100,000 次/天 |

一次浏览 = 1 个数据点，一次 PDF/DOI 点击 = 1 个数据点。对个人学术主页远远够用。

⚠️ **一个务实的提醒**：`*.workers.dev` 域名在中国大陆访问经常不稳定甚至不可达。如果你的访客主要在境内，统计数会偏低（前端是 fire-and-forget，失败不影响页面）。要彻底解决，需要把域名托管到 Cloudflare 并用自定义域走 Worker——但 `xibrer.github.io` 是 GitHub 的子域，你无法控制它的 DNS，所以这需要先有自己的域名。

## 为什么不用 Workers KV

KV 免费版**写入不同 key 上限是 1,000 次/天**，而且同一个 key 每秒只能写 1 次。用它做 PV 计数等于把每天统计封顶在 1000 次，超过就静默丢数据。Analytics Engine 是追加式写入，免费额度 100,000 数据点/天，宽 100 倍，也正是为这种事件流设计的。
