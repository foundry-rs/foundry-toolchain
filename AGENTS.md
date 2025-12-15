# AGENTS.md

## Commands

```bash
nvm use                   # Use correct Node version (see .nvmrc)
npm run build             # Build with ncc to dist/
npx prettier --check .    # Check formatting
npx prettier --write .    # Fix formatting
```

No test framework configured.

## Architecture

GitHub Action that installs Foundry (Ethereum development toolkit) and caches RPC responses.

- `src/index.js` - Main entry: downloads Foundry archive, extracts, adds to PATH, restores cache
- `src/save.js` - Post-action: saves RPC cache
- `src/cache.js` - Cache logic using @actions/cache
- `src/utils.js` - Platform detection, download URL construction
- `src/constants.js` - State key constants
- `action.yml` - Action definition with inputs (version, network, cache, cache-key)
- `dist/` - Compiled output (committed)

## Code Style

- JavaScript (CommonJS with `require`/`module.exports`)
- Prettier: 2 spaces, double quotes, trailing commas, 120 char line width
- Use `@actions/*` packages for GitHub Actions APIs
- JSDoc comments for functions
- Error handling: wrap main in try/catch, call `core.setFailed(err)` on failure
