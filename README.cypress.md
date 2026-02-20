# Cypress (E2E) quickstart

Prereqs: install dependencies, then run the dev server and the tests.

Install:

```bash
pnpm install
# or npm install / yarn install
```

Open Cypress interactive runner:

```bash
pnpm cy:open
```

Run E2E tests (this will start the dev server and run Cypress):

```bash
pnpm test:e2e
```

Notes:
- `test:e2e` uses `start-server-and-test` to start `pnpm dev` and wait for http://localhost:3000.
- Adjust `cypress.config.ts` `baseUrl` if your dev server runs on a different port.
