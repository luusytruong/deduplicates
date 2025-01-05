const cleanedText = (text) => text.replace(/^\*[A-D]\.\s*/, "");
//process text form input
export function processOnlyCorrect(input) {
  try {
    const text = input.value;
    let arr = [];
    let nextIsQuestion = false;
    let questionText = "";
    let correctAnswer = "";
    let arrAnswers = [];

    if (text !== "") {
      const lines = text.trim().split("\n");

      lines.forEach((line) => {
        if (line !== "") {
          line = line.trim();
          if (line.includes("Question")) {
            if (questionText !== "") {
              arr.push({
                content: questionText,
                arrAnswers: arrAnswers,
              });
              arrAnswers = [];
            }
            nextIsQuestion = true;
          } else if (nextIsQuestion) {
            nextIsQuestion = false;
            questionText = line;
          } else {
            if (line.includes("*")) {
              correctAnswer = cleanedText(line).trim();
              arrAnswers.push(correctAnswer);
            }
          }
        }
      });

      if (questionText !== "") {
        arr.push({
          content: questionText,
          arrAnswers: arrAnswers,
        });
      }
      if (arr.length) {
        // arr.forEach((q, index) => {
        //   console.log(index + 1 + q.correctAnswer);
        // });
        const jsonArr = JSON.stringify(arr, null, 2);

        navigator.clipboard
          .writeText(jsonArr)
          .then(() => {
            toast("Successful", `${arr.length} Question copied to clipboard`);
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

//toast
let timeoutId;
function toast(status, content) {
  try {
    let icon = null;
    let toastinput = document.getElementById("toast");
    toastinput.className = ``;
    clearTimeout(timeoutId);
    setTimeout(() => {
      if (status === "Successful") {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`;
      } else if (status === "Error") {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`;
      } else {
        icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`;
      }
      toastinput.className = `${status.toLowerCase()}`;
      toastinput.querySelector(".toast-icon").innerHTML = icon;
      toastinput.querySelector(".toast-title").innerText = status;
      toastinput.querySelector(".toast-content").innerText = content;
      timeoutId = setTimeout(() => {
        toastinput.className = `${status.toLowerCase()} animate`;
      }, 2400);
    }, 8);
  } catch (e) {
    alert("Error: " + e);
  }
}
