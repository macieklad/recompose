module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-node-airhelp`
  extends: ["@airhelp"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
