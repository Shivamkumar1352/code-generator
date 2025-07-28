const axios = require('axios');
const Chat = require('../Models/Chat');

const generateComponent = async (req, res) => {
  const { prompt, userId, sessionId } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3-8b-instruct',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    const chat = new Chat({ user: userId, sessionId, prompt, response: aiMessage });
    await chat.save();

    res.status(200).json({ success: true, message: aiMessage });
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "OpenRouter error",
      error: error.response?.data || error.message
    });
  }
};


const getChatHistory = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const chats = await Chat.find({ sessionId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching chat history",
      error: error.message
    });
  }
};


module.exports = {
  generateComponent,
  getChatHistory
};
