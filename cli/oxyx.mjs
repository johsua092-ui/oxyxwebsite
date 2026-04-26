#!/usr/bin/env node

/**
 * OXYX CLI — API Management Tool
 * Run in Termux or any terminal: node cli/oxyx.mjs
 */

import readline from "readline";

// ---- Configuration ----

const BASE_URL = process.env.OXYX_API_URL || "http://localhost:3000";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

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
  bgBlue: "\x1b[44m",
};

function log(msg) { console.log(msg); }
function info(msg) { log(`${c.blue}[info]${c.reset} ${msg}`); }
function ok(msg) { log(`${c.green}[ok]${c.reset} ${msg}`); }
function err(msg) { log(`${c.red}[error]${c.reset} ${msg}`); }
function warn(msg) { log(`${c.yellow}[warn]${c.reset} ${msg}`); }
function heading(msg) { log(`\n${c.bold}${c.white}${msg}${c.reset}`); }
function divider() { log(`${c.gray}${"─".repeat(50)}${c.reset}`); }

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
    warn("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
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
  log(`  Status:  ${c.green}${data.status}${c.reset}`);
  log(`  Name:    ${data.name}`);
  log(`  Version: ${data.version}`);
  log(`  Uptime:  ${Math.floor(data.uptime)}s`);
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
    ["Net Down", data.networkDown],
    ["Net Up", data.networkUp],
  ];
  for (const [label, value] of rows) {
    log(`  ${c.gray}${label.padEnd(18)}${c.reset}${c.white}${value}${c.reset}`);
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
    log(`\n  ${c.bold}${c.cyan}${category.toUpperCase()}${c.reset} ${c.gray}(${info.endpoints.length})${c.reset}`);
    for (const ep of info.endpoints) {
      const badge = ep.method === "GET"
        ? `${c.blue}GET ${c.reset}`
        : `${c.green}POST${c.reset}`;
      log(`    ${badge} ${c.white}${ep.path}${c.reset} ${c.gray}— ${ep.name}${c.reset}`);
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
  for (const log_entry of logs) {
    const time = new Date(log_entry.created_at).toLocaleTimeString();
    const statusColor = log_entry.status_code < 400 ? c.green : c.red;
    log(`  ${c.gray}${time}${c.reset}  ${statusColor}${log_entry.status_code}${c.reset}  ${log_entry.method.padEnd(4)} ${c.white}${log_entry.endpoint}${c.reset}  ${c.gray}${log_entry.response_time_ms}ms${c.reset}`);
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
    if (!isOk) { err(`Attempt ${i+1}: Failed`); continue; }
    times.push(elapsed);
    log(`  ${c.gray}#${i+1}${c.reset}  ${elapsed}ms`);
  }
  if (times.length > 0) {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const min = Math.min(...times);
    const max = Math.max(...times);
    divider();
    log(`  ${c.gray}min=${c.green}${min}ms${c.reset} ${c.gray}avg=${c.yellow}${avg}ms${c.reset} ${c.gray}max=${c.red}${max}ms${c.reset}`);
  }
}

function cmdHelp() {
  heading("OXYX CLI — Commands");
  divider();
  const cmds = [
    ["health", "Check server health"],
    ["stats", "View server statistics"],
    ["endpoints", "List all API endpoints"],
    ["test <path>", "Test an API endpoint"],
    ["ping", "Latency test (5 attempts)"],
    ["logs", "View recent API logs (Supabase)"],
    ["dbstats", "View daily stats (Supabase)"],
    ["config", "Show current configuration"],
    ["clear", "Clear terminal"],
    ["help", "Show this help message"],
    ["exit", "Exit CLI"],
  ];
  for (const [cmd, desc] of cmds) {
    log(`  ${c.cyan}${cmd.padEnd(18)}${c.reset}${c.gray}${desc}${c.reset}`);
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

// ---- Main REPL ----

async function main() {
  log(`\n${c.bold}${c.blue}  OXYX CLI${c.reset} ${c.gray}v1.0.0${c.reset}`);
  log(`${c.gray}  Type 'help' for available commands${c.reset}\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${c.blue}oxyx${c.reset}${c.gray} > ${c.reset}`,
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }

    const [cmd, ...args] = input.split(" ");

    switch (cmd.toLowerCase()) {
      case "health":    await cmdHealth(); break;
      case "stats":     await cmdStats(); break;
      case "endpoints": await cmdEndpoints(); break;
      case "test":      await cmdTest(args.join(" ")); break;
      case "ping":      await cmdPing(); break;
      case "logs":      await cmdLogs(); break;
      case "dbstats":   await cmdDbStats(); break;
      case "config":    cmdConfig(); break;
      case "help":      cmdHelp(); break;
      case "clear":     console.clear(); break;
      case "exit":
      case "quit":
      case "q":
        log(`\n${c.gray}Bye.${c.reset}\n`);
        process.exit(0);
      default:
        warn(`Unknown command: ${cmd}. Type 'help' for available commands.`);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    log(`\n${c.gray}Bye.${c.reset}\n`);
    process.exit(0);
  });
}

main();
