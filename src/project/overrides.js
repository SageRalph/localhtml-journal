/*******************************************************************************
 * This file contains custom logic to override the default behavior of localhtml
 ******************************************************************************/
import { versionBefore } from "../localhtml/meta.js";
import { setDataChangedAction } from "../localhtml/index.js";

// Import any additional files you want webpack to bundle. CSS, JS, fonts, etc.
import "./styles.css";
import "./scripts.js";

/**
 * Return a suggested filename when saving the sheet.
 * @returns {String} The suggested filename (without extension)
 * @param {Object} data The sheet data object with keys for each named form input
 */
export function customSheetName(data) {
  // Put your custom file naming logic here.
  // If the return value is falsy, config.DEFAULT_SHEET_NAME is used instead.
  return data["fileNameField"];
}

/**
 * Modifies the data object to comply with any format changes when importing.
 * @param {Object} data The old sheet data object with keys for each named form input
 */
export function migrations(data) {
  // The data parameter will be in the format of the version it was imported from
  // The return object should be in the format for this version
  //
  // versionBefore is a handy function for checking how old the data format is.
  // It compares the semantic version of data object to the string provided
  //
  // If the version cannot be migrated, you can throw an error here

  if (versionBefore(data, "1.0.0")) {
    console.log("RUNNING MIGRATION: Updating from pre-release!");
    // data['newFieldName'] = data['oldFieldName']
  }
  return data;
}

/**
 * Called whenever the contents of the sheet is changed.
 */
setDataChangedAction(function () {
  // Prevent accidental navigation
  window.onbeforeunload = function () {
    return true;
  };
});
