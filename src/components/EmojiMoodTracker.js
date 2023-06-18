import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './EmojiMoodTracker.css';

const CLIENT_ID = "5a167d608d4e47669c046f3d0dbbfa86";
const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = "user-library-read";

function EmojiMoodTracker() {
  const [selectedMood, setSelectedMood] = useState('');
  const [recommendedMusic, setRecommendedMusic] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there is an access token in the URL hash fragment
    const urlParams = new URLSearchParams(window.location.hash.substr(1));
    const token = urlParams.get('access_token');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  async function fetchRecommendedMusic() {
    // Fetch recommended music based on mood or perform other actions with the access token
    if (accessToken) {
      // Perform API requests using the access token
      const response = await fetch('https://api.spotify.com/v1/me/tracks', {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      const data = await response.json();

      let trackIDs = [];
      for (let i = 0; i < 20; i++) {
        trackIDs.push(data.items[i].track.id);
      }

      const result = await fetch('https://api.spotify.com/v1/audio-features?ids=' + trackIDs.join(','), {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      const audioInfo = await result.json();

      const songs = await fetch('https://api.spotify.com/v1/tracks?ids=' + trackIDs.join(','), {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      const songInfo = await songs.json();

      let songDetails = songInfo.tracks.map((track) => {
        const artists = track.artists.map((artist) => artist.name).join(', ');
        return {
          track: track.name,
          artist: artists
        };
      });

      const audioDetails = audioInfo.audio_features;

      const recommendedSongs = getRecommendedSongs(songDetails, audioDetails);

      // Process the recommended songs and update the recommendedMusic state
      setRecommendedMusic(recommendedSongs);
    }
  }

  const handleMoodSelect = (mood) => {
    if (selectedMood === mood) {
      // If the same emoji is selected again, clear the selected mood and reset the recommended music
      setSelectedMood('');
      setRecommendedMusic([]);
    } else {
      setSelectedMood(mood);
      fetchRecommendedMusic();
    }
  };

  useEffect(() => {
    // Redirect user to Spotify authorization page if not authenticated
    if (!isAuthenticated && !window.location.hash) {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    }
  }, [isAuthenticated]);

  function getRecommendedSongs(songDetails, audioDetails) {
    const recommendedSongs = [];

    // Assign scores to each track based on valence, danceability, and energy
    audioDetails.forEach((track, index) => {
      let score = 0;

      // Adjust the weights and thresholds according to your preferences
      const valenceWeight = 0.5;
      const danceabilityWeight = 0.3;
      const energyWeight = 0.2;

      if (track.valence > 0.7) {
        score += valenceWeight * 2;
      } else if (track.valence > 0.5) {
        score += valenceWeight * 1.5;
      } else if (track.valence > 0.3) {
        score += valenceWeight;
      }

      if (track.danceability > 0.7) {
        score += danceabilityWeight * 2;
      } else if (track.danceability > 0.5) {
        score += danceabilityWeight * 1.5;
      } else if (track.danceability > 0.3) {
        score += danceabilityWeight;
      }

      if (track.energy > 0.7) {
        score += energyWeight * 2;
      } else if (track.energy > 0.5) {
        score += energyWeight * 1.5;
      } else if (track.energy > 0.3) {
        score += energyWeight;
      }

      // Add the track and its score to the recommended songs
      recommendedSongs.push({
        track: songDetails[index].track,
        artist: songDetails[index].artist,
        score: score
      });
    });

    // Sort the recommended songs by score in descending order
    recommendedSongs.sort((a, b) => b.score - a.score);

    return recommendedSongs;
  }

  return (
    <Container className="emoji-mood-tracker">
      <h1 className="title">Moodify</h1>

      <Row className="mood-select-container">
        <Col>
          <h2>Select your mood:</h2>
          <div className="emoji-buttons">
            <Button variant="light" onClick={() => handleMoodSelect('😄')} data-emotion="Happy">
              😄
            </Button>
            <Button variant="light" onClick={() => handleMoodSelect('😊')} data-emotion="Joyful">
              😊
            </Button>
            <Button variant="light" onClick={() => handleMoodSelect('😐')} data-emotion="Neutral">
              😐
            </Button>
            <Button variant="light" onClick={() => handleMoodSelect('😞')} data-emotion="Sad">
              😞
            </Button>
            <Button variant="light" onClick={() => handleMoodSelect('😢')} data-emotion="Crying">
              😢
            </Button>
          </div>
        </Col>
      </Row>

      {selectedMood && (
        <Row className="mood-details-container">
          <Col>
            <h2>Your selected mood: {selectedMood}</h2>
            <h3>Recommended Music:</h3>
            {recommendedMusic.length ? (
              <ListGroup>
                {recommendedMusic.map((song) => (
                  <ListGroup.Item key={song.track}>
                    {song.track} - {song.artist}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>Loading music recommendation...</p>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default EmojiMoodTracker;
