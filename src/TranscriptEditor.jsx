import React, { useState, useEffect } from "react";
import TranscriptWord from "./TranscriptWord";

const TranscriptEditor = ({ initialTranscript }) => {
  const [transcriptData, setTranscriptData] = useState(initialTranscript);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingWordIndex, setEditingWordIndex] = useState(null);

  useEffect(() => {
    let playbackInterval = null;
    if (isPlaying) {
      playbackInterval = setInterval(() => {
        setCurrentPlaybackTime((previousTime) => {
          const updatedTime = previousTime + 100;
          const lastWordEndTime =
            transcriptData[transcriptData.length - 1].start_time +
            transcriptData[transcriptData.length - 1].duration;

          if (updatedTime >= lastWordEndTime) {
            clearInterval(playbackInterval);
            setIsPlaying(false);
            return 0;
          }

          return updatedTime;
        });
      }, 100);
    }

    return () => clearInterval(playbackInterval);
  }, [isPlaying, transcriptData]);

  const handleWordUpdate = (index, newWord) => {
    const updatedTranscriptData = transcriptData.map((wordObj, i) =>
      i === index ? { ...wordObj, word: newWord } : wordObj
    );

    setTranscriptData(updatedTranscriptData);
    setEditingWordIndex(null);
  };

  const togglePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleStopPlayback = () => {
    setIsPlaying(false);
    setCurrentPlaybackTime(0);
  };

  const formatTime = (milliseconds) => {
    const minutes = String(Math.floor(milliseconds / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((milliseconds % 60000) / 1000)).padStart(
      2,
      "0"
    );
    return `${minutes}:${seconds}`;
  };

  return (
    <div>
      <div className="flex space-x-4 justify-center mb-5 relative">
        <button
          onClick={togglePlayPause}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleStopPlayback}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Stop
        </button>
        <div className="absolute right-4 top-1/2 translate-y-[-50%]">
          {formatTime(currentPlaybackTime)}
        </div>
      </div>
      <div className="mb-4">
        {transcriptData.map((wordObj, index) => (
          <TranscriptWord
            key={index}
            wordObj={wordObj}
            currentTime={currentPlaybackTime}
            isEditing={editingWordIndex === index}
            onWordSave={(newWord) => handleWordUpdate(index, newWord)}
            onEditStart={() => setEditingWordIndex(index)}
            onEditEnd={() => setEditingWordIndex(null)}
          />
        ))}
      </div>
    </div>
  );
};

export default TranscriptEditor;
