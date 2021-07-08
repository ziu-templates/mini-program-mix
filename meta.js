/**
 * package.json元数据
 */

module.exports = {
  prompts: {
    name: {
      type: "string",
      required: true,
      message: "Project name",
    },
    description: {
      type: "string",
      required: false,
      message: "Project description",
      default: "A mini-program(小程序) project with ziu",
    },
    author: {
      type: "string",
      message: "Author",
    },
    type: {
      type: "list",
      message: "请选择小程序类型",
      choices: [
        {
          name: "微信小程序",
          value: "weapp",
          short: "Weapp",
        },
        {
          name: "支付宝小程序",
          value: "aliapp",
          short: "aliapp",
        },
      ],
    },
    useTest: {
      type: "confirm",
      message: "是否增加单元测试(Jest)?",
    },
    gitCommitMsg: {
      type: "confirm",
      message:
        "Use commitlint to check commit message?(Angular Commit Message)",
    },
    changelog: {
      type: "confirm",
      message: "Use CHANGELOG to your project?",
    },
    tab: {
      when: "type",
      type: "confirm",
      message: "Use Tab?",
    },
  },
  filters: {
    "src/assets/imgs/tab.png": "tab",
    "src/jest.config.js": "useTest",
    "src/__tests__": "useTest",
    "src/__mocks__": "useTest",
    "src/pages/index/index.axml": "type === 'aliapp'",
    "src/pages/index/index.wxml": "type === 'weapp'",
    // '.eslintrc.js': 'lint',
    // '.eslintignore': 'lint',
    // 'scripts/lib/webpack/loaders/eslintLoader.js': 'lint',
    "commitlint.config.js": "gitCommitMsg",
    ".huskyrc": "gitCommitMsg",
  },
};
