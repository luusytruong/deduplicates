import { toast } from "./deduplicates.js";

function cleanString(input) {
  return input
    .replace(/\*?[A-D]\.\s*/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[.,;:{}[\]()?""]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
    .trim();
}
let timeoutId;
//process text form input
export function processOnlyCorrect(input) {
  try {
    const text = input.value;
    let cAnswer = [];
    let qContent = "";
    let next = false;

    if (text !== "") {
      const lines = text.trim().split("\n");
      lines.forEach((line) => {
        if (line !== "") {
          if (line.includes("Question")) {
            next = true;
          } else if (next === true) {
            qContent = line;
            next = false;
          } else if (line.includes("*")) {
            cAnswer.push(cleanString(qContent + line));
          }
        }
      });
      if (cAnswer.length) {
        console.log(cAnswer);

        const jsonArr = JSON.stringify(cAnswer, null, 2);

        navigator.clipboard
          .writeText(jsonArr)
          .then(() => {
            toast(
              "Successful",
              `${cAnswer.length} Answers copied to clipboard`
            );
          })
          .catch((err) => {
            toast("Error", err);
          });
        return;
      }
      toast("Warning", "No question found");
      input.value = "";
    } else {
      toast("Error", "You must enter questions");
    }
  } catch (e) {
    toast("Error", e);
  }
}
