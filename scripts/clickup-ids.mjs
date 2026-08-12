/**
 * Discovers the ClickUp ids that `/api/berth` needs, so neither is ever
 * hardcoded: CLICKUP_LIST_ID (which list a berth request becomes a task in) and
 * CLICKUP_ASSIGNEE_ID (the numeric user id to assign it to).
 *
 * Usage — the token is read from the environment, never passed as an argument
 * (arguments land in shell history):
 *
 *   CLICKUP_API_TOKEN=pk_... node scripts/clickup-ids.mjs
 *
 * or, if you already have a .env.local:
 *
 *   npm run clickup:ids
 *
 * Walks GET /team -> /space -> /folder -> /list and prints the tree with ids.
 * Read-only: it creates nothing and changes nothing.
 */
import { readFileSync } from "node:fs";

const API = "https://api.clickup.com/api/v2";

/** Minimal .env.local reader so the script works without a dotenv dependency. */
function tokenFromEnvFile() {
  try {
    const line = readFileSync(new URL("../.env.local", import.meta.url), "utf8")
      .split(/\r?\n/)
      .find((l) => l.startsWith("CLICKUP_API_TOKEN="));
    return line?.slice("CLICKUP_API_TOKEN=".length).trim() || undefined;
  } catch {
    return undefined;
  }
}

const token = process.env.CLICKUP_API_TOKEN || tokenFromEnvFile();
if (!token) {
  console.error(
    "CLICKUP_API_TOKEN is not set.\n" +
      "Get a personal token from ClickUp: avatar -> Settings -> Apps -> API Token.\n" +
      "Then: CLICKUP_API_TOKEN=pk_... node scripts/clickup-ids.mjs",
  );
  process.exit(1);
}

async function get(path) {
  const res = await fetch(API + path, { headers: { Authorization: token } });
  if (!res.ok) {
    throw new Error(`GET ${path} -> ${res.status} ${await res.text().catch(() => "")}`);
  }
  return res.json();
}

try {
  const { user } = await get("/user");
  console.log("\nCLICKUP_ASSIGNEE_ID");
  console.log(`  ${user.id}    ${user.username} <${user.email}>\n`);

  const { teams } = await get("/team");
  console.log("CLICKUP_LIST_ID — pick the list berth requests should land in:\n");

  for (const team of teams) {
    console.log(`Workspace: ${team.name}  (id ${team.id})`);
    const { spaces } = await get(`/team/${team.id}/space`);

    for (const space of spaces) {
      console.log(`  Space: ${space.name}  (id ${space.id})`);

      // Lists sitting directly in the space, with no folder.
      const folderless = await get(`/space/${space.id}/list`);
      for (const list of folderless.lists ?? []) {
        console.log(`    LIST  ${list.id}  ${list.name}`);
      }

      const { folders } = await get(`/space/${space.id}/folder`);
      for (const folder of folders ?? []) {
        console.log(`    Folder: ${folder.name}  (id ${folder.id})`);
        const { lists } = await get(`/folder/${folder.id}/list`);
        for (const list of lists ?? []) {
          console.log(`      LIST  ${list.id}  ${list.name}`);
        }
      }
    }
    console.log("");
  }

  console.log("Copy the chosen LIST id into CLICKUP_LIST_ID in the Dokploy Environment tab.\n");
} catch (error) {
  // The token itself is never printed, even on failure.
  console.error("\nLookup failed:", error.message);
  console.error("A 401 means the token is wrong or lacks access to the workspace.\n");
  process.exit(1);
}
