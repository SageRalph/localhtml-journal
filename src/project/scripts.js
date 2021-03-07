/* 
These are some example scripts. 
You can add more JS files by importing them here or in overrides.js 
*/

import $ from "jquery";
import { getSaveData } from "../localhtml/form.js";

/**
 * These are some example of how you can get and modify the sheet data.
 * You can modify values by modifying the form controls with jQuery.
 */
$("#myButton").on("click", doTheThing);
function doTheThing(e) {
  e.preventDefault();
  var textField1Value = $("[name=textField1]").val();
  $("[name=textField2]").val(textField1Value);
}

$("[name=textField3]").on("change", doTheOtherThing);
$("[name=textField4]").on("change", doTheOtherThing);
function doTheOtherThing(e) {
  e.preventDefault();
  // getSaveData returns the sheet data object with keys for each named form input
  // This may be slower then just querying what you need with jQuery
  var data = getSaveData();
  $("[name=textField3]").val(data["textField4"]);
  $("[name=textField4]").val(data["textField3"]);
}

// Example custom menu button
$("#myMenuButton").on("click", function () {
  alert("Custom menu button clicked!");
});
