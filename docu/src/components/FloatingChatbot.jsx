import React, { useState, useRef, useEffect } from 'react';
import apiService from '../services/api';

/**
 * Floating RAG Chatbot Component
 * A minimal chatbot positioned in the bottom-right corner of the screen
 */
const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { type: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const tempInputValue = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend API to get response
      const response = await apiService.sendQuery(tempInputValue);

      // Add bot response to chat
      const botMessage = {
        type: 'bot',
        content: response.answer_text || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        type: 'error',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="floating-chat-button"
          aria-label="Open chatbot"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#4617dfff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            zIndex: '1000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent text selection
        >
          💬
        </button>
      )}

      {/* Chat container */}
      {isOpen && (
        <div
          className="floating-chat-container"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          {/* Header */}
          <div
            className="chat-header"
            style={{
              backgroundColor: '#381b95ff',
              color: 'white',
              padding: '15px',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px' }}>RAG Assistant</h3>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                width: '24px',
                height: '24px',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages area */}
          <div
            className="chat-messages"
            style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: '#f9f9f9'
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: '#666',
                  fontStyle: 'italic'
                }}
              >
                Ask me anything about the content!
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message message-${msg.type}`}
                  style={{
                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: '18px',
                    wordWrap: 'break-word',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        msg.type === 'user' ? '#007cba' :
                        msg.type === 'error' ? '#f44336' :
                        '#e9ecef',
                      color:
                        msg.type === 'user' ? 'white' :
                        msg.type === 'error' ? 'white' :
                        '#333',
                      borderRadius: '18px',
                      padding: '8px 12px'
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div
                className="message message-bot"
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  wordWrap: 'break-word',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#e9ecef',
                    color: '#333',
                    borderRadius: '18px',
                    padding: '8px 12px'
                  }}
                >
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            className="chat-input-area"
            style={{
              padding: '10px',
              backgroundColor: 'white',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              display: 'flex',
              gap: '8px'
            }}
          >
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                resize: 'none',
                minHeight: '40px',
                maxHeight: '100px',
                fontSize: '14px',
                outline: 'none'
              }}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={{
                backgroundColor: inputValue.trim() && !isLoading ? '#381b95ff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 16px',
                cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;