import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup, } from 'codemirror';
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { StreamLanguage } from "@codemirror/language";
import { myCompletions, myCompletionSource } from './latex-completions';
import { autocompletion, CompletionContext, snippetCompletion } from "@codemirror/autocomplete";
import { syntaxTree } from '@codemirror/language';

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
                        const tree = syntaxTree(update.state);
                        const cursor = update.state.selection.main.head;
                        let inMathMode = false;

                        tree.iterate({
                            enter: (node) => {
                                console.log("node is: ", node)
                                if (node.type.name === "MathShift" || node.type.name === "InlineMath") {
                                    if (cursor >= node.from && cursor <= node.to) {
                                        inMathMode = true;
                                    }
                                }
                            }
                        });

                        console.log("Cursor in math mode:", inMathMode);
                    }
                })
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