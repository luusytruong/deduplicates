const { Document, Packer, Paragraph, TextRun } = docx;
let uniqueKey = "";
//fuction log array
function logArray(arr) {
  arr.forEach((item) => {
    console.log(item);
  });
}

//clean text
function cleanString(input) {
  return input
    .replace(/\*?[A-D]\.\s*/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[.,;:{}[\]()?""]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
    .trim();
}

//generate unique key
function generateUniqueKey(qContent, qOption) {
  let formatArray = [];
  qOption.forEach((op) => {
    formatArray.push(cleanString(op));
  });
  const optionStr = formatArray.slice().sort();
  return cleanString(qContent + optionStr);
}

//process text form input
export function processDeduplicates(input) {
  try {
    const text = input.value;
    let rawArray = [];
    let next = false;
    let qContent = "";
    const labelAnswers = ["A.", "B.", "C.", "D."];
    let qOption = [];

    if (text !== "") {
      const lines = text.trim().split("\n");
      lines.forEach((line) => {
        line = line.trim();
        if (line !== "") {
          if (line.includes("Question")) {
            if (qContent !== "") {
              rawArray.push({
                key: generateUniqueKey(qContent, qOption),
                content: qContent,
                options: qOption,
              });
              qOption = [];
            }
            next = true;
          } else if (next === true) {
            next = false;
            qContent = line;
          } else {
            if (labelAnswers.some((label) => line.includes(label))) {
              qOption.push(line);
            }
          }
        }
      });

      if (qContent !== "") {
        rawArray.push({
          key: generateUniqueKey(qContent, qOption),
          content: qContent,
          options: qOption,
        });
      }
      if (rawArray.length) {
        const finalArray = removeDuplicates(rawArray);
        console.log(
          "%cbefore " + rawArray.length,
          "color: #00EE00; font-size: 40px;"
        );
        // logArray(rawArray);
        console.log(
          "%cafter " + finalArray.length,
          "color: #00EE00; font-size: 40px;"
        );
        // logArray(finalArray);
        generateDoc(finalArray);
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
//remove duplicate in arr
function removeDuplicates(arr) {
  try {
    let uQuestion = new Set();
    let uArray = [];

    arr.forEach((question) => {
      if (!uQuestion.has(question.key)) {
        uQuestion.add(question.key);
        uArray.push(question);
      }
    });

    return uArray;
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
    let font = "Times New Roman";

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

      const questionParagraph = new Paragraph({
        children: [
          new TextRun({
            text: question.content,
            bold: true,
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
      toast("Successful", `File with ${arr.length} questions is downloading`);
    });
  } catch (e) {
    toast("Error", e);
  }
}

//toast
let timeoutId;
export function toast(status, content) {
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
      }, 3200);
    }, 8);
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
