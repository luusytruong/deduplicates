const { Document, Packer, Paragraph, TextRun } = docx;
const btnStart = document.getElementById("btn-start");
//process text form input
function process() {
  try {
    const text = document.getElementById("input-text").value;
    let arr = [];
    let nextIsQuestion = false;
    let questionText = "";
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
            options.push(line);
          }
        }
      });

      if (questionText !== "") {
        arr.push({
          content: questionText,
          options: options,
        });
      }

      generateDoc(removeDuplicates(arr));
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
    let uniqueQuestions = new Set();
    let uniqueArr = [];

    arr.forEach((question) => {
      if (!uniqueQuestions.has(question.content)) {
        uniqueQuestions.add(question.content);
        uniqueArr.push(question);
      }
    });

    return uniqueArr;
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
      saveAs(blob, "questions.docx");
      toast("Successful", "File is downloading");
    });
  } catch (e) {
    toast("Error", e);
  }
}

//toast
function toast(status, content) {
  try {
    let icon = null;
    let toastElem = document.getElementById("toast");
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
    setTimeout(() => {
      toastElem.className = `${status.toLowerCase()} animate`;
    }, 4000);
  } catch (e) {
    alert("Error: " + e);
  }
}
//listener event click
btnStart.addEventListener("click", () => {
  process();
});