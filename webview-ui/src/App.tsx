import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

type Message = {
  sender: 'user' | 'ai';
  content: string;
};

// Custom renderer using correct signature
const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.setOptions({ renderer });

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.type === 'response') {
        setMessages(prev => [...prev, { sender: 'ai', content: msg.content }]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    window.vscode?.postMessage({ type: 'sendMessage', content: input });
    setInput('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        color: '#000',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#d0eaff' : '#e4e4e4',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              maxWidth: '80%',
              whiteSpace: 'pre-wrap',
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
              style={{ margin: 0 }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          padding: '0.75rem',
          borderTop: '1px solid #ccc',
          backgroundColor: '#f4f4f4',
        }}
      >
        <input
          type="text"
          placeholder="Type your message or ask for code..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            background: '#ffffff',
            border: '1px solid #ccc',
            color: '#000000',
            padding: '0.5rem 1rem',
            fontSize: '14px',
            borderRadius: '6px',
            marginRight: '0.5rem',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: '#007acc',
            border: 'none',
            color: 'white',
            padding: '0 16px',
            fontWeight: 'bold',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
