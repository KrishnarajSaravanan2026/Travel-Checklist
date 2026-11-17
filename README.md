# Travel Checklist

## Contents

- Features
- Run it locally
- Deploy to GitHub Pages
- Project structure
- How the checklist is built
- Customize the content
- Design and brand tokens
- Accessibility
- Offline use and updates
- Privacy
- Troubleshooting
- Roadmap
- License note

## Features

- Three-step wizard for destination, travelers, and checklist generation
- Multi-select destination cards with live summary text
- Counter controls for adults, children, and pets
- Trip duration slider with quantity-aware packing guidance
- Optional trip details for flying, working remotely, infant travel, and cold weather
- Progress bar and checklist status updates as items are packed
- Search, filter, essentials-only mode, pack-all, clear, copy, and print actions
- Custom item creation and removal for trip-specific needs
- Local browser storage, offline cache, and installable web app metadata

## Run it locally

Open `travel-checklist-app/index.html` directly in a browser, or run a local server from the app folder. The server is recommended for testing service-worker and offline behavior.

On Windows, start Python's built-in static server:

```powershell
Set-Location .\travel-checklist-app
py -m http.server 8765
```

Then open:

http://localhost:8765

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow that prepares and deploys the static files when changes reach `main`. For the existing repository:

```bash
node .githooks/install.js
node .githooks/install.js --check
```

Stage only reviewed files and run the guard before committing:

```bash
git add <reviewed-file-paths>
node .githooks/guard.js --staged
git diff --cached
git commit -m "Describe the reviewed change"
node .githooks/guard.js --unpushed
git push
```

The installer configures hooks for this clone only. The guard blocks common credential patterns and sensitive files; it reports contact details, large files, and documents/images for manual review. A clean scan does not replace checking the staged diff and confirming the content is safe to publish.

In GitHub, open **Settings → Pages** and set the source to **GitHub Actions**. The Pages workflow runs on pushes to `main`; feature-branch pushes do not deploy until merged to `main`. Find the deployed URL in the Pages settings or the deployment workflow.

GitHub Pages for a private repository requires an eligible paid plan. On plans without private-repository Pages support, make the repository public only if you intend to publish its source, or deploy through a host that supports private-repository integrations.

For a custom domain, configure it in Pages settings and add the required DNS records with your domain provider. Other hosts should serve the static files with relative paths so the app works under a subpath.

## Project structure

```text
Travel-Checklist/
├── .github/
│   └── workflows/
│       ├── guard.yml
│       └── pages.yml
├── .githooks/
│   ├── commit-msg
│   ├── guard.config.json
│   ├── guard.js
│   ├── install.js
│   ├── pre-commit
│   └── pre-push
├── .gitattributes
├── .gitignore
├── README.md
├── tests/
│   └── guard.test.js
├── travel-checklist-app/
│   ├── assets/
│   │   ├── favicon.svg
│   │   └── manifest.webmanifest
│   ├── scripts/
│   │   ├── app.js
│   │   └── data.js
│   ├── styles/
│   │   └── styles.css
│   ├── index.html
│   └── sw.js
```

The `.git/` directory stores Git history and is required for version-control operations, but is not needed to run the app. `.gitignore` and `.gitattributes` configure source control; `.github/` contains deployment and repository-guard workflows; `.githooks/` and `tests/` support the optional local commit guard. The Pages workflow creates `.nojekyll` in its deployment artifact, so no root `.nojekyll` file is needed.

## How the checklist is built

The app gathers items from a few sources and merges them in a specific order.

| Source | Use |
| --- | --- |
| DATA.common | universal checklist items that apply to most trips |
| DATA.destinations[destId] | destination-specific clothing, gear, food, and extras |
| DATA.options[optionId] | trip detail items such as flying or cold weather |
| DATA.kids | child-focused essentials when children are travelling |
| DATA.pets.common and DATA.pets[petType] | pet travel items when pets are included |
| state.custom | user-added items for a specific trip |

The app de-duplicates items by id, preserves the category order, and falls back to the general category when custom items do not fit an existing category.

## Customize the content

### Add a destination

Add a new destination object to DESTINATIONS and a matching object in DATA.destinations.

### Add a trip option

Add a new option to OPTIONS and then attach category data in DATA.options.

### Add a quantity rule

Add a key to QTY_HINTS with the item id and a function that returns the right quantity for the current trip duration.

Example:

```js
const QTY_HINTS = {
  beach_clt_03: function (days) { return Math.min(days, 7) + 2; }
};
```

## Design and brand tokens

The design uses these values:

- navy: #0A2E57
- blue: #1E85FF
- white: #FFFFFF
- light gray: #F4F6F8
- line: #D5DCE4
- secondary text: #3F5873
- success: #0B6B3A

The blue accent is reserved for large headlines, progress fill, focus rings, and a few key emphasis points. Navy handles main text and primary actions. Every card uses light gray or white surfaces, not blue tinted panels.

## Accessibility

- Skip link for keyboard users
- Visible focus rings on interactive controls
- Real form controls with labels and buttons
- Status updates announced with live regions
- Strong contrast on all primary text
- Mobile first layout with no horizontal scrolling at 375px

## Offline use and updates

Travel Checklist uses a service worker to cache the application files and keep the checklist available without a network connection. The app is organized under `travel-checklist-app/`; scripts, styles, and static assets are grouped into their own folders.

When the app files change, bump the cache name in `travel-checklist-app/sw.js` to force a replacement of the old cache. The build and deployment workflow copies the app folder contents to the GitHub Pages root without a build step.

## Privacy

The checklist is stored in localStorage only. No personal trip data is sent to a backend or third-party analytics service. Google Fonts is the only third-party request made by the app.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Page does not load | Open `travel-checklist-app/index.html` in a browser or start the local server from `travel-checklist-app` on port 8765 |
| Search returns no results | Clear the search field or adjust the filter buttons |
| Custom item does not render | Check that the item was added with a non-empty value |
| Copy fails in browser | Use the print option or copy from a browser that supports clipboard access |
| Service worker does not update | Bump the CACHE value in `travel-checklist-app/sw.js` and reload the page |

## Roadmap

- Add export to CSV or JSON
- Add a shareable trip summary URL
- Add language support for additional locales
- Add drag and drop packing order controls
- Add advanced weather and pack list suggestions

## License note

This repository does not currently include a license. Do not assume it grants reuse rights; add a license if you intend to publish or distribute the project.
