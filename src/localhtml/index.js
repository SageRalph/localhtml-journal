/**
 * Program entrypoint.
 * Runs initialisation, loads the assets, and sets event listeners.
 */

import $ from "jquery";

import "./styles.css";
import "../../node_modules/quill/dist/quill.bubble.css";
import "../../node_modules/quill/dist/quill.snow.css";

import { addPage, initQuills } from "./pages";
import { blink, updateCheck, sheetName } from "./meta";
import { toggleButtonSetup, infoButtonSetup } from "./menu";
import {
  formClear,
  formExport,
  formImport,
  formLoad,
  formSave,
  getSaveData,
  doFormLoad,
} from "./form";
import { onDataChange } from "../project/overrides";

/**
 * Initial page setup.
 */
$(() => {
  console.log("SETUP QUILLS");
  initQuills();

  console.log("SETUP FORM");
  formLoad();
  $("form, .quill_field").on("change", dataChanged);

  console.log("SETUP TOGGLE BUTTONS");
  toggleButtonSetup();

  console.log("SETUP INFO");
  infoButtonSetup();

  console.log("SETUP BUTTONS");
  $("#btnSave").on("click", formSave); // This needs to start before the blink effect

  // All buttons blink when clicked
  $("button").on("click", blink);

  $("#btnClear").on("click", formClear);
  $("#btnExport").on("click", formExport);
  $("#btnAdd").on("click", addPage);

  // Click file import when Import button is clicked
  $("#btnImport").on("click", (e) => {
    $("#fileImport").trigger("click");
  });
  $("#fileImport").on("change", formImport);

  if (window.location.href.endsWith("?update")) {
    alert(
      "This is the latest document version. To update an existing document click the Import button."
    );
  } else {
    updateCheck();
  }
});

/**
 * Override hotkeys.
 */
$(window).on("keydown", function (event) {
  // Override CTRL+S to save the site data properly
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case "s":
        event.preventDefault();
        formSave(event);
    }
  }
});

/**
 * Called whenever the contents of the sheet is changed.
 */
var dataChangedAction;
export function dataChanged() {
  if (dataChangedAction) dataChangedAction();
}
export function setDataChangedAction(f) {
  dataChangedAction = f;
}

// These function are exposed after building
// This may be useful if the sheet is included as part of a webapp.
window.getSaveData = getSaveData;
window.doFormLoad = doFormLoad;
window.sheetName = sheetName;
window.formClear = formClear;
window.setDataChangedAction = setDataChangedAction;
window.$ = $;
