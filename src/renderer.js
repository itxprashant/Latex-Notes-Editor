import './index.css';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup,  } from 'codemirror';
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { StreamLanguage } from "@codemirror/language";

// test stuffs
console.log('👋 This message is being logged by "renderer.js", included via webpack');
window.myAPI.doAThing()

// command buttons
const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
const fileContentElement = document.getElementById('fileContent')



// setup codemirror
export const editor = new EditorView({
    state: EditorState.create({
        extensions: [basicSetup,
            StreamLanguage.define(stex),
        ],
    }),
    parent: document.getElementById('editor')
})


export function clearEditor(){
  let content = editor.state.doc.toString();
  console.log(content);
  editor.dispatch({
    changes: { from: 0, to: editor.state.doc.length, insert: "" }
  });
}

const clearButton = document.getElementById('clearButton')
clearButton.addEventListener('click', async () => {
    clearEditor();
    console.log("cleared contents")
})

export function setEditorContents(contents) {
  editor.dispatch({
    changes: { from: 0, to: editor.state.doc.length, insert: contents }
  });
}

btn.addEventListener('click', async () => {
  const fileData = await window.electronAPI.openFile()
  filePathElement.innerText = fileData[0]
//   fileContentElement.innerText = fileData[1]
  setEditorContents(fileData[1])
})

const saveButton = document.getElementById('saveButton');

saveButton.addEventListener('click', async () => {
  const content = editor.state.doc.toString();
  const filePath = filePathElement.textContent; // Assuming this holds the current file path
  try {
    const savedFilePath = await window.electronAPI.saveFile(filePath, content);
    filePathElement.textContent = savedFilePath; // Update the file path if a new file was saved
    console.log('File saved:', savedFilePath);
  } catch (error) {
    console.error('Failed to save file:', error);
  }
});