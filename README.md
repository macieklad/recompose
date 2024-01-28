> [!TIP]
> You can navigate AirHelp's web engineering through our
> main [confluence docs](https://airhelp.atlassian.net/wiki/spaces/TECH/pages/352419915/Introduction). Start from there
> if
> you are here to explore our projects

# AirHelp Funnels

Monorepo containing AirHelp's apps and packages related to building funnels. See the confluence docs for more info.

## Tools:

- 🏎 [Turborepo](https://turbo.build/repo) — High-performance build system for Monorepos
- 🛠 [Vite and ViteNode](https://vitejs.dev) — TypeScript bundler and runner powered by esbuild and rollup
- 📏 [ESLint](https://eslint.org/) for code linting
- 🌹 [Prettier](https://prettier.io) for code formatting
- 🔀 [Changesets](https://github.com/changesets/changesets) for managing versioning and changelogs
- 🔄 [Syncpack](https://yarnpkg.com) — Tool for syncing dependency versions across packages
- 🎬 [GitHub Actions](https://github.com/changesets/action) for fully automated package publishing

### Setup

Packages are stored in GitHub Packages.
You need to have a GitHub personal access token (classic), set as `GITHUB_TOKEN` env.

Applications are expected to run
with node versions [supported by airhelp](https://airhelp.atlassian.net/wiki/spaces/DO/pages/113639477/Platform+EOLs).
We recommend an automatic version manager for node and your other tools, that will be able to read the metadata
in `package.json`, see volta, nvm, etc. (node version and package manager).

With everything prepared, run:

```bash
pnpm install
```

You are ready to go. For further docs regarding setup, see `README` of the package that interests you.

- Apps are located in the `apps` directory
- Packages are located in the `packages` directory
- Tools reside in the root `tools` directory

### Repository commands

This repository is managed by Turborepo, a build system optmimized for JS. Each package or app is a complete project on
its own and can be run
independently and Turborepo provides the logic to manage the dependency graph between projects.

You can run commands directly in each project through yarn:

```bash
pnpm --filter document-funnel dev
```

Or use turborepo for that task, remember that turborepo tasks are defined in `turbo.json`, not in `package.json`,
altough they are aliased in `package.json`:

```bash
pnpm build --filter document-funnel # Runs turbo build --filter document-funnel
```

Common commands are defined in the root `package.json` as scripts.

## Development

Each package has its own development scripts, you can run them individually with turbo, this will ensure that their
dependencies are also running their development scripts:

```bash
pnpm dev --filter document-funnel
```

You can also run the project directly without any automation, if it depends on build packages you can just build the
projects first, and then depend on the build output:

```bash
# Dependency
pnpm --filter @airhelp/funnel build
# Project
pnpm --filter document-funnel dev
```

### Dependencies and development experience

When building your next project, you often want to also work on some package in this repository. You can approach this
in three ways:

- You can pin the version of the dependency as you always do with semver in package.json.But if you want changes, you
  will need to bump the version, merge changes into repo, and wait for it to be published. This is practical only if you
  depend on some older version of the package.
- Your project may depend on the package with wildcard version `*`. If you install dependencies with `pnpm`, it will
  automatically link the package from this repository. Then, if you rebuild your package, the changes will propagate.
  The con is that you need to rebuild your package every time you change it. Also, you cannot pin the package version
  this way, so you will always work with the code on the master branch.
- The last way that improves on the previous solution is to alias the package imports in your project (for example with
  tsconfigPaths and a vite plugin). Your package will be directly imported from source files during development. All
  features such as hot module replacement will work during the development. **But please remember**: you are then
  responsible for building the package as your bundler will optimize it, and it is no longer related to the code
  released on github packages.

## Documentation

Besides our root frontend documentation, there is a central storybook in the repository, you can run it with:

```bash
pnpm --filter funnel-storybook dev
```

## Contributing

Before opening a PR, make sure that your changes are documented by a changeset. To create a changeset, run:

```bash
pnpm changeset
```

This will prompt you for the changeset type and a summary of the changes. The changeset file needs to be committed.

Also, if you bumped versions of packages, make sure that other libraries are using the same version:

```bash
pnpm sync-package-versions
```

There is also a script to check the state of package versions:

```bash
pnpm check-package-versions
```
