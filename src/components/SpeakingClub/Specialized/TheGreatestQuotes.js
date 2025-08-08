import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { pronounceText } from '../../../utils/speechUtils';

const TheGreatestQuotes = ({ content, dailyQuote, language }) => {
  const [quote, setQuote] = useState(null);

  const discussionPrompts = [
    "What does this quote mean to you?",
    "Do you agree with this quote? Why or why not?",
    "Can you share a personal experience that relates to this quote?",
    "How can you apply this quote to your life?",
    "What is the key message of this quote?",
  ];

  useEffect(() => {
    if (dailyQuote) {
      setQuote({
        text: dailyQuote.content,
        author: dailyQuote.author,
        context: 'From Quotable API'
      });
    } else if (content && content.quote) {
      setQuote(content.quote);
    }
  }, [dailyQuote, content]);

  const fetchNewQuote = async () => {
    try {
      const response = await axios.get('/api/quotes/daily');
      const newQuote = response.data;
      setQuote({
        text: newQuote.content,
        author: newQuote.author,
        context: 'From Quotable API'
      });
    } catch (error) {
      console.error("Failed to fetch new quote:", error);
    }
  };

  if (!quote) return null;

  return (
    <div className="specialized-club-section">
      <h4>The Greatest Quotes</h4>
      <div className="animated-quote">
        <blockquote>
          "{quote.text}"
          <button
            onClick={() => pronounceText(quote.text, language)}
            className="btn-icon pronounce-btn-inline"
          >🔊</button>
        </blockquote>
        <cite>- {quote.author}</cite>
        {quote.context && <p><strong>Context:</strong> {quote.context}</p>}
      </div>
      <button onClick={fetchNewQuote}>New Quote</button>
      <div className="discussion-prompts">
        <h5>Discussion Prompts</h5>
        <ul>
          {discussionPrompts.map((prompt, index) => (
            <li key={index}>{prompt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TheGreatestQuotes;
