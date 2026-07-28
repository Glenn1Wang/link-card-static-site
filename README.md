# 银行开户链接静态页

一个移动优先、零依赖的银行选择页面。访客只需选择银行，即可跳转到对应的开户链接。

## 修改银行和链接

所有显示内容都在 [`config.json`](./config.json) 中配置：

```json
{
  "page": {
    "title": "选择开户银行",
    "label": "开启投资账户"
  },
  "theme": {
    "accent": "#f04438"
  },
  "links": [
    {
      "name": "银行名称",
      "url": "https://example.com/your-invite-link",
      "newTab": false
    }
  ]
}
```

- `name`：页面显示的银行名称。
- `url`：点击后跳转的开户链接，仅支持 `http` 和 `https`。
- `newTab`：设为 `true` 时在新标签页打开；默认为当前页面跳转。
- `theme.accent`：界面强调色，使用六位十六进制颜色。

仓库中的银行和 URL 是占位示例，发布前请替换为真实信息。

## 本地预览

页面通过浏览器读取 JSON，需要使用本地 HTTP 服务：

```bash
python -m http.server 8000
```

访问 <http://localhost:8000>。

## GitHub Pages

仓库包含 GitHub Pages 工作流。在仓库的 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**，之后每次推送 `main` 都会自动部署。
