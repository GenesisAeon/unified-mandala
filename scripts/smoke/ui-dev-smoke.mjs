import { spawn } from "child_process"; import http from "http";
const proc = spawn("pnpm", ["-s", "dev:ui"], { shell: true });
let ready = false; const deadline = Date.now() + 30_000;
proc.stdout.setEncoding("utf8"); proc.stderr.setEncoding("utf8");
proc.stdout.on("data", (s) => { process.stdout.write(s);
  if (!ready && /http:\/\/.*:5173/i.test(s)) { ready = true; setTimeout(check, 1500); }});
proc.stderr.on("data", (s) => process.stderr.write(s));
function check(){ http.get("http://127.0.0.1:5173/", (res)=>done(res.statusCode===200?0:2)).on("error",()=>done(3)); }
function done(code){ try{proc.kill("SIGTERM");}catch{} setTimeout(()=>process.exit(code),500); }
setInterval(()=>{ if(Date.now()>deadline){ console.error("Timeout: UI dev server not ready"); done(4);} },500);
