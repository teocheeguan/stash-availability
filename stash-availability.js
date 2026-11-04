// Stash Availability 连通性检测脚本（Tile, collapsed）
// argument 格式： 名称|URL
// 判定：只要拿到任何 HTTP 响应（含 403/404 等站点自身拦截）即视为"网络可达"，请求失败/超时才算不通。
const [name, url] = String($argument || "").split("|");
const TIMEOUT = 8;
const t0 = Date.now();

if (!url) {
  $done({ title: name || "Availability", content: "缺少 argument", icon: "exclamationmark.triangle.fill", backgroundColor: "#8E8E93" });
} else {
  $httpClient.get({ url, timeout: TIMEOUT, headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15" } },
    (err, resp) => {
      const ms = Date.now() - t0;
      if (err || !resp) {
        $done({ title: name, content: "不通 ✕", backgroundColor: "#D64545" });
      } else if (resp.status >= 500 && resp.status !== 503) {
        $done({ title: name, content: `异常 ${resp.status} · ${ms}ms`, backgroundColor: "#E08A00" });
      } else {
        const color = ms < 800 ? "#2E9E57" : ms < 2000 ? "#E08A00" : "#D64545";
        $done({ title: name, content: `${ms} ms ✓`, backgroundColor: color });
      }
    });
}
