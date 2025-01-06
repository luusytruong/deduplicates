import { toast } from "./deduplicates.js";

function cleanString(input) {
  return input
    .replace(/\*[A-D]\.\s*/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[.,;:{}[\]()]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
    .trim();
}
let timeoutId;
//process text form input
export function processOnlyCorrect(input) {
  try {
    const text = input.value;
    let correctAnswer = [];
    let questionContent = "";
    let next = false;

    if (text !== "") {
      const lines = text.trim().split("\n");
      lines.forEach((line) => {
        if (line !== "") {
          if (line.includes("Question")) {
            next = true;
          } else if (next === true) {
            questionContent = line;
            next = false;
          } else if (line.includes("*")) {
            correctAnswer.push(cleanString(questionContent + line));
          }
        }
      });
      if (correctAnswer.length) {
        console.log(correctAnswer);

        const jsonArr = JSON.stringify(correctAnswer, null, 2);

        navigator.clipboard
          .writeText(jsonArr)
          .then(() => {
            toast(
              "Successful",
              `${correctAnswer.length} Answers copied to clipboard`
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
