import './index.css';
import { myCompletions } from './latex-completions';
import { createEditor, clearEditor, setEditorContents } from './editor_utils';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

// test stuffs
console.log('👋 This message is being logged by "renderer.js", included via webpack');
window.myAPI.doAThing()

// command buttons
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const fileContentElement = document.getElementById('fileContent')



// setup codemirror
export const editor = createEditor();

// terminal
// const terminalContainer = document.getElementById('terminal');
// const term = new Terminal();
// const fitAddon = new FitAddon();
// term.loadAddon(fitAddon);
// term.open(terminalContainer);
// fitAddon.fit();

// term.writeln("Welcome to xtermjs terminal!!");


// term.onData(data => {
//   term.write(data);
// })

const clearButton = document.getElementById('clearButton')
clearButton.addEventListener('click', async () => {
  clearEditor(editor);
  console.log("cleared contents")
})


btn.addEventListener('click', async () => {
  const fileData = await window.electronAPI.openFile()
  filePathElement.innerText = fileData[0]
  //   fileContentElement.innerText = fileData[1]
  setEditorContents(editor, fileData[1])
})

const saveButton = document.getElementById('saveButton');
const saveAsButton = document.getElementById('saveAsButton');

saveButton.addEventListener('click', async () => {
  const content = editor.state.doc.toString();
  const filePath = filePathElement.innerText; // Assuming this holds the current file path
  try {
    await window.electronAPI.saveFile(filePath, content);
    // filePathElement.innerText = savedFilePath; // Update the file path if a new file was saved
    console.log('File saved:', filePath);
  } catch (error) {
    console.error('Failed to save file:', error);
  }
});

saveAsButton.addEventListener('click', async () => {
  const content = editor.state.doc.toString();
  const filePath = filePathElement.innerText; // Assuming this holds the current file path
  try {
    await window.electronAPI.saveFileAs(filePath, content);
    // filePathElement.innerText = savedFilePath; // Update the file path if a new file was saved
    console.log('File saved:', filePath);
  } catch (error) {
    console.error('Failed to save file:', error);
  }
});

const compileBtn = document.getElementById("compileButton");

compileBtn.addEventListener('click', async () => {
  const filePath = filePathElement.innerText;
  await window.electronAPI.compileFile(filePath);

})

const viewLogsButton = document.getElementById('viewLogsButton');
viewLogsButton.addEventListener('click', async () => {
  const logs = await window.electronAPI.getLogs();
  console.log(logs);
  // display logs in a modal or a new window
  const logwindow = window.open('', '_blank');
  logwindow.document.write('<pre>' + logs + '</pre>');
});

// create an iframe pdf viewer
const viewPDFButton = document.getElementById('viewPDFButton');

viewPDFButton.addEventListener('click', async () => {
  // const pdfPath = './exported/document.pdf'; // Replace with your actual PDF path

  const pdfPath = await window.electronAPI.getPDF(filePathElement.innerText);

  // Check if the PDF file exists
  try {
    const pdfViewer = window.open('', '_blank');
    pdfViewer.document.write(`<iframe src="${pdfPath}" width="100%" height="100%"></iframe>`);
  } catch (error) {
    console.error('PDF file does not exist:', error);
    alert('PDF file does not exist. Please compile the LaTeX document first.');
  }
})