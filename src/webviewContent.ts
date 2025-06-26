import * as vscode from 'vscode';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'webview-ui', 'dist', 'assets', 'index-CpDXtKRM.js') 
  );

  const nonce = getNonce();

  return /* html */ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>AI Chat Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}">
          const vscode = acquireVsCodeApi();
          window.vscode = vscode;
        </script>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>
  `;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
