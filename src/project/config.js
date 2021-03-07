/**
 * This file contains project specific configuration parameters.
 */
module.exports = {
  // When a local copy of the sheet is opened, this URL is checked for a more recent version of the sheet.
  // Note: If a copy of the sheet does not exist at this URL, older versions will not prompt for updates,
  // so if you need to change the hosting location, you should set up a redirect if possible.
  LATEST_VERSION_URL: "https://davidralph.github.io/localhtml-journal/",

  // Page title
  TITLE: "Journal",

  // Default filename when saving a sheet
  // You can specify a programmatic way of determining the filename in src/overrides.js
  DEFAULT_SHEET_NAME: "Journal",

  // If set, a toggleable sidebar will display the site in an iframe.
  // Useful for providing news or other info you don't want to store in the document.
  // This feature is unavailable offline as the content is not saved.
  SIDEBAR_URL: "https://en.m.wikipedia.org/wiki/?mobileaction=toggle_view_mobile"
};
