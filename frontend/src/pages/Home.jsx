import React, { useEffect, useState, useRef } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import ChatHistory from '../components/ChatHistory';
import './Home.css';

function Home() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loggedInUser, setLoggedInUser] = useState('');
  const [home, setHome] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [jsx, setJsx] = useState('');
  const [css, setCss] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState({ jsx: false, css: false });
  const historyRef = useRef(null);

  const toggleHistory = () => {
    setShowHistory((prev) => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => {
          historyRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Delay ensures component has rendered
      }
      return newState;
    });
  };

  const handleCopy = (text, type) => {
  navigator.clipboard.writeText(text);
  setCopied((prev) => ({ ...prev, [type]: true }));
  setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1000);
};

  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    handleSuccess('Logged Out');
    setTimeout(() => navigate('/login'), 1000);
  };

  const fetchHome = async () => {
    try {
      const url = `${API_URL}/`;
      const token = localStorage.getItem('token');

      const response = await axios.get(url, {
        headers: { Authorization: token }
      });

      const result = response.data;
      setHome(result);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return handleError('Prompt cannot be empty');

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user'); // must match backend
      const sessionId = userId; // can use userId for sessionId

      const res = await axios.post(
        `${API_URL}/chat/generate`,
        { prompt, userId, sessionId },
        { headers: { Authorization: token } }
      );

      const aiMsg = res.data.message;
      setResponse(aiMsg);

      const jsxMatch = aiMsg.match(/<(.|\n)*?>/g);
      const cssMatch = aiMsg.match(/```css([^`]*)```/);
      setJsx(jsxMatch?.join('\n') || '');
      setCss(cssMatch?.[1] || '');

      handleSuccess("Component generated");
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    handleSuccess("Copied!");
  };

  const downloadCode = () => {
    const blob = new Blob([`<style>${css}</style>\n${jsx}`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="home-container">
      <div className="navbar">
        <h2>Welcome, {loggedInUser}</h2>
        <div className="nav-buttons">
          <button onClick={toggleHistory}>
            {showHistory ? 'Hide History' : 'View History'}
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <p className="welcome-msg">{home?.message}</p>

      <textarea
        className="prompt-box"
        placeholder="Enter your component prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Component'}
      </button>

      {response && (
        <>
    <h3>AI Response</h3>
   <div className="output-grid">
  <div style={{ flex: 1 }}>
    {/* JSX Block */}
    <div className="code-box">
      <div className="code-header">
        <strong>HTML</strong>
        <span
          className="copy-icon"
          onClick={() => handleCopy(jsx, 'jsx')}
          title="Copy JSX"
        >
          {copied.jsx ? <FiCheck color="#0f0" /> : <FiCopy color="#ccc" />}
        </span>
      </div>
      <pre>{jsx}</pre>
    </div>

        <div className="code-box" style={{ marginTop: '1rem' }}>
      <div className="code-header">
        <strong>CSS</strong>
        <span
          className="copy-icon"
          onClick={() => handleCopy(css, 'css')}
          title="Copy CSS"
        >
          {copied.css ? <FiCheck color="#0f0" /> : <FiCopy color="#ccc" />}
        </span>
      </div>
      <pre>{css}</pre>
    </div>
  </div>

  <div className="preview-frame-wrapper" style={{ flex: 1 }}>
    <iframe
      title="component-preview"
      srcDoc={`<style>${css}</style>${jsx}`}
      className="preview-frame"
    />
  </div>
</div>

    <div className="button-row">
      <button onClick={downloadCode}>Download HTML</button>
    </div>
  </>
      )}

      {showHistory && (
        <div ref={historyRef}>
          <ChatHistory />
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
