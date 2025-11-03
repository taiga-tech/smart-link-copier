# CHANGELOG

- [\[0.0.1\] - 2025-11-03](#001---2025-11-03)
    - [Added](#added)
    - [Changed](#changed)
    - [Fixed](#fixed)

## [0.0.1] - 2025-11-03

### Added

- Language rules in documentation for consistency and clarity (3c59b95)
    - Added language rules sections to CLAUDE.md and openspec/AGENTS.md
    - Specified "think in English, output in Japanese" rule
    - Defined scope: code comments, documentation, commit messages, etc.

- OpenSpec command files for structured development workflow (13d358d)
    - `apply.md` - Implementation workflow
    - `archive.md` - Change archival process
    - `proposal.md` - Change proposal creation
    - Project context documentation

- lint-staged configuration for pre-commit code quality checks (e25918f)
    - Added `.husky/pre-commit` hook
    - Configured format command to run on all staged files

- Scripts for project automation and patching (cdf5772)
    - `scripts/generate/index-files.ts` - TypeScript index file generation
    - `scripts/patch.ts` - Plasmo + Tailwind v4 compatibility patches
    - Patches for `@tailwindcss/oxide` and `jiti` dependencies

- Type checking and test coverage infrastructure (fcd97bb)
    - `typecheck` script in package.json
    - `test:coverage` placeholder for future test framework

- Development environment configuration (1cc1304)
    - `pnpm-workspace.yaml` for managing patched dependencies
    - `postcss.config.mjs` with Tailwind CSS plugin support
    - ESLint configuration with TypeScript and React support

- Spec-kit workflow integration (87e7493)
    - Custom Claude Code commands (`.claude/commands/`)
    - Specification templates (`.specify/templates/`)
    - Bash scripts for feature development workflow
    - Project constitution and memory system

- GitHub Actions workflows
    - CI pipeline for testing and building
    - Release drafter for automated changelog generation

- Documentation
    - `docs/init.md` - Project initialization guide
    - `docs/patches.md` - Patch management documentation

- Development tools configuration
    - Prettier ignore patterns (`.prettierignore`)
    - VS Code workspace settings (`.vscode/settings.json`)

### Changed

- Updated author email in package.json to `taiga.dev.n@gmail.com` (cdf5772)

- Enhanced Prettier configuration (cdf5772)
    - Added Trivago sort imports plugin
    - Added Tailwind CSS plugin
    - Configured import ordering rules

- Improved TypeScript configuration (tsconfig.json)
    - Added strict type checking options
    - Configured path aliases
    - Enhanced module resolution settings

- Updated React components for better structure
    - `src/app/layout.tsx` - Layout improvements
    - `src/app/page.tsx` - Page component updates
    - `src/components/main.tsx` - Main component refactoring
    - `src/popup/index.tsx` - Popup component updates

- Added global CSS imports (`src/styles/globals.css`)

- Updated GitHub workflow configuration (`.github/workflows/submit.yml`)

- Created initial Plasmo extension structure (988cb4f)
    - Basic extension scaffolding
    - Next.js integration setup

### Fixed

- Consistent closing comments in OpenSpec command files (d38d317)
    - Unified comment format in apply.md, archive.md, and proposal.md
    - Added proper closing tags for OpenSpec managed blocks
