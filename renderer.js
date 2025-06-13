import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { StreamLanguage } from "@codemirror/language";
import { syntaxTree } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
import { myCompletions } from "./latex-completions";
import { snippet } from "@codemirror/autocomplete";


// Create a completion source
const myCompletionSource = (context) => {
  let word = context.matchBefore(/\w*/);
  if (!word) return null;
  return {
    from: word.from,
    options: myCompletions,
  };
};


export const editor = new EditorView({
  state: EditorState.create({
    // doc: "% Write your LaTeX here...",
    extensions: [
      basicSetup, 
      StreamLanguage.define(stex),
      autocompletion(
      //   {
      //   override: [myCompletionSource],
      // }
    ),
    // snippet(),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const doc = update.state.doc.toString();
          console.log("Document changed:", doc);
          // Here you can handle the document change, e.g., send it to a server
          // or update some other part of your application.

          // show the syntax tree in the console
          const tree = syntaxTree(update.state);
          console.log("Syntax Tree:", tree);

          // get cursor position
          const cursor = update.state.selection.main.head;
          console.log("Cursor position:", cursor);

          // if the cursor is in math mode, log the math content
          const mathNode = tree.resolve(cursor, -1);
          console.log("Math Node:", mathNode);
        //   if (mathNode && mathNode.name === "Math") {
        //     const mathContent = update.state.sliceDoc(mathNode.from, mathNode.to);
        //     console.log("Math content:", mathContent);
        //   } else {
        //     console.log("Cursor is not in math mode.");
          let nodeBefore = syntaxTree(update.state).resolveInner(cursor, -1);
          console.log("Node before is", nodeBefore.name);
      }
      }),
    ]
  }),
  parent: document.getElementById('editor')
});