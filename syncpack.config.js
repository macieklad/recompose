module.exports = {
  // workspace option was removed, dependencies from this monorepo should use wildcard *
  // for local package version to always be up to date. If there are exceptions, configure
  // them in a whitelist here.
  // https://jamiemason.github.io/syncpack/config/dependency-types
  dependencyTypes: ["dev", "overrides", "peer", "pnpmOverrides", "prod", "resolutions"],
};
