import { useMemo, useState } from 'react';
import { sarcasticQuotes } from './sarcasticQuotes';

const agentCopy = {
  idle: {
    eyebrow: "Today's financial roast",
    quote: null,
  },
  wake: {
    eyebrow: 'Voice agent armed',
    quote: 'Say “hey dear” and I shall awaken. Unfortunately for your bank account.',
  },
  capture: {
    eyebrow: 'Voice agent active',
    quote: "I'm listening. Tell me the transaction before I lose hope.",
  },
  saving: {
    eyebrow: 'Recording transaction',
    quote: 'Recording transaction... and my disappointment.',
  },
};

const MemeCard = ({
  name,
  onActivate,
}) => {
  const firstQuoteIndex = useMemo(
    () => Math.floor(Math.random() * sarcasticQuotes.length),
    []
  );
  const [quoteIndex, setQuoteIndex] = useState(firstQuoteIndex);
  const [touchStart, setTouchStart] = useState(null);

  const nextQuote = () => {
    setQuoteIndex((currentIndex) => (currentIndex + 1) % sarcasticQuotes.length);
  };

  const visibleQuote = agentCopy.idle.quote || sarcasticQuotes[quoteIndex];

  const handleTouchEnd = (event) => {
    if (!touchStart) return;

    const touch = event.changedTouches[0];
    const distanceX = touch.clientX - touchStart.x;
    const distanceY = touch.clientY - touchStart.y;
    const swipedFarEnough = Math.abs(distanceX) > 55 || Math.abs(distanceY) > 55;

    if (swipedFarEnough) onActivate?.();
    setTouchStart(null);
  };

  return (
    <section
      className="meme-card"
      aria-label="GuiltTrip voice agent card"
      role="button"
      tabIndex="0"
      onClick={onActivate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') onActivate?.();
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
      }}
      onTouchEnd={handleTouchEnd}
    >
      <div>
        <span className="eyebrow">
          {agentCopy.idle.eyebrow}
        </span>
        <h3>{name ? `${name},` : 'Dear spender,'}</h3>
        <p>“{visibleQuote}”</p>
        <small className="meme-card-hint">
          Click or swipe this card to wake the voice agent.
        </small>
      </div>
      <button
        className="meme-card-button"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          nextQuote();
        }}
      >
        New roast
      </button>
    </section>
  );
};

export default MemeCard;
