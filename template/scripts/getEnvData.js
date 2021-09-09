const path = require("path"),
  fs = require("fs"),
  glob = require("globby"),
  YAML = require("yaml"),
  git = require("git-rev-sync"),
  merge = require("lodash.merge");

let version = "";

try {
  version = getLatestTag() || process.env.npm_package_version;
} catch (e) {
  console.error(e);
}

const cwd = path.join(process.cwd(), "config"),
  globConfig = {
    cwd,
    root: "/",
  },
  PRJ_ENV = process.env.PRJ_ENV || process.env.NODE_ENV || "production",
  defaultEnvPath = glob.sync("default.*(yaml|yml)", globConfig)[0] || "";

if (!defaultEnvPath) {
  throw new Error(`config dir must include default.yml or default.yaml`);
}

const defaultEnv = getEnvData(defaultEnvPath, cwd),
  envFile = glob.sync(`${PRJ_ENV}.*(yaml|yml)`, globConfig)[0] || "",
  env = getEnvData(envFile, cwd),
  envMergeData = merge(
    {
      PRJ_ENV,
      VERSION: version,
    },
    defaultEnv,
    env,
  );

function getEnvData(url = "", envDataCwd = process.cwd()) {
  if (!url) {
    return {};
  }
  return YAML.parse(fs.readFileSync(path.join(envDataCwd, url || ""), "utf8"));
}

module.exports = JSON.stringify(envMergeData);

function getLatestTag() {
  const tag = git.tag();

  if (!/^v\d+\.\d+\.\d+/.test(tag) || Number.isNaN(tag)) {
    return "";
  }

  return tag;
}
