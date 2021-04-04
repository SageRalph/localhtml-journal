import "./styles.css";
import "localhtml-lib";
import pkg from "../package.json";

function customSheetName(data) {
  return [data["coverLine1"], data["coverLine2"], data["coverLine3"]]
    .filter(Boolean)
    .join(" - ");
}
function migrations(data) {
  if (localhtml.api.versionBefore(data, "1.0.0")) {
    console.log("RUNNING MIGRATION: Updating from pre-release!");
  }
  return data;
}

function dataChangedAction() {
  // Prevent accidental navigation
  window.onbeforeunload = function () {
    return true;
  };
}

new localhtml({
  version: pkg.version,
  documentContainer: "#documentContainer",
  menuContainer: "#menuContainer",
  infoContainer: "#infoContainer",
  formSelector: "form",
  dataChangedAction: dataChangedAction,
  dataChangedCooldown: 3000,
  migrations: migrations,
  defaultSheetName: "Journal",
  customSheetName: customSheetName,
  infoURL: "https://en.m.wikipedia.org/wiki/?mobileaction=toggle_view_mobile",
  latestVersionURL: "https://davidralph.github.io/localhtml-journal/",
  hotkeysEnabled: true,
  log: console.log,
});
