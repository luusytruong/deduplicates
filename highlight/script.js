const { Document, Packer, Paragraph, TextRun } = docx;
const inputField = document.getElementById("input-text");
const btnStart = document.getElementById("btn-start");
const btnSwitch = document.getElementById("btn-switch");
//process text form input
function process() {
  try {
    const text = document.getElementById("input-text").value;
    let arr = [];
    let nextIsQuestion = false;
    let questionText = "";
    const labelAnswers = ["A.", "B.", "C.", "D."];
    let options = [];
    if (text !== "") {
      const lines = text.trim().split("\n");

      lines.forEach((line) => {
        if (line !== "") {
          line = line.trim();
          if (line.includes("Question")) {
            if (questionText !== "") {
              arr.push({
                content: questionText,
                options: options,
              });
              options = [];
            }
            nextIsQuestion = true;
          } else if (nextIsQuestion) {
            nextIsQuestion = false;
            questionText = line;
          } else {
            if (labelAnswers.some((label) => line.includes(label))) {
              options.push(line);
            }
          }
        }
      });

      if (questionText !== "") {
        arr.push({
          content: questionText,
          options: options,
        });
      }
      if (arr.length) {
        generateDoc(arr);
        return;
      }
      toast("Error", "No question found");
    } else {
      toast("Error", "You must enter questions");
    }
  } catch (e) {
    toast("Error", e);
  }
}
//generator docx
function generateDoc(arr) {
  try {
    const doc = new Document({
      creator: "luu sy truong",
      sections: [],
    });

    const sectionChildren = [];
    let size = 24;
    let font = "Calibri";
    const questionCount = {};

    arr.forEach((question) => {
      questionCount[question.content] =
        (questionCount[question.content] || 0) + 1;
    });

    arr.forEach((question, index) => {
      const labelParagraph = new Paragraph({
        children: [
          new TextRun({
            text: `Question ${index + 1}`,
            size: size,
            font: font,
          }),
        ],
      });

      const isDuplicate = questionCount[question.content] > 1;

      const questionParagraph = new Paragraph({
        children: [
          new TextRun({
            text: question.content,
            bold: true,
            color: isDuplicate ? "#FF4500" : undefined,
            size: size,
            font: font,
          }),
        ],
      });

      sectionChildren.push(labelParagraph, questionParagraph);

      question.options.forEach((option) => {
        const optionParagraph = new Paragraph({
          children: [
            new TextRun({
              text: option.includes("*") ? option : option,
              bold: option.includes("*"),
              color: option.includes("*") ? "00BB00" : undefined,
              size: size,
              font: font,
            }),
          ],
        });
        sectionChildren.push(optionParagraph);
      });
      //add break point
      sectionChildren.push(new Paragraph({ text: "" }));
    });
    //add arr to doc
    doc.addSection({
      children: sectionChildren,
    });
    //save to pc
    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `questions-${getDateTime("date") + "_" + getDateTime()}.docx`
      );
      toast("Successful", "File is downloading");
    });
  } catch (e) {
    toast("Error", e);
  }
}
//toast
let timeoutId;
function toast(status, content) {
  try {
    function timeout(option) {
      if (option === "call") {
        timeoutId = setTimeout(() => {
          toastElem.className = `${status.toLowerCase()} animate`;
        }, 4000);
      } else {
        clearTimeout(timeoutId);
      }
    }

    let icon = null;
    let toastElem = document.getElementById("toast");
    toastElem.className = ``;
    timeout();
    setTimeout(() => {
      if (status === "successful") {
        icon =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
      } else {
        icon =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';
      }
      toastElem.className = `${status.toLowerCase()}`;
      toastElem.querySelector(".toast-icon").innerHTML = icon;
      toastElem.querySelector(".toast-title").innerText = status;
      toastElem.querySelector(".toast-content").innerText = content;
      timeout("call");
    }, 1);
  } catch (e) {
    alert("Error: " + e);
  }
}
//get date time
function getDateTime(option) {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  if (option === "date") {
    return `${year}/${month < 10 ? "0" + month : month}/${
      day < 10 ? "0" + day : day
    }`;
  } else {
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  }
}
//listener event keydown
inputField.addEventListener("keydown", (e) => {
  const control = [
    "Backspace",
    "Enter",
    "ArrowUp",
    "ArrowRight",
    "ArrowDown",
    "ArrowLeft",
  ];
  const allowKey = ["c", "v", "a"];
  if ((e.ctrlKey && allowKey.includes(e.key)) || control.includes(e.key)) {
    return;
  }
  e.preventDefault();
});

//listener event click
btnStart.addEventListener("click", () => {
  process();
});
//listener event click
btnSwitch.addEventListener("click", () => {
  window.location.href = "../";
});
console.log(getDateTime("date"), getDateTime());
