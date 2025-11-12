import React, { useState, useEffect } from 'react';

const VoiceToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = 'en-US';

      newRecognition.onresult = event => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        setText(prevText => (text.trim() ? `${prevText} ${transcript}` : transcript));
      };

      newRecognition.onerror = event => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(newRecognition);
    } else {
      setIsSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  const clearText = () => setText('');

  if (!isSupported) {
    return (
      <div className="text-red-500">
        Your browser does not support speech recognition. Please try using Google Chrome.
      </div>
    );
  }

  const buttonStyle = `rounded px-4 py-2 text-white transition-colors ${
    isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
  }`;

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          className={buttonStyle}
          onClick={toggleListening}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <button
          className="rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          onClick={clearText}
        >
          Clear Text
        </button>
      </div>
      <textarea
        className="min-h-[200px] w-full rounded border p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Your speech will appear here..."
      />
    </>
  );
};

export default VoiceToText;
