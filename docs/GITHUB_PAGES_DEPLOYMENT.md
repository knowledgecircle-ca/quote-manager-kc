# GitHub Pages Deployment

This frontend-only MVP can be published with GitHub Pages so Kevin can test it from a browser.

## Recommended Repository Settings

- Owner: `knowledgecircle-mylearningmyway`
- Repository name: `quote-manager-kc`
- Visibility: public only if it is acceptable for the prototype code and fictitious demo data to be visible.
- Do not add a README, `.gitignore`, or license from GitHub when creating the repository. The local project already contains the needed files.

## First Push

Run these commands from `C:\Users\One\Documents\Quote-Manager KC` in Git Bash or another terminal where Git is installed:

```bash
git init
git add .
git commit -m "Initial Quote Manager MVP prototype"
git branch -M main
git remote add origin https://github.com/knowledgecircle-mylearningmyway/quote-manager-kc.git
git push -u origin main
```

If the repository uses a different name, replace `quote-manager-kc` in the remote URL.

## Enable GitHub Pages

After the first push:

1. Open the GitHub repository.
2. Go to `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Open the `Actions` tab.
5. Wait for `Deploy to GitHub Pages` to finish.

The test URL will be:

```text
https://knowledgecircle-mylearningmyway.github.io/quote-manager-kc/
```

If the repository name is different, replace the last path segment with that repository name.

## What Gets Deployed

The workflow runs:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

Then it deploys the generated `dist/` folder to GitHub Pages. The `dist/` folder remains ignored in Git.

## Current Limitations

- The app is still frontend-only.
- There is no backend, authentication, CRM integration, email service, or real PDF generation.
- Data shown in the prototype must remain fictitious.
- Public GitHub repositories should not contain real client information, private attachments, secrets, or production exports.
