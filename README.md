# 银行开户链接静态页

一个面向移动端的零依赖静态页面，用于展示银行名称并跳转到对应的专属开户链接。页面内容全部由 [`config.json`](./config.json) 管理，无需修改 HTML 或 JavaScript。

## 配置页面

编辑 `config.json`：

```json
{
  "page": {
    "title": "银行开户链接",
    "eyebrow": "BANK ACCESS · 专属服务",
    "description": "选择银行，进入对应的专属邀请页面。",
    "sectionTitle": "选择开户银行",
    "adviser": {
      "label": "服务顾问",
      "name": "您的姓名",
      "title": "证券从业人员"
    },
    "noticeTitle": "开户提示",
    "notice": "您的风险或合规提示。",
    "footer": "页面底部说明。"
  },
  "theme": {
    "accent": "#9a4638"
  },
  "links": []
}
```

`theme.accent` 必须使用六位十六进制颜色，例如 `#9a4638`。

## 配置银行

在 `links` 中增加银行对象：

```json
{
  "name": "银行名称",
  "description": "开户链接说明",
  "url": "https://example.com/your-invite-link",
  "badge": "推荐",
  "newTab": true,
  "enabled": true
}
```

- `name`：银行名称，必填。
- `description`：卡片辅助说明，可选。
- `url`：专属开户链接，仅接受 `http` 或 `https` 地址。
- `badge`：右侧短标签，例如“推荐”，可选。
- `newTab`：是否在新标签页打开，默认 `true`。
- `enabled`：设置为 `false` 时显示为不可点击状态。

仓库中的银行和 URL 均为明确标注的示例，请在发布使用前替换为真实信息。

## 本地预览

由于浏览器需要读取 JSON，请通过本地 HTTP 服务预览，不要直接双击 `index.html`：

```bash
python -m http.server 8000
```

然后访问 <http://localhost:8000>。

## GitHub Pages

仓库包含 GitHub Pages 工作流。在仓库的 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**，之后每次推送 `main` 分支都会自动部署。
