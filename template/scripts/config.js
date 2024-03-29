const { join } = require("path");
const jsonfile = require("jsonfile");
const CopyWechatOriginalPlugin = require("copy-wechat-original-webpack-plugin");
const projectConfig = require("./project.config");
const envData = require("./getEnvData");
const autoImportGlobalLib = require("./global/globalPlugin");
const { isMockEnv } = require("ziu-server/lib/configUtils");

const root = "src";

module.exports = {
  title: jsonParse(envData).APP_TITLE || "",
  root,
  mode: process.env.PRJ_ENV,
  id: jsonParse(envData).APP_ID || "",
  entry: {
    app: "src/app.json", // 该行固定格式
    outside: "src/outside/**/*/app.json",
  },
  script: {
    useBabelInTS: true,
    babelPresetsModules: "commonjs",
    useLogBeautify: true,
    babelPlugins: isMockEnv() ? ["babel-plugin-aff-mock"] : [],
  },
  alias: {},
  {{#if_eq type "weapp"}}
  entrySuffix: {
    js: "ts",
    miniJs: "wxs",
    xml: "wxml",
    css: "scss",
  },
  compiledSuffix: {
    js: "js",
    css: "wxss",
    miniJs: "wxs",
    xml: "wxml",
  },
  {{/if_eq}}
  {{#if_eq type "aliapp"}}
  entrySuffix: {
    js: "ts",
    miniJs: "sjs",
    xml: "axml",
    css: "scss",
  },
  compiledSuffix: {
    js: "js",
    css: "acss",
    miniJs: "sjs",
    xml: "axml",
  },
  {{/if_eq}}
  dist: getDist(),
  {{#if_eq type "weapp"}}
  globalObject: "global",
  {{/if_eq}}
  {{#if_eq type "aliapp"}}
  globalObject: "my",
  {{/if_eq}}
  commonsDir: "build~commons",
  useSourceMap: true,
  useCache: process.env.PRJ_ENV === "development" ? true : false,

  envData,

  mergeProjectConfig: true,
  projectConfigName: "project.config.json",
  projectConfigPath: join(getDist(), "project.config.json"),
  otherConfig: [{
    from: join(getDist(), "project.private.config.json"),
    to: join(sourceRoot(root), "project.private.config.json"),
  },
  {
    from: join(getDist(), "sitemap.json"),
    to: join(sourceRoot(root), "sitemap.json"),
  }],
  /**
   * 小程序项目配置文件
   */
  projectConfig,

  envList: {
    development: true,
    testing: true,
    staging: true,
    production: true,
  },

  /**
   * 是否使用默认的process polyfill
   */
  process: true,

  polyfill: {
    node: true,
  },

  fallback: {},

  plugins: [
    new CopyWechatOriginalPlugin({
      cwd: process.cwd(),
      originalPath: "/src/__original__/",
      dist: getDist(),
    }),
    miniProgramSourceMap,
    ...autoImportGlobalLib({{#if_eq type "aliapp"}}"aliapp"{{/if_eq}}).plugins
  ],
  ignoreEntry: ["^plugin://", "^antd-mini-rpx"],
  {{#if_eq type "aliapp"}}
  splitSize: null,
  {{/if_eq}}
};

function getDist() {

  const distList = {
    development: "dist/dev",
    testing: "dist/testing",
    staging: "dist/staging",
    production: "dist/release",
  }

  return join(process.cwd(), distList[process.env.PRJ_ENV]);
}

function sourceRoot(name = "src") {
  return join(process.cwd(), name);
}

function jsonParse(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    return {};
  }
}

function miniProgramSourceMap(compiler) {
  compiler.hooks.assetEmitted.tap(
    "MiniProgramSourceMap",
    (file, { content, targetPath }) => {
      if (/\.(map)$/i.test(String(targetPath))) {
        const json = JSON.parse(content);

        json.sources.forEach((item, i) => {
          if (/style(\/|\\|\\\\)index.(js|ts)/.test(item)) {
            json.sourcesContent[i] = json.sourcesContent[i - 1 < 0 ? 0 : i - 1];
          }
        });
        jsonfile.writeFileSync(targetPath, json, { spaces: 2 });
      }
    },
  );
}
