const vscode = require('vscode')

function colonize (option, colon = false) {
  var editor = vscode.window.activeTextEditor
  if (!editor) return

  vscode.commands.executeCommand('acceptSelectedSuggestion').then(() => {
    var lineIndex = editor.selection.active.line
    var lineObject = editor.document.lineAt(lineIndex)
    var lineLength = lineObject.text.length

    if (lineObject.text.charAt(lineLength - 1) !== ';' && !lineObject.isEmptyOrWhitespace) {
      var char = colon ? ',' : ';';
      var insertionSuccess = editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(lineIndex, lineLength), char)
      })

      if (!insertionSuccess) return
    }

    if (option === 'hold') return

    option === 'endline'
      ? vscode.commands.executeCommand('cursorEnd')
      : vscode.commands.executeCommand('editor.action.insertLineAfter')
  })
}

function activate (context) {
  var endLineDisposable = vscode.commands.registerCommand('colonize.endline', () => {
    colonize('endline')
  })

  var holdDisposable = vscode.commands.registerCommand('colonize.hold', () => {
    colonize('hold')
  })

  var newLineDisposable = vscode.commands.registerCommand('colonize.newline', () => {
    colonize('newline')
  })

  var colonEndLineDisposable = vscode.commands.registerCommand('colonize.colonEndline', () => {
    colonize('endline', true)
  })
  console.log(colonEndLineDisposable);

  context.subscriptions.push(endLineDisposable)
  context.subscriptions.push(newLineDisposable)
  context.subscriptions.push(holdDisposable)
  context.subscriptions.push(colonEndLineDisposable)
}

exports.activate = activate
