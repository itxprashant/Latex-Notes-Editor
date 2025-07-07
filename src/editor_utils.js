import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup, } from 'codemirror';
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { StreamLanguage } from "@codemirror/language";
import { myCompletions, myCompletionSource } from './latex-completions';
import { autocompletion, CompletionContext, snippetCompletion } from "@codemirror/autocomplete";
import { syntaxTree } from '@codemirror/language';

export function isCursorInMathMode(editor) {
    const cursorPos = editor.state.selection.main.head;
    const tree = syntaxTree(editor.state);
    let nodeAtCursor = tree.resolve(cursorPos);

    while (nodeAtCursor) {
        console.log(`Node is: ${nodeAtCursor.name}`);
        if (nodeAtCursor.name === 'Math') {
            console.log("Found Math node at cursor position");
            return true;
        }
        nodeAtCursor = nodeAtCursor.parent;
    }

    // Check if the node at the cursor is a math node
}

export function checkIfBetween(editor, tag){
    const cursorPos = editor.state.selection.main.head;
    const textBefore = editor.state.doc.sliceString(0, cursorPos);
    const textAfter = editor.state.doc.sliceString(cursorPos);

    // const beforeRegex = new RegExp(`\\begin\{${tag}\}`);
    // const afterRegex = new RegExp(`\\end\{${tag}\}`);
    const beforeRegex = new RegExp(`\\\\begin\\\{${tag}\\\}`);
    const afterRegex = new RegExp(`\\\\end\\\{${tag}\\\}`);

    // match the text before the cursor
    const beforeMatch = textBefore.match(beforeRegex);
    // match the text after the cursor
    const afterMatch = textAfter.match(afterRegex);
    return (beforeMatch && afterMatch) ? true : false;
}


export function createEditor() {
    const editor = new EditorView({
        state: EditorState.create({
            extensions: [basicSetup,
                StreamLanguage.define(stex),
                autocompletion({
                    override: [myCompletionSource,
                        (context) => {
                            const matchBefore = context.matchBefore(/\w+/)
                            console.log("From is : ", matchBefore)

                            if (!matchBefore) {
                                return null;
                            }

                            console.log(context)

                            return {
                                from: matchBefore.from,
                                options: [
                                    snippetCompletion('\\begin{document}\n#{}\n\\end{document}',
                                        {
                                            label: 'begin',
                                        }
                                    )
                                ]
                            }
                        }
                    ],
                }),

                EditorView.updateListener.of((update) => {
                    if (update.changes) {
                        console.log(`is between: ${checkIfBetween(editor, 'cult')}`);
                    }
                }),

                
            ],
        }),
        parent: document.getElementById('editor')
    })

    return editor;

}

export function getEditorContents(editor){
    return editor.state.doc.toString();
}

export function clearEditor(editor) {
    let content = editor.state.doc.toString();
    // console.log(content);
    editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: "" }
    });
}

export function setEditorContents(editor, contents) {
    editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: contents }
    });
}

