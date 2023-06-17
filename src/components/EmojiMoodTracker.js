import React, { useState, useEffect } from 'react';
import './EmojiMoodTracker.css';

const CLIENT_ID = "5a167d608d4e47669c046f3d0dbbfa86";
const CLIENT_SECRET = "6767ff8ce13b4c72908acb81d3bea6d0";
const SCOPES = "user-library-read"; 

function EmojiMoodTracker() {
  const [selectedMood, setSelectedMood] = useState('');
  //const [recommendedMusic, setRecommendedMusic] = useState('');
  const [accessToken, setAccessToken] = useState('')

  useEffect(() => {
    //API access token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=${SCOPES}`
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, []);

  async function button() {
    console.log("Button pressed ");

    // get request using track to get user's saved tracks
    var trackParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var savedTracks = await fetch('https://api.spotify.com/v1/me/tracks?market=US&limit=10&offset=0', trackParameters)
      .then(response => response.json())
      .then(data => console.log(data)) 
    
    // get request with item's ID to grab all the tracks' ids
    /*
    var savedTracks = await fetch('https://api.spotify.com/v1/audio-features?ids=2takcwOaAZWiXQijPHIx7B', trackParameters)
      .then(response => response.json())
      .then(data => console.log(data)) 
    */
    // get request with track's ID to grab the audio details

    // algorithm to determine what track to display based on the mood

    // Display the song based on emoji mood
  }

  const handleMoodSelect = (mood) => {
    button(mood);
    setSelectedMood(mood);
  };

  return (
    <div className="emoji-mood-tracker">
      <h1 className="title">Moodify</h1>

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
          {/*}
          <h3>Recommended Music:</h3>
          {recommendedMusic ? (
            <p>{recommendedMusic}</p>
          ) : (
            <p>Loading music recommendation...</p>
          )}
          */}
        </div>
      )}
    </div>
  );
}

export default EmojiMoodTracker;
