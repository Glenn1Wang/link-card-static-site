# 银行开户链接静态页

一个移动端优先、零依赖的银行选择页面。访客无需填写任何内容，选择银行后即可进入对应的广发证券开户注册页面。

## 修改页面内容

所有显示内容和目标链接均在 [`config.json`](./config.json) 中配置：

```json
{
  "page": {
    "title": "选择开户银行",
    "label": "广发证券开户服务",
    "description": "选择银行后，将进入广发证券开户注册页面"
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

- `page.title`：页面主标题和浏览器标题。
- `page.label`：页面顶部的服务主体名称。
- `page.description`：标题下方的一句跳转说明。
- `theme.accent`：页面强调色，使用六位十六进制颜色。
- `name`：页面显示的银行名称。
- `url`：点击后跳转的开户链接，仅支持 `http` 和 `https`。
- `newTab`：设为 `true` 时在新标签页打开；默认在当前页面跳转。

## 本地预览

页面通过浏览器读取 JSON，需要使用本地 HTTP 服务：

```bash
python -m http.server 8000
```

访问 <http://localhost:8000>。

## GitHub Pages

在仓库的 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**。之后每次推送 `main` 分支都会自动部署。
