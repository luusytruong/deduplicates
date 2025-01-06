import { processDeduplicates } from "./deduplicates.js";
import { processOnlyCorrect } from "./onlyCorrect.js";

const inputField = document.getElementById("input-text");
const toolName = document.getElementById("tool-name");
const btnPaste = document.getElementById("btn-paste");
const btnStart = document.getElementById("btn-start");
const btnSwitch = document.getElementById("btn-switch");
let state = 1;

//listener event click
btnPaste.addEventListener("click", async () => {
  const copyText = (await navigator.clipboard.readText()).trim();
  if (copyText !== "") {
    inputField.value += "\n" + copyText + "\n";
  } else {
    toast("Warning", "Clipboard empty");
  }
});

btnSwitch.addEventListener("click", () => {
  document.title = state === 1 ? "Only Correct Filter" : "Deduplicates Filter";
  toolName.innerText = state === 1 ? "Only Correct" : "Deduplicates";
  state = state === 1 ? 0 : 1;
});
btnStart.addEventListener("click", () => {
  state === 1
    ? processDeduplicates(inputField)
    : processOnlyCorrect(inputField);
});
