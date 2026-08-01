import { useState, useRef, useEffect } from 'react';
import { askChatbot } from '../services/chatbotService';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const data = await askChatbot(question);
      setMessages((prev) => [...prev, { role: 'bot', text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: err.response?.data?.message || 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[75vh]">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Ask Your Finances</h1>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-y-auto space-y-3 transition-colors">
        {messages.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-8">
            Try asking: "How much did I spend on food?" or "How can I save money?"
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-4 py-2 rounded-lg text-sm">Thinking...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your spending..."
          className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;