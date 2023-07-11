export default function (pathname, req, res) {
  if (pathname === "/user") {
    if (req.method === "GET") {
      res.end(JSON.stringify({ user: "query" }));
    }
    if (req.method === "POST") {
      res.end(JSON.stringify({ user: 'add'}));
    }
    if (req.method === "DELETE") {
      res.end(JSON.stringify({ user: 'delete'}));
    }
    return true; // 已经匹配到了user路径了，不需要继续匹配了
  }
}
