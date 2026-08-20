# Youth Camp Survey

Mobile-first pre-camp questionnaire built with React, TypeScript, Vite, and
Tailwind CSS.

## Requirements

- Node.js 20.19+ (Node 22.13 is specified in `.nvmrc`)
- npm

## Development

```sh
nvm use
npm install
npm run dev
```

## Verification

```sh
npm run typecheck
npm run lint
npm run build
```

The production output is written to `dist/` and uses domain-root asset paths for
the GitHub Pages custom domain: `https://youngonejourney.tw/`.

The Pages publishing source must be **GitHub Actions**, and the repository's
**Settings → Pages → Custom domain** value must be `youngonejourney.tw`.
Because this repository deploys through a custom Pages workflow, a `CNAME` file
is not required. DNS and HTTPS availability are managed by GitHub Pages after
the custom domain is saved and its DNS records finish propagating.

## Google Apps Script

The Apps Script handler stores each submission only in the existing
`表單回覆 1` worksheet in the authorized external spreadsheet. That
worksheet is also the source for the private dashboard and public aggregate
statistics.

After updating `google-apps-script/Code.gs`, run
`verifyExampleResponsesSheetAccess` once to authorize and verify access to the
external spreadsheet without changing it. Run `formatReadableResponseTimestamps`
once if its existing timestamps need the locale-aware 12-hour format. Then
deploy a new web app version so future submissions use the updated handler.
