# 🧠 AI Chat VS Code Extension

A Visual Studio Code extension that brings an AI-powered chat assistant directly into your IDE. Built with a React-based WebView, this assistant supports workspace-aware contextual replies, file referencing via `@filename`, and code generation powered by OpenRouter's Mistral 7B API.

---

## ✨ Features

- ⚛️ **React Chat UI** — Clean and minimal WebView-based chat interface.
- 🧠 **AI-Powered Assistant** — Uses OpenRouter (Mistral 7B) to generate and assist with code.
- 📂 **File Context Awareness** — Reference files from your current workspace with `@filename`.
- 💬 **Markdown Support** — Renders markdown and syntax-highlighted code blocks.

---

## 📸 Demo

> 🔗 _Include a link to your demo video or screenshot here._

---

## 🧩 Tech Stack

- **VS Code Extension API**
- **React + TypeScript** (WebView UI)
- **Node.js** (Extension backend)
- **OpenRouter API** (Mistral 7B Instruct model)
- **Webpack** for bundling

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- VS Code
- `vsce` or `@vscode/test` for packaging/testing

### Setup

```bash
git clone https://github.com/your-username/ai-chat-vscode
cd ai-chat-vscode
npm install
