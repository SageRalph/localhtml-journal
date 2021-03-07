/**
 * Functions for managing Quill pages and Quill fields.
 * Extra pages are full page sized Quill editors.
 */

import $ from "jquery";
import Quill from "quill";
import { dataChanged } from "./index";
import { randomString } from "./meta";

var quills = [];
var extraPages = [];

export function initQuills() {
  $(".quill_field").each((i, element) => setupQuill(element));
}

/**
 * Creates a new Quill page with a random name.
 * The Quill pages are then redrawn.
 */
export function addPage() {
  var name = `longinfo_Extra_${randomString(8)}`;
  extraPages.push(name);
  buildExtraPages();
}

/**
 * Removes Quill page at index.
 * The Quill pages are then redrawn.
 * @param {*} index
 */
export function removePage(index) {
  if (!confirm("Are you sure you want to remove this page?")) return;
  extraPages.splice(index, 1);
  buildExtraPages();
}

/**
 * Reorders the list of Quill pages, moving page at index from to index to.
 * The Quill pages are then redrawn.
 * @param {Int} from
 * @param {Int} to
 */
export function movePage(from, to) {
  // remove `from` item and store it
  var f = extraPages.splice(from, 1)[0];
  // insert stored item into position `to`
  extraPages.splice(to, 0, f);
  buildExtraPages();
}

/**
 * Deletes the content of all Quill fields.
 */
export function clearQuills() {
  for (var i = 0; i < quills.length; i++) {
    quills[i].editor.setContents();
  }
}

/**
 * Returns an object with the content of all Quill fields as properties.
 * The returned object will also have an array property "extraPages" with the names of each Quill page.
 */
export function getQuillPages() {
  var data = {};
  for (var i = 0; i < quills.length; i++) {
    var q = quills[i];
    data[q.name] = q.editor.getContents();
  }
  data["extraPages"] = extraPages;
  return data;
}

/**
 * Rebuilds Quill pages to match the array data[extraPages] and populates them
 * from data[name] where name is a value in data[extraPages]. If either data or
 * data[extraPages] are empty or not set, all current Quill pages are destroyed.
 * @returns {Object}
 */
export function setQuillPages(data) {
  extraPages = data && "extraPages" in data ? data["extraPages"] : [];
  buildExtraPages(data);
}

/**
 * Destroys any Quill instances on the page and then removes the page.
 * @param {*} element The page element
 */
function destroyPage(element) {
  // All quills on this page need to be destroyed first
  var childQuillNames = $(element)
    .find(".quill_field")
    .map((i, e) => $(e).attr("name"))
    .get();

  // console.log("EXTRANEOUS QUILLS: ", childQuillNames);

  // Loop through all existing quills and destroy any on this page
  var keepQuills = [];
  for (var i = 0; i < quills.length; i++) {
    var q = quills[i];
    if (childQuillNames.includes(q.name)) {
      // console.log("DESTROYING QUILL: " + q.name);
      q.editor.enable(false);
      q.editor = null;
    } else {
      // console.log("KEEPING QUILL: " + q.name);
      keepQuills.push(q);
    }
  }
  quills = keepQuills;

  $(element).remove();
}

/**
 * Overrides the content of Quill editors to match values in data.
 * Quills not present in data are not modified.
 * @param {Object} data
 */
function loadQuills(data) {
  // Add quill data
  for (var i = 0; i < quills.length; i++) {
    var q = quills[i];
    if (q.name in data) {
      var d = data[q.name];
      if (typeof d === "string") {
        // Backwards compatibility for importing previously non-quill fields
        console.log("MIGRATING " + q.name);
        q.editor.setText(d);
      } else {
        q.editor.setContents(d);
      }
    }
  }
}

/**
 * Creates a Quill editor inside element.
 * If element has the class "quill_advanced", the editor will have a toolbar.
 * @param {*} element
 */
function setupQuill(element) {
  // Settings for Quills with a context menu
  var optionsSimple = {
    modules: {
      toolbar: [
        [
          "bold",
          "italic",
          "underline",
          { color: [] },
          "link",
          "blockquote",
          { list: "ordered" },
          { list: "bullet" },
        ],
      ],
    },
    theme: "bubble",
  };
  // Settings for Quills with a toolbar (must have the quill_advanced CSS class)
  var optionsAdvanced = {
    modules: {
      toolbar: [
        [
          { header: [1, 2, false] },
          { indent: "-1" },
          { indent: "+1" },
          "bold",
          "italic",
          "underline",
          { color: [] },
          "link",
          "blockquote",
          { list: "ordered" },
          { list: "bullet" },
          "image",
        ],
      ],
    },
    theme: "snow",
  };
  var isAdvanced = $(element).hasClass("quill_advanced");
  var options = isAdvanced ? optionsAdvanced : optionsSimple;
  var child = $("<div></div>").get(0);
  $(element).append(child);
  var editor = new Quill(child, options);
  editor.on("text-change", quillChangeCooldown);
  quills.push({
    name: $(element).attr("name"),
    editor,
  });
}

// Limit the number of calls to dataChanged
// Calls are delayed by 5s and subsequent calls are ignored until then
var quillCooldown = false;
function quillChangeCooldown() {
  if (!quillCooldown) {
    quillCooldown = true;
    setTimeout(function () {
      quillCooldown = false;
      dataChanged();
    }, 5000);
  }
}

/**
 * Draws an Quill page and sets up its Quill.
 * @param {*} name
 * @param {*} index
 */
function setupExtraPage(name, index) {
  // Create page HTML
  var preSize = $(".page").length; // Number of static pages
  var parent = $(`
    <div class="pageWrapper extraPage">
      <div class="pageToolbar">
        <h2>Page ${index + preSize + 1} of ${extraPages.length + preSize}</h2>
        <div class="buttonWrapper">
          <button class="btn_delete" title="Remove this page">⮿</button>
          <button class="btn_up" title="Swap this page with the one above">⯅</button>
          <button class="btn_down" title="Swap this page with the one below">⯆</button>
        </div>
      </div>
      <div class="pageArea">
        <article
          name="${name}"
          class="quill_field quill_advanced quill_page"
        ></article>
      </div>
    </div>
    `);
  parent.appendTo($("#content"));

  // Setup buttons
  parent.find(".btn_delete").on("click", removePage.bind(null, index));
  parent.find(".btn_up").on("click", movePage.bind(null, index, index - 1));
  parent.find(".btn_down").on("click", movePage.bind(null, index, index + 1));
  if (index == 0) parent.find(".btn_up").prop("disabled", true);
  if (index == extraPages.length - 1)
    parent.find(".btn_down").prop("disabled", true);

  // Setup Quill
  var child = parent.find(`[name="${name}"]`).first();
  setupQuill(child);
}

/**
 * Draws all Quill pages to match extraPages, using content from data.
 * @param {Object} data
 */
function buildExtraPages(data) {
  if (!data) {
    // Keep existing quill data if not overriding
    data = {};
    for (var i = 0; i < quills.length; i++) {
      var q = quills[i];
      data[q.name] = q.editor.getContents();
    }
  }

  // Destroy existing Quill pages
  $(".extraPage").each((i, element) => destroyPage(element));

  // Add any Quill pages
  extraPages.forEach((name, index) => setupExtraPage(name, index));

  loadQuills(data);
}
