import path from "path";

const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("active");
  let activeEditor = vscode.window.activeTextEditor;

  let disposable = vscode.commands.registerCommand(
    "inline-code-notes.createNote",
    () => {
      vscode.window
        .showInputBox({
          placeHolder: "Your note",
        })
        .then((value) => {
          if (value) vscode.window.showInformationMessage(value);
        });
    }
  );

  context.subscriptions.push(disposable);

  if (activeEditor) triggerDecorationUpdate(activeEditor);

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) triggerDecorationUpdate(editor);
    },
    null,
    context.subscriptions
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

/**
 * @param {vscode.TextEditor} editor
 */
function triggerDecorationUpdate(editor) {
  const gutterIconPath = path.join(__dirname, "notepad.png");
  console.log(gutterIconPath);

  const decorationType = vscode.window.createTextEditorDecorationType({
    gutterIconPath: gutterIconPath,
    gutterIconSize: "contain",
  });

  const decorationsArray = [];

  const lineNumber = editor.selection.active.line;
  const range = new vscode.Range(lineNumber, 0, lineNumber, 0);
  decorationsArray.push({
    range: range,
    hoverMessage: "Create a new note",
    renderOptions: {
      before: {
        contentText: "",
        textDecoration: "none",
      },
    },
  });

  editor.setDecorations(decorationType, decorationsArray);

  editor.setDecorations(decorationType, decorationsArray);

  vscode.window.onDidChangeTextEditorSelection((event) => {
    if (event.selections[0].active.line == lineNumber)
      vscode.commands.executeCommand("inline-code-notes.createNote");
  });
}

module.exports = {
  activate,
  deactivate,
};
