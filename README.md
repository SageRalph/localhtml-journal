# localhtml

The content of this repo is for building a single page static site with persistent form data and rich text editor fields. The page can be saved locally as a single HTML file and works offline. The local copy holds all data needed to repopulate the sheet, and newer versions of the page can import data from older versions.

A pre-built copy of the example page is provided as `docs/index.html`.  
This is hosted using GitHub pages at https://SageRalph.github.io/localhtml/

## How To use

This project is intended as a quick-start template. To build your own localhtml project, fork this repo and change the content of as needed. For most uses, you should only need to modify files in `src/project/` and possibly add some images to `src/img/`.

- `src/project/content.html` contains the fixed content of the sheet.
- `src/project/styles.css` contains the styling for the sheet content.
- `src/project/scripts.js` contains custom JavaScript behaviour for the sheet.
- `src/project/menu.html` contains additions to the controls menu.
- `src/project/overrides.js` contains stubs for functions you may want to implement custom behavior for (e.g. suggested filename when saving). You should also use this file to import any other files for your project (CSS, JS, fonts, etc), these will be automatically bundled during the build process.
- `src/project/config.js` contains several variables you should change such as the page title and a URL for automatic updates.
- `package.json` contains package URLs and version number, changing these is optional. The version number is used for automatic updates.
- It is recommended to put any additional images in `src/img/` and include them using the `background: url()` CSS property.

## Building the Document

The site is built using Node.js, NPM, and Webpack.

First install dependencies using `npm install --dev`

Build the site for development (unminified) by running `npm run build-debug`

Build the site for production by running any of:

| Command             | Action                                                            |
| ------------------- | ----------------------------------------------------------------- |
| npm run build       | Builds the site without bumping the version                       |
| npm run build-patch | Builds the site and bumps the patch version (e.g. 1.2.3 -> 1.2.4) |
| npm run build-minor | Builds the site and bumps the minor version (e.g. 1.2.3 -> 1.3.0) |
| npm run build-major | Builds the site and bumps the major version (e.g. 1.2.3 -> 2.0.0) |

The output should be a single html `docs/index.html` which is a static page containing everything needed to work offline. You may want to host his using GitHub Pages or your static hosting service of choice. If not using GitHub Pages you may want to add `/docs/` to your `.gitignore` file, otherwise:

ONLY COMMIT PRODUCTION BUILDS TO THE REPO

Semantic versioning is used to prompt users to update to the latest version of the sheet when you publish an update. When a local copy of the sheet is opened, the `LATEST_VERSION_URL` specified in `src/project/config.js` is checked for a more recent version of the sheet. Note: If a copy of the sheet does not exist at this URL, older versions will not prompt for updates, so if you need to change the hosting location, you should set up a redirect if possible.

A key feature of the site is the ability to save a local copy of the page as a single file that can later be accessed offline. This requires all assets to be inlined by Webpack. Any new content should be serialisable in an HTML file (e.g. HTML, CSS, JavaScript, dataURLs) and not depend on any external resources (e.g. CDNs). Consideration should also be given to the effect on filesize.
