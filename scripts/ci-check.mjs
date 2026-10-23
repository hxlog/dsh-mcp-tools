#!/usr/bin/env node
// Manifest-contract self-check for dsh-mcp-tools.
// Runs in CI and locally (npm run ci-check). No dependencies, no network.
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const problems = [];
const need = (cond, msg) => { if (!cond) problems.push(msg); };

// 1. DSH bundle contract: the declared patch file must exist.
const patch = pkg.dsh?.bundle?.patch;
need(typeof patch === "string" && patch.length > 0, "package.json: dsh.bundle.patch is missing");
if (typeof patch === "string" && patch.length > 0) {
  need(existsSync(resolve(root, patch)), `declared bundle patch does not exist: ${patch}`);
}
need(pkg.dsh?.client?.platform === "web", "package.json: dsh.client.platform must be 'web'");

// 2. Node compat + no lifecycle scripts + no runtime deps (marketplace admission checks).
need(typeof pkg.engines?.node === "string", "package.json: engines.node is missing");
const lifecycle = ["preinstall", "install", "postinstall", "prepare", "prepublishOnly"];
for (const key of lifecycle) need(!pkg.scripts?.[key], `package.json: lifecycle script present: ${key}`);
for (const key of ["dependencies", "optionalDependencies", "bundledDependencies", "bundleDependencies"]) {
  need(!pkg[key] || Object.keys(pkg[key]).length === 0, `package.json: ${key} must be empty or absent`);
}

// 3. Every shipped path in files[] must exist.
for (const entry of pkg.files ?? []) need(existsSync(resolve(root, entry)), `files[] entry does not exist: ${entry}`);

// 4. The client bundle must be parseable as a classic script (it ships unbundled).
const client = resolve(root, "client/client.js");
if (existsSync(client)) {
  try { new vm.Script(readFileSync(client, "utf8"), { filename: "client/client.js" }); }
  catch (error) { problems.push(`client/client.js syntax error: ${error.message}`); }
} else problems.push("client/client.js is missing");

if (problems.length > 0) {
  console.error("manifest contract check failed:");
  for (const p of problems) console.error(" - " + p);
  process.exit(1);
}
console.log(`manifest contract OK: ${pkg.name}@${pkg.version}, patch ${patch}, ${(pkg.files ?? []).length} shipped paths, 0 deps, 0 lifecycle scripts`);
