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

The production output is written to `dist/` and uses relative asset paths so it
can be hosted from a GitHub Pages project subdirectory.

## Google Apps Script

The Apps Script handler stores each submission in three destinations:

- the normalized `Responses` worksheet used by the dashboard and statistics;
- the human-readable `網站問卷回覆` worksheet in the same response spreadsheet.
- the existing `表單回覆 1` worksheet in the authorized example spreadsheet.

After updating `google-apps-script/Code.gs`, run
`setupFormStyleResponsesSheet` once in the Apps Script editor to create its
formatted worksheet. Run `verifyExampleResponsesSheetAccess` once to authorize
and verify access to the example spreadsheet without changing it. Then deploy a
new web app version so future submissions use the updated handler.
