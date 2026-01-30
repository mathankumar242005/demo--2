import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hi, I\'m your Apple Specialist. How can I help you find the perfect product today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !process.env.API_KEY) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview'; 
      
      const systemInstruction = `You are a helpful, knowledgeable, and polite Apple Store Specialist. 
      You help customers choose products, understand features, and troubleshoot basic issues.
      Keep your answers concise, elegant, and friendly, matching Apple's brand voice.
      If asked about products, refer to the current lineup:
      - iPhone 16 and iPhone 16 Pro with Apple Intelligence and Camera Control.
      - MacBook Air with M3.
      - iPad Pro with M4.
      - Apple Watch Ultra 2 in Black Titanium.
      Do not invent fake products. Emphasize quality, Apple Intelligence, and user experience.`;

      const response = await ai.models.generateContent({
        model,
        contents: [
            ...messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: userMessage }]}
        ],
        config: {
            systemInstruction
        }
      });

      const text = response.text || "I'm sorry, I couldn't process that request right now.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the network. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!process.env.API_KEY) return null; // Hide if no API key

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] transition-all duration-300 ease-out">
          {/* Header */}
          <div className="bg-gray-100 p-4 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Apple Specialist</h3>
                <p className="text-xs text-gray-500">AI-Powered Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
               <div className="bg-white p-3 rounded-2xl border border-gray-200 rounded-bl-none shadow-sm flex space-x-1 items-center">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
               </div>
             </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about products..."
                className="flex-1 border-none focus:ring-0 text-sm bg-gray-100 rounded-full px-4 py-3 text-gray-900 placeholder-gray-500 outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-14 h-14 bg-black text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-12 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mr-2">
          Ask a Specialist
        </span>
      </button>
    </div>
  );
};

export default ChatAssistant;