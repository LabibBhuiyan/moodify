import React, { useState, useEffect } from 'react';
import './EmojiMoodTracker.css';

function EmojiMoodTracker() {
  const [selectedMood, setSelectedMood] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [recommendedMusic, setRecommendedMusic] = useState('');

  useEffect(() => {
    const storedMoodHistory = localStorage.getItem('moodHistory');
    if (storedMoodHistory) {
      setMoodHistory(JSON.parse(storedMoodHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const handleMoodSelect = (mood) => {
    const updatedMoodHistory = [...moodHistory, mood];
    setMoodHistory(updatedMoodHistory);
    setSelectedMood(mood);
    fetchMusicRecommendation(mood);
  };

  const handleDeleteMood = (index) => {
    const updatedMoodHistory = [...moodHistory];
    updatedMoodHistory.splice(index, 1);
    setMoodHistory(updatedMoodHistory);
  };

  const handleClearMoodHistory = () => {
    setMoodHistory([]);
  };

  const fetchMusicRecommendation = (mood) => {
    // Make an API call to fetch music recommendation based on mood
    // Replace the URL with the actual endpoint of your Music Mood Analyzer API
    fetch(`https://your-music-mood-analyzer-api.com/recommendations?mood=${mood}`)
      .then((response) => response.json())
      .then((data) => {
        setRecommendedMusic(data.music);
      })
      .catch((error) => {
        console.error('Error fetching music recommendation:', error);
      });
  };

  return (
    <div className="emoji-mood-tracker">
      <h1 className="title">Emoji Mood Tracker</h1>

      <div className="mood-select-container">
        <h2>Select your mood:</h2>
        <div className="emoji-buttons">
          <button onClick={() => handleMoodSelect('😄')} data-emotion="Happy">
            😄
          </button>
          <button onClick={() => handleMoodSelect('😊')} data-emotion="Joyful">
            😊
          </button>
          <button onClick={() => handleMoodSelect('😐')} data-emotion="Neutral">
            😐
          </button>
          <button onClick={() => handleMoodSelect('😞')} data-emotion="Sad">
            😞
          </button>
          <button onClick={() => handleMoodSelect('😢')} data-emotion="Crying">
            😢
          </button>
        </div>
      </div>

      {selectedMood && (
        <div className="mood-details-container">
          <h2>Your selected mood: {selectedMood}</h2>
          <h3>Mood History:</h3>
          {moodHistory.length > 0 ? (
            <div>
              <ul className="mood-history-list">
                {moodHistory.map((mood, index) => (
                  <li key={index}>
                    {mood}{' '}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteMood(index)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={handleClearMoodHistory}>
                Clear Mood History
              </button>
            </div>
          ) : (
            <p>No mood history available.</p>
          )}
          <h3>Recommended Music:</h3>
          {recommendedMusic ? (
            <p>{recommendedMusic}</p>
          ) : (
            <p>Loading music recommendation...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default EmojiMoodTracker;
