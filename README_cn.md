# 王兴伟（Xingwei Wang）

北京航空航天大学博士研究生王兴伟的个人学术主页，研究方向包括移动与泛在健康感知、多模态语音与音频增强、毫米波感知及面向低空系统的智能感知。

网站基于 Next.js、Tailwind CSS 和 TypeScript 构建，并由 GitHub Pages 自动部署。

主页：[xibrer.github.io](https://xibrer.github.io)

## 本地开发

环境要求：Node.js 22 或更高版本。

```bash
npm ci
npm run dev
```

## 内容管理

- `content/`：英文内容
- `content_zh/`：中文内容
- `content/publications.bib`：论文元数据
- `public/`：头像、论文预览图及 PDF

修改内容后运行：

```bash
npm test
npm run build
```

`main` 分支上的提交会通过 GitHub Actions 自动部署到 GitHub Pages。
