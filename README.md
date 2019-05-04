# 问题

- douban 图片 403 

添加 <meta name="referrer" content="never">

- CORS

public\electron.js => BrowserWindow 中的 webPreferences 设置 webSecurity 为 false

- public\electron.js 中 ipcMain.once 造成 create-react-app 无法 hot-reload 