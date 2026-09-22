# 访客统计速查表

自建统计（Cloudflare Workers + Analytics Engine）的日常查询手册。
部署与实现细节见 [workers/analytics/README.md](../workers/analytics/README.md)。

*   **数据看板**：<https://dash.cloudflare.com/d79cc78d0e1bd8f7ebe28ef921f41123/workers/analytics-engine>
    进 **Analytics Engine** → 数据集 **`pageviews`** → SQL 编辑器，直接粘贴下面的语句。
*   **写入延迟**：约 **1 分钟**才开始可查，刚访问完立刻查可能是空的。
*   **另一个有用的页面**：**Workers & Pages → `xibrer-analytics` → Metrics**，看 Worker 的请求数 / 错误率。
    这个 Worker 只有 `/hit` 一个入口，所以**它的请求数 ≈ 页面浏览数 + 出站点击数**，适合快速确认"链路有没有通"，但没有细分。

---

## 数据结构

每一条记录就是一个事件，字段是固定的六列：

| 字段 | 含义 | 例子 |
| :--- | :--- | :--- |
| `blob1` | 类型 | `pageview` / `event` |
| `blob2` | 页面路径 | `/en/publications/wang2024bp/` |
| `blob3` | 事件名（仅 event） | `pdf:wang2024bp` / `doi:...` / `code:...` |
| `blob4` | 来源**域名**（同站跳转为空） | `scholar.google.com` |
| `blob5` | 国家（ISO 代码） | `CN` |
| `blob6` | 设备粗分类 | `desktop` / `mobile` / `tablet` / `bot` / `unknown` |
| `timestamp` | 时间（自动写入） | — |

**不要用 `count()` 当事件数**。Analytics Engine 会做采样，`count()` 返回的是"读了多少行"，不是事件数。
**所有计数都用 `sum(_sample_interval)`**——这是采样权重之和，才是真实数量。

---

## 速查查询

### 总览

```sql
-- 先跑这条：确认有数据、各类事件各多少
SELECT blob1 AS type, sum(_sample_interval) AS n
FROM pageviews
GROUP BY type
ORDER BY n DESC
```

```sql
-- 最近 30 分钟的原始明细（排查用，能看清每一条是什么）
SELECT timestamp, blob1, blob2, blob3, blob4, blob5, blob6
FROM pageviews
WHERE timestamp > now() - INTERVAL '30' MINUTE
ORDER BY timestamp DESC
LIMIT 100
```

### 趋势

```sql
-- 按天
SELECT toStartOfDay(timestamp) AS day, sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY day
ORDER BY day ASC
```

```sql
-- 按小时（最近 48 小时）
SELECT toStartOfHour(timestamp) AS hour, sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview' AND timestamp > now() - INTERVAL '48' HOUR
GROUP BY hour
ORDER BY hour ASC
```

```sql
-- 按周（最近 90 天）
SELECT toStartOfWeek(timestamp) AS week, sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview' AND timestamp > now() - INTERVAL '90' DAY
GROUP BY week
ORDER BY week ASC
```

### 页面

```sql
-- 最热页面 Top 25
SELECT blob2 AS path, sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY path
ORDER BY views DESC
LIMIT 25
```

```sql
-- 站点分区热度（首页 / 论文 / 项目 / 获奖 / CV 各占多少）
SELECT
  CASE
    WHEN blob2 IN ('/', '/en/', '/zh/')      THEN 'home'
    WHEN blob2 LIKE '%/publications/%'       THEN 'paper detail'
    WHEN blob2 LIKE '%/publications/'        THEN 'publications list'
    WHEN blob2 LIKE '%/projects/'            THEN 'projects'
    WHEN blob2 LIKE '%/awards/'              THEN 'awards'
    WHEN blob2 LIKE '%/cv/'                  THEN 'cv'
    ELSE 'other'
  END AS section,
  sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY section
ORDER BY views DESC
```

```sql
-- 中英文各占多少（回答"维护中文版值不值"）
SELECT
  CASE
    WHEN blob2 LIKE '/zh/%' THEN 'zh'
    WHEN blob2 LIKE '/en/%' THEN 'en'
    ELSE 'other'
  END AS locale,
  sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY locale
ORDER BY views DESC
```

### 论文（最有价值的部分）

PV 只说明"有人来了"，**出站点击才说明"有人真想读"**。

```sql
-- 出站点击总榜
SELECT blob3 AS event, sum(_sample_interval) AS clicks
FROM pageviews
WHERE blob1 = 'event'
GROUP BY event
ORDER BY clicks DESC
LIMIT 25
```

```sql
-- PDF 点击排行（哪几篇被下载得最多）
SELECT blob3 AS event, sum(_sample_interval) AS clicks
FROM pageviews
WHERE blob1 = 'event' AND blob3 LIKE 'pdf:%'
GROUP BY event
ORDER BY clicks DESC
```

```sql
-- 三类出站行为对比：PDF / DOI / 代码
SELECT
  CASE
    WHEN blob3 LIKE 'pdf:%'  THEN 'pdf'
    WHEN blob3 LIKE 'doi:%'  THEN 'doi'
    WHEN blob3 LIKE 'code:%' THEN 'code'
    ELSE 'other'
  END AS kind,
  sum(_sample_interval) AS clicks
FROM pageviews
WHERE blob1 = 'event'
GROUP BY kind
ORDER BY clicks DESC
```

AE 不支持 join，所以"详情页看了几次 vs PDF 点了几次"要分两条跑：

```sql
-- 某篇论文的详情页浏览数
SELECT sum(_sample_interval) AS detail_views
FROM pageviews
WHERE blob1 = 'pageview' AND blob2 = '/en/publications/wang2024bp/'
```

```sql
-- 同一篇论文的 PDF 点击数
SELECT sum(_sample_interval) AS pdf_clicks
FROM pageviews
WHERE blob1 = 'event' AND blob3 = 'pdf:wang2024bp'
```

### 来源

```sql
-- 来源排行（空 = 直接访问）
SELECT
  CASE WHEN blob4 = '' THEN '(direct)' ELSE blob4 END AS referrer,
  sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY referrer
ORDER BY views DESC
LIMIT 25
```

```sql
-- 只看学术渠道带来的量
SELECT blob4 AS referrer, sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
  AND (blob4 LIKE '%scholar%' OR blob4 LIKE '%researchgate%'
       OR blob4 LIKE '%semanticscholar%' OR blob4 LIKE '%arxiv%'
       OR blob4 LIKE '%google%')
GROUP BY referrer
ORDER BY views DESC
```

### 受众

```sql
-- 国家分布
SELECT blob5 AS country, sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY country
ORDER BY views DESC
LIMIT 30
```

```sql
-- 设备分布（已排除爬虫）
SELECT blob6 AS device, sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview' AND blob6 != 'bot'
GROUP BY device
ORDER BY views DESC
```

```sql
-- 爬虫占了多少（含爬虫）
SELECT blob6 AS device, sum(_sample_interval) AS n
FROM pageviews
GROUP BY device
ORDER BY n DESC
```

---

## 查询技巧

### 排除测试数据

部署时验证链路留下过 `/__deploy-check__` 之类的假路径，任何查询里加一句就能排掉：

```sql
AND blob2 NOT LIKE '/__%'
```

### 排除你自己

**不用改任何代码**：在浏览器里开启「发送"请勿跟踪"请求」
（Edge：设置 → 隐私、搜索和服务 → 跟踪防护；Firefox 类似）。

前端脚本检测到 `navigator.doNotTrack === '1'` 会**整段跳过**，连 PV 都不发。
这是最干净的自我排除方式——否则你自己的访问会把真实数据淹掉。

### 时间窗口写法

用官方的 `INTERVAL '<n>' <单位>`：

```sql
timestamp > now() - INTERVAL '7' DAY
timestamp > now() - INTERVAL '48' HOUR
timestamp > now() - INTERVAL '30' MINUTE
timestamp > now() - INTERVAL '6' MONTH   -- 单位同样要大写
```

### 让时间显示得好看点

```sql
SELECT formatDateTime(toStartOfDay(timestamp), '%Y-%m-%d') AS day,
       sum(_sample_interval) AS views
FROM pageviews
WHERE blob1 = 'pageview'
GROUP BY day
ORDER BY day ASC
```

### 支持的时间函数

已确认可用：`now()`、`today()`、`toStartOfDay`、`toStartOfHour`、`toStartOfWeek`、
`toStartOfMonth`、`toStartOfYear`、`toStartOfMinute`、`toStartOfInterval`、`formatDateTime`、
`toUnixTimestamp`、`toDateTime`。

如果哪条语句报错，大概率是某个函数不在支持列表里——把报错贴出来即可。

---

## 已知局限

| 做不到 | 原因 |
| :--- | :--- |
| **独立访客数（UV）** | 没有存任何用户标识（IP / cookie / 指纹都没有），只能算**访问次数**，不能算**多少个人** |
| 会话时长、跳出率、滚动深度 | 需要额外埋点 |
| 站内点击（点导航、切主题） | 只埋了出站链接（PDF / DOI / Code） |
| 还原某个人的访问轨迹 | 设计上不可能 |

UV 是**取舍而非遗漏**。若要估算，可以用"每天轮换的 IP+UA 哈希"（不落 cookie、不存原始 IP、
无法跨天追踪）——需要的话说一声。

---

## 手动验证链路

不想等访客、也不想开浏览器，直接打一条假事件（不经过前端，所以不受 DNT 影响）：

```bash
curl -X POST https://xibrer-analytics.wxwjkl123.workers.dev/hit \
  -H "Content-Type: text/plain" \
  -d '{"t":"pageview","p":"/manual-test"}'
```

返回 **204** 即成功。约 1 分钟后用「最近 30 分钟的原始明细」那条查询就能看到 `/manual-test`。

---

## 附：放进 Cloudflare 自定义仪表盘

Cloudflare 的 Custom Dashboards 以 Cloudflare 自家的 GraphQL 数据集为数据源，
**Analytics Engine 的自定义数据集不一定出现在它的 Dataset 下拉里**——先去看一眼有没有 `pageviews`。

如果有，`blob` 在界面里显示为无意义的 `blob1`…`blob6`，对照下表配置：

| 想要的图表 | 指标 | 维度 | 过滤 |
| :--- | :--- | :--- | :--- |
| 访问量趋势（Timeseries） | Count | `timestamp` | `blob1 = pageview` |
| 最热页面（Top N） | Count | `blob2` | `blob1 = pageview` |
| **论文出站点击** | Count | `blob3` | `blob1 = event` |
| 来源（Bar / Donut） | Count | `blob4` | `blob1 = pageview` |
| 国家（Map） | Count | `blob5` | — |
| 设备（Donut） | Count | `blob6` | — |

如果没有（大概率），替代方案是加一条 **Workers analytics** 的请求曲线当作总量看板
（数据源在支持列表里），细分数据仍然回到上面的 SQL 编辑器查。
