/**
 * Functions for manipulating the form, including importing, exporting, and saving.
 */

import $ from "jquery";
import "jquery-deserialize";
import "jquery-serializejson";
import { saveAs } from "file-saver";

import { updateToggleButton, showInfo } from "./menu";
import { sheetName } from "./meta";
import { clearQuills, getQuillPages, setQuillPages } from "./pages";
import { migrations } from "../project/overrides.js";

/**
 * Resets the form and removes all Quill pages.
 */
export function formClear() {
  if (!confirm("Are you sure you want to clear the document?")) return;

  // Clear forms
  $("form").trigger("reset");

  // Reset menus
  $("input[type=hidden]").val(false); // Note this may not be a good assumption
  $(".toggleButton").each(updateToggleButton);
  showInfo();

  // Clear quills
  clearQuills();

  // Destroy all Quill pages
  setQuillPages();
}

/**
 * Loads the serialized sheet data from the "#sheetData" element.
 */
export function formLoad() {
  console.log("LOADING");

  var dataStr = $("#sheetData").text();
  if (dataStr) {
    console.log("LOADING FROM HTML");
    var data = JSON.parse(dataStr);
    // Update form
    doFormLoad(data);
  } else {
    console.log("NOTHING TO LOAD");
  }
}

/**
 * Clears the form and fills it with data, then draws the Quill pages.
 * @param {Object} data
 */
export function doFormLoad(data) {
  // Update form
  $("form").trigger("reset");
  $("form").each(function () {
    $(this).deserialize(data);
  });
  setQuillPages(data);
  // Reset menus
  $(".toggleButton").each(updateToggleButton);
  showInfo();
}

/**
 * Saves the entire site to file.
 * @param {*} event
 */
export function formSave(event) {
  event.preventDefault();
  console.log("SAVING");

  var data = getSaveData();

  var dataStr = JSON.stringify(data);
  $("#sheetData").text(dataStr);

  var blob = new Blob([getPageHTML()], { type: "text/html;charset=utf-8" });
  var fname = sheetName(data);
  saveAs(blob, fname);

  console.log("SAVED " + fname);
  // console.log(data);
}

/**
 * Returns a data object with everything necessary for filling the form.
 * @returns {Object}
 */
export function getSaveData() {
  var data = {};
  $("form").each(function () {
    Object.assign(data, $(this).serializeJSON());
  });

  // Add Quill pages
  Object.assign(data, getQuillPages());

  // Add sheet version (immutable)
  data["sheetVersion"] = $("#sheetVersion").text();

  return data;
}

/**
 * Prints the page.
 */
export function formExport() {
  window.print();
}

/**
 * Opens a file selection dialog for the user to select a sheet to import.
 * Then overrides the sheets data with the loaded data, migrating if needed.
 */
export function formImport() {
  if (!confirm("Any unsaved changes will be lost. Proceed?")) return;

  console.log("LOADING FROM IMPORT");

  var reader = new FileReader();
  reader.onload = (function (theFile) {
    return function (e) {
      var data = e.target.result;

      // Extract and parse sheet data
      var exp = /<div id="sheetData" hidden="">(.*?)<\/div>/im;
      var dataStr = exp.exec(data)[1];
      var data = JSON.parse(dataStr);

      if (migrations) {
        data = migrations(data);
      }

      // Update form
      doFormLoad(data);
    };
  })(f);

  // Read in the file as a data URL
  var f = $("#fileImport").prop("files")[0];
  reader.readAsText(f);
}

/**
 * Returns the serializable HTML from the site, excluding Quills and other
 * dynamically added content.
 * @returns {String}
 */
function getPageHTML() {
  // Strip everything injected using javascript
  var sheet = $("#sheetObj").detach();
  var styles = $("style").detach();
  var infoFrame = $("#infoPanel>iframe").detach();
  var pages = $(".extraPage").detach();
  $("body").removeAttr("data-gr-c-s-loaded");

  // Detach quill contents
  var quillParents = $(".quill_field");
  var quillPairs = [];
  quillParents.each(function (index, parent) {
    quillPairs.push({
      parent: $(parent),
      children: $(parent).children().detach(),
    });
  });

  // Get the html
  var html = document.documentElement.outerHTML;

  // Rebuild the document
  sheet.appendTo("#sheet");
  styles.appendTo("head");
  pages.appendTo("main");
  if (infoFrame) infoFrame.appendTo("#infoPanel");
  $("body").attr("data-gr-c-s-loaded", "true");

  // Reattach quill content
  for (var i = 0; i < quillPairs.length; i++) {
    quillPairs[i].children.appendTo(quillPairs[i].parent);
  }

  return "<!DOCTYPE html>" + html;
}
