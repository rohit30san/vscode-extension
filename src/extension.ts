import * as vscode from 'vscode';
import { getWebviewContent } from './webviewContent';
import * as dotenv from 'dotenv';
dotenv.config();
console.log('Loaded API key length:', (process.env.OPENROUTER_API_KEY || '').length);

export function activate(context: vscode.ExtensionContext) {
  console.log('AI Chat extension activated');

  const disposable = vscode.commands.registerCommand('aiChat.startChat', () => {
    const panel = vscode.window.createWebviewPanel(
      'aiChat',
      'AI Chat Assistant',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'webview-ui', 'dist', 'assets')
        ]
      }
    );

    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

    panel.webview.onDidReceiveMessage(async message => {
      if (message.type === 'sendMessage') {
        const resolvedPrompt = await resolveAtMentions(message.content);
        const response = await fetchAIResponse(resolvedPrompt);
        panel.webview.postMessage({ type: 'response', content: response });
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

async function resolveAtMentions(input: string): Promise<string> {
  const matches = input.match(/@([\w.\-]+)/g);
  if (!matches) return input;

  let result = input;
  for (const match of matches) {
    const filename = match.slice(1); // Remove '@'
    const files = await vscode.workspace.findFiles(`**/${filename}`, '**/node_modules/**', 1);
    if (files.length > 0) {
      const fileUri = files[0];
      const contentBytes = await vscode.workspace.fs.readFile(fileUri);
      const content = Buffer.from(contentBytes).toString('utf8');
      result = result.replace(match, `\n\n[Content of ${filename}]:\n\`\`\`\n${content}\n\`\`\``);
    } else {
      result = result.replace(match, `(⚠️ Could not find file "${filename}")`);
    }
  }

  return result;
}

async function fetchAIResponse(prompt: string) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || '';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'system', content: 'You are a helpful coding assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const raw = await response.text();
    let data: any;

    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error('❌ JSON parse error:', raw);
      return '❌ Failed to parse AI response.';
    }

    console.log('✅ AI response:', data);

    const choice = data?.choices?.[0];
    const content = choice?.message?.content || choice?.text;

    return content || '⚠️ AI did not return usable content.';
  } catch (error: any) {
    return `❌ Fetch failed: ${error.message || error.toString()}`;
  }
}
