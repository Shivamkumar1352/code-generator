import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatHistory.css';

const ChatHistory = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const sessionId = localStorage.getItem('user'); // must match backend param

        const response = await axios.get(`${API_URL}/chat/history/${sessionId}`, {
          headers: { Authorization: token }
        });

        setChats(response.data.chats || []);
      } catch (err) {
        console.error('Error fetching history', err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <h3>Chat History</h3>
      {chats.length === 0 ? (
        <p>No history found.</p>
      ) : (
        chats.map((chat, index) => (
          <div className="chat-item" key={index}>
            <strong>Prompt:</strong>
            <p>{chat.prompt}</p>
            <strong>Response:</strong>
            <pre>{chat.response}</pre>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default ChatHistory;
