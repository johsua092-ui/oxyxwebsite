#!/usr/bin/env node

/**
 * OXYX CLI -- API Management & Maintenance Tool
 * Run in Termux or any terminal: node cli/oxyx.mjs
 *
 * Features:
 * - Server health/ping/stats monitoring
 * - Live request watcher (realtime tail)
 * - Endpoint listing and testing
 * - Maintenance mode toggle
 * - Supabase database queries
 * - Custom API request builder
 */

import readline from "readline";
import { execSync } from "child_process";

// ---- Configuration ----

const BASE_URL = process.env.OXYX_API_URL || "http://localhost:3000";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const VERSION = "2.0.0";

// ---- Terminal Colors ----

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgBlue: "\x1b[44m",
};

function log(msg) { console.log(msg); }
function info(msg) { log(`${c.cyan}[i]${c.reset} ${msg}`); }
function ok(msg) { log(`${c.green}[+]${c.reset} ${msg}`); }
function err(msg) { log(`${c.red}[-]${c.reset} ${msg}`); }
function warn(msg) { log(`${c.yellow}[!]${c.reset} ${msg}`); }
function heading(msg) { log(`\n${c.bold}${c.white}${msg}${c.reset}`); }
function divider() { log(`${c.gray}${"─".repeat(52)}${c.reset}`); }

// ---- HTTP Helpers ----

async function apiFetch(path, options = {}) {
  try {
    const url = `${BASE_URL}${path}`;
    const start = Date.now();
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const elapsed = Date.now() - start;
    const data = await res.json();
    return { data, status: res.status, elapsed, ok: res.ok };
  } catch (e) {
    return { data: null, status: 0, elapsed: 0, ok: false, error: e.message };
  }
}

async function supabaseQuery(table, params = "") {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    warn("Supabase not configured. Set env vars.");
    return null;
  }
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (e) {
    err(`Supabase query failed: ${e.message}`);
    return null;
  }
}

// ---- Commands ----

async function cmdHealth() {
  heading("Health Check");
  const { data, elapsed, ok: isOk, error } = await apiFetch("/api/health");
  if (!isOk) {
    err(`Server unreachable at ${BASE_URL}`);
    if (error) err(error);
    return;
  }
  ok(`Server is online (${elapsed}ms)`);
  divider();
  log(`  ${c.gray}${"Status".padEnd(18)}${c.reset}${c.green}${data.status}${c.reset}`);
  log(`  ${c.gray}${"Name".padEnd(18)}${c.reset}${c.white}${data.name}${c.reset}`);
  log(`  ${c.gray}${"Version".padEnd(18)}${c.reset}${c.white}${data.version}${c.reset}`);
  log(`  ${c.gray}${"Uptime".padEnd(18)}${c.reset}${c.white}${Math.floor(data.uptime)}s${c.reset}`);
  divider();
}

async function cmdStats() {
  heading("Server Statistics");
  const { data, ok: isOk } = await apiFetch("/api/stats");
  if (!isOk) { err("Could not fetch stats"); return; }
  divider();
  const rows = [
    ["Total Requests", data.totalRequests?.toLocaleString()],
    ["Daily Requests", data.dailyRequests?.toLocaleString()],
    ["Req/Second", data.requestsPerSecond],
    ["Endpoints", data.totalEndpoints],
    ["CPU Usage", data.cpuUsage],
    ["Memory", data.memoryUsage],
    ["Net Download", data.networkDown],
    ["Net Upload", data.networkUp],
    ["Uptime", data.uptime],
    ["Status", data.status],
  ];
  for (const [label, value] of rows) {
    const color = label === "Status" && value === "operational" ? c.green : c.white;
    log(`  ${c.gray}${label.padEnd(18)}${c.reset}${color}${value}${c.reset}`);
  }
  divider();
}

async function cmdEndpoints() {
  heading("API Endpoints");
  const { data: getRoutes } = await apiFetch("/api/get");
  const { data: postRoutes } = await apiFetch("/api/post");

  const routes = { ...(getRoutes?.routes || {}), ...(postRoutes?.routes || {}) };
  let total = 0;

  for (const [category, info] of Object.entries(routes)) {
    log(`\n  ${c.bold}${c.red}${category.toUpperCase()}${c.reset} ${c.gray}(${info.endpoints.length})${c.reset}`);
    for (const ep of info.endpoints) {
      const badge = ep.method === "GET"
        ? `${c.cyan}GET ${c.reset}`
        : `${c.green}POST${c.reset}`;
      log(`    ${badge} ${c.white}${ep.path}${c.reset} ${c.gray}-- ${ep.name}${c.reset}`);
      total++;
    }
  }
  divider();
  info(`Total: ${total} endpoints`);
}

async function cmdTest(endpoint) {
  if (!endpoint) {
    warn("Usage: test <endpoint-path>");
    warn("Example: test /api/ai/luminai?content=hello");
    return;
  }
  heading(`Testing: ${endpoint}`);
  const { data, status, elapsed, ok: isOk, error } = await apiFetch(endpoint);
  if (!isOk) {
    err(`Request failed (${status}): ${error || "Unknown error"}`);
    return;
  }
  ok(`${status} OK (${elapsed}ms)`);
  log(`${c.gray}${JSON.stringify(data, null, 2)}${c.reset}`);
}

async function cmdRequest(args) {
  if (args.length < 2) {
    warn("Usage: request <METHOD> <path> [json-body]");
    warn("Example: request GET /api/ai/luminai?content=hello");
    warn("Example: request POST /api/ai/luminai {\"content\":\"hello\"}");
    return;
  }

  const method = args[0].toUpperCase();
  const path = args[1];
  const bodyStr = args.slice(2).join(" ");

  heading(`${method} ${path}`);

  const options = { method };
  if (bodyStr && (method === "POST" || method === "PUT" || method === "PATCH")) {
    try {
      options.body = bodyStr;
    } catch {
      err("Invalid JSON body");
      return;
    }
  }

  const { data, status, elapsed, ok: isOk, error } = await apiFetch(path, options);
  if (!isOk) {
    err(`${status} - ${error || "Request failed"}`);
    if (data) log(`${c.gray}${JSON.stringify(data, null, 2)}${c.reset}`);
    return;
  }
  ok(`${status} OK (${elapsed}ms)`);
  log(`${c.gray}${JSON.stringify(data, null, 2)}${c.reset}`);
}

async function cmdWatch() {
  heading("Live Stats Watcher");
  info("Refreshing every 3s. Press Ctrl+C to stop.\n");

  const watch = async () => {
    const { data, ok: isOk } = await apiFetch("/api/stats");
    if (!isOk) { err("Server offline"); return; }

    const time = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" });
    const statusDot = data.status === "operational" ? `${c.green}[ON]${c.reset}` : `${c.red}[OFF]${c.reset}`;

    process.stdout.write(`\r  ${c.gray}${time}${c.reset} ${statusDot} ` +
      `${c.white}RPS:${c.reset}${c.cyan}${data.requestsPerSecond}${c.reset} ` +
      `${c.white}CPU:${c.reset}${c.yellow}${data.cpuUsage}${c.reset} ` +
      `${c.white}MEM:${c.reset}${c.magenta}${data.memoryUsage}${c.reset} ` +
      `${c.white}NET:${c.reset}${c.green}${data.networkDown}${c.reset}/${c.red}${data.networkUp}${c.reset} ` +
      `${c.white}TODAY:${c.reset}${c.white}${data.dailyRequests}${c.reset}    `);
  };

  await watch();
  const timer = setInterval(watch, 3000);

  return new Promise((resolve) => {
    process.stdin.once("data", () => {
      clearInterval(timer);
      log("\n");
      info("Watcher stopped.");
      resolve();
    });
  });
}

async function cmdLogs() {
  heading("Recent API Logs (Supabase)");
  const logs = await supabaseQuery(
    "api_logs",
    "select=endpoint,method,status_code,response_time_ms,created_at&order=created_at.desc&limit=15"
  );
  if (!logs || logs.length === 0) {
    info("No logs found. Make some API requests first.");
    return;
  }
  divider();
  for (const entry of logs) {
    const time = new Date(entry.created_at).toLocaleTimeString();
    const statusColor = entry.status_code < 400 ? c.green : c.red;
    log(`  ${c.gray}${time}${c.reset}  ${statusColor}${entry.status_code}${c.reset}  ${entry.method.padEnd(4)} ${c.white}${entry.endpoint}${c.reset}  ${c.gray}${entry.response_time_ms}ms${c.reset}`);
  }
  divider();
}

async function cmdDbStats() {
  heading("Database Statistics (Supabase)");
  const stats = await supabaseQuery(
    "daily_stats",
    "select=date,total_requests,total_errors,avg_response_ms&order=date.desc&limit=7"
  );
  if (!stats || stats.length === 0) {
    info("No daily stats found.");
    return;
  }
  divider();
  log(`  ${c.bold}${"Date".padEnd(14)}${"Requests".padEnd(12)}${"Errors".padEnd(10)}${"Avg MS".padEnd(10)}${c.reset}`);
  for (const s of stats) {
    log(`  ${c.white}${s.date.padEnd(14)}${c.reset}${String(s.total_requests).padEnd(12)}${c.red}${String(s.total_errors).padEnd(10)}${c.reset}${c.yellow}${String(s.avg_response_ms).padEnd(10)}${c.reset}`);
  }
  divider();
}

async function cmdPing() {
  heading("Ping Test (5x)");
  const times = [];
  for (let i = 0; i < 5; i++) {
    const { elapsed, ok: isOk } = await apiFetch("/api/health");
    if (!isOk) { err(`#${i+1}: Failed`); continue; }
    times.push(elapsed);
    const bar = "=".repeat(Math.min(Math.floor(elapsed / 5), 40));
    log(`  ${c.gray}#${i+1}${c.reset}  ${c.cyan}${bar}${c.reset} ${elapsed}ms`);
  }
  if (times.length > 0) {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const min = Math.min(...times);
    const max = Math.max(...times);
    divider();
    log(`  ${c.gray}min=${c.green}${min}ms${c.reset} ${c.gray}avg=${c.yellow}${avg}ms${c.reset} ${c.gray}max=${c.red}${max}ms${c.reset}`);
  }
}

function cmdSysinfo() {
  heading("System Info (Termux/Local)");
  divider();
  try {
    const platform = process.platform;
    const arch = process.arch;
    const nodeVer = process.version;
    const memTotal = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

    log(`  ${c.gray}${"Platform".padEnd(18)}${c.reset}${c.white}${platform}${c.reset}`);
    log(`  ${c.gray}${"Arch".padEnd(18)}${c.reset}${c.white}${arch}${c.reset}`);
    log(`  ${c.gray}${"Node.js".padEnd(18)}${c.reset}${c.white}${nodeVer}${c.reset}`);
    log(`  ${c.gray}${"RSS Memory".padEnd(18)}${c.reset}${c.white}${memTotal} MB${c.reset}`);
    log(`  ${c.gray}${"API URL".padEnd(18)}${c.reset}${c.white}${BASE_URL}${c.reset}`);
    log(`  ${c.gray}${"Supabase".padEnd(18)}${c.reset}${SUPABASE_URL ? c.green + "Connected" : c.yellow + "Not set"}${c.reset}`);
  } catch (e) {
    err(e.message);
  }
  divider();
}

async function cmdMaintenance(args) {
  const action = args[0]?.toLowerCase();

  if (!action || (action !== "on" && action !== "off" && action !== "status")) {
    warn("Usage: maint <on|off|status>");
    warn("  maint on     -- Enable maintenance mode");
    warn("  maint off    -- Disable maintenance mode");
    warn("  maint status -- Check current status");
    return;
  }

  if (action === "status") {
    const { data, ok: isOk } = await apiFetch("/api/health");
    if (!isOk) {
      err("Server is offline or unreachable");
    } else {
      ok(`Server status: ${c.green}${data.status}${c.reset}`);
      info(`Uptime: ${Math.floor(data.uptime)}s`);
    }
    return;
  }

  if (action === "on") {
    warn("Maintenance mode ON");
    info("Note: To fully enable maintenance mode, set MAINTENANCE=true in .env.local and restart.");
    info("For Termux deployment: pm2 restart oxyx");
    return;
  }

  if (action === "off") {
    ok("Maintenance mode OFF");
    info("Note: Remove MAINTENANCE=true from .env.local and restart.");
    info("For Termux deployment: pm2 restart oxyx");
    return;
  }
}

async function cmdDeploy() {
  heading("Deployment Commands");
  divider();
  log(`  ${c.bold}${c.white}Vercel:${c.reset}`);
  log(`    ${c.cyan}npx vercel --prod${c.reset}`);
  log("");
  log(`  ${c.bold}${c.white}VPS (PM2):${c.reset}`);
  log(`    ${c.cyan}npm run build${c.reset}`);
  log(`    ${c.cyan}pm2 start npm --name oxyx -- start${c.reset}`);
  log("");
  log(`  ${c.bold}${c.white}Termux:${c.reset}`);
  log(`    ${c.cyan}pkg install nodejs-lts${c.reset}`);
  log(`    ${c.cyan}npm install && npm run build${c.reset}`);
  log(`    ${c.cyan}npx pm2 start npm --name oxyx -- start${c.reset}`);
  log(`    ${c.cyan}npx pm2 save && npx pm2 startup${c.reset}`);
  divider();
}

function cmdHelp() {
  heading("OXYX CLI v" + VERSION);
  divider();
  const cmds = [
    ["", `${c.bold}Monitoring${c.reset}`],
    ["health", "Check server health"],
    ["stats", "View server statistics"],
    ["ping", "Latency test (5 attempts)"],
    ["watch", "Live stats watcher (realtime)"],
    ["", ""],
    ["", `${c.bold}API${c.reset}`],
    ["endpoints", "List all API endpoints"],
    ["test <path>", "Quick test a GET endpoint"],
    ["request <M> <path>", "Custom request (GET/POST)"],
    ["", ""],
    ["", `${c.bold}Database${c.reset}`],
    ["logs", "View recent API logs"],
    ["dbstats", "View daily stats"],
    ["", ""],
    ["", `${c.bold}Maintenance${c.reset}`],
    ["maint <on|off|status>", "Maintenance mode"],
    ["sysinfo", "System & environment info"],
    ["deploy", "Show deployment commands"],
    ["", ""],
    ["", `${c.bold}General${c.reset}`],
    ["clear", "Clear terminal"],
    ["help", "Show this help message"],
    ["exit", "Exit CLI"],
  ];
  for (const [cmd, desc] of cmds) {
    if (!cmd) { log(`  ${desc}`); continue; }
    log(`  ${c.red}${cmd.padEnd(24)}${c.reset}${c.gray}${desc}${c.reset}`);
  }
  divider();
}

function cmdConfig() {
  heading("Configuration");
  divider();
  log(`  ${c.gray}${"API URL".padEnd(18)}${c.reset}${c.white}${BASE_URL}${c.reset}`);
  log(`  ${c.gray}${"Supabase".padEnd(18)}${c.reset}${SUPABASE_URL ? c.green + "Configured" : c.yellow + "Not set"}${c.reset}`);
  divider();
}

// ---- ASCII Banner ----

function banner() {
  log("");
  log(`${c.red}   ____  __  ____  __${c.reset}`);
  log(`${c.red}  / __ \\/ / / /\\ \\/ /${c.reset}  ${c.white}${c.bold}API Management CLI${c.reset}`);
  log(`${c.red} / /_/ / /_/ /  \\  / ${c.reset}  ${c.gray}v${VERSION}${c.reset}`);
  log(`${c.red} \\____/\\____/   /_/  ${c.reset}  ${c.gray}Type 'help' for commands${c.reset}`);
  log("");
}

// ---- Main REPL ----

async function main() {
  banner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${c.red}oxyx${c.reset}${c.gray} > ${c.reset}`,
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }

    const [cmd, ...args] = input.split(" ");

    switch (cmd.toLowerCase()) {
      case "health":      await cmdHealth(); break;
      case "stats":       await cmdStats(); break;
      case "endpoints":   await cmdEndpoints(); break;
      case "test":        await cmdTest(args.join(" ")); break;
      case "request":
      case "req":         await cmdRequest(args); break;
      case "ping":        await cmdPing(); break;
      case "watch":       await cmdWatch(); break;
      case "logs":        await cmdLogs(); break;
      case "dbstats":     await cmdDbStats(); break;
      case "maint":
      case "maintenance": await cmdMaintenance(args); break;
      case "sysinfo":     cmdSysinfo(); break;
      case "deploy":      await cmdDeploy(); break;
      case "config":      cmdConfig(); break;
      case "help":        cmdHelp(); break;
      case "clear":       console.clear(); banner(); break;
      case "exit":
      case "quit":
      case "q":
        log(`\n${c.gray}Bye.${c.reset}\n`);
        process.exit(0);
      default:
        warn(`Unknown: ${cmd}. Type 'help' for commands.`);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    log(`\n${c.gray}Bye.${c.reset}\n`);
    process.exit(0);
  });
}

main();
