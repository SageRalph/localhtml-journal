/**
 * Functions for getting sheet metadata, and miscellaneous general functions.
 */

import $ from "jquery";
import { customSheetName } from "../project/overrides.js";
import { LATEST_VERSION_URL, DEFAULT_SHEET_NAME } from "../project/config.js";

/**
 * Returns a suggested filename for the sheet.
 * @returns {String}
 * @param {Object} data
 */
export function sheetName(data) {
  // Put your custom file naming logic here.
  // e.g. baseName = data["nameField"]

  var baseName = DEFAULT_SHEET_NAME;
  if (customSheetName) {
    baseName = customSheetName(data) || baseName;
  }

  return baseName + ".html";
}

/**
 * Returns whether the data object is from a version prior to target.
 * Must use semantic versioning.
 * @param {Object} data
 * @param {String} target
 */
export function versionBefore(data, target) {
  var old = "sheetVersion" in data ? data["sheetVersion"] : "0.0.0";
  return versionCompare(old, target) < 0;
}

/**
 * Compares semantic versions.
 * Returns 1 if v1 is greater, -1 if v2 is greater, 0 if match.
 * @param {String} v1
 * @param {String} v2
 */
function versionCompare(v1, v2) {
  var v1parts = v1.split(".").map(Number);
  var v2parts = v2.split(".").map(Number);
  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) return 1;
    if (v1parts[i] == v2parts[i]) continue;
    else if (v1parts[i] > v2parts[i]) return 1;
    else return -1;
  }
  if (v1parts.length != v2parts.length) return -1;
  return 0;
}

/**
 * Returns a random string of length N.
 * @returns {String}
 * @param {Int} N
 */
export function randomString(N) {
  return (Math.random().toString(36) + "00000000000000000").slice(2, N + 2);
}

export function updateCheck() {
  console.log("CHECKING FOR UPDATES");
  var url = LATEST_VERSION_URL + "?update";
  $.get(url, function (data) {
    var match = data.match(/Build version: (.+?) -/);
    var latest = match[1];
    var current = $("#sheetVersion").text();
    console.log("CURRENT VERSION: " + current);
    console.log("LATEST VERSION: " + latest);
    if (versionBefore({ sheetVersion: current }, latest)) {
      console.log("NEWER VERSION AVAILABLE");
      if (
        confirm(
          "A new document version is available. You can import this document to the new version. Would you like to update now?"
        )
      ) {
        window.open(url, "_blank").focus();
      }
    } else {
      console.log("UP TO DATE");
    }
  });
}

/**
 * Hides and then fades in whatever element is bound to this.
 * e.g. $().click(blink)
 */
export function blink() {
  $(this).css({ opacity: 0 }).animate({ opacity: 1 }, 1000);
}
