/**
 * Function relating to the info panel.
 */

import $ from "jquery";
import { SIDEBAR_URL } from "../project/config.js";

/**
 * Sets event handlers for toggle buttons.
 */
export function toggleButtonSetup() {
  $(".toggleButton").each(updateToggleButton);
  $(".toggleButton").on("click", { invert: true }, updateToggleButton);
}

/**
 * Event handler for toggle buttons.
 * Updates value to match state of corresponding checkbox.
 * State can be changed by passing an object like {data:{invert:true}}
 * @param {Object} event
 */
export function updateToggleButton(event) {
  var invert = (event && event.data && event.data.invert) == true;

  var id = $(this).attr("id");
  var cb = $(`input[name=${id}]`);
  var state = cb.val() === "true";

  if (invert) state = !state;

  $(this).toggleClass("btnOn", state);
  cb.val(state);
}

/**
 * Sets handlers for the info button so that it reflects the display state of
 * the info iframe.
 */
export function infoButtonSetup() {
  if (location.hostname !== "") {
    $("#opt_showInfo")
      .prop("disabled", true)
      .attr("title", "Save the sheet locally to enable this feature");
  } else {
    $("#opt_showInfo")
      .prop("disabled", false)
      .attr("title", "Toggle display of the sidebar")
      .on("click", showInfo);
  }
  showInfo();
}

/**
 * Shows the info panel if it is enabled, otherwise hides it.
 */
export function showInfo() {
  var state = $("input[name=opt_showInfo]").val() === "true";

  if (state && SIDEBAR_URL) {
    $("#infoPanel").show();

    if ($("#infoPanel").has("iframe").length == 0) {
      $(`<iframe id="infoFrame" src="${SIDEBAR_URL}"></iframe>`).appendTo(
        "#infoPanel"
      );
    }
  } else {
    $("#infoPanel").hide();
  }
}
