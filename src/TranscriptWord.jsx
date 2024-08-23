import React, { useState } from "react";

const TranscriptWord = ({
  wordObj,
  currentTime,
  isEditing,
  onWordSave,
  onEditStart,
  onEditEnd,
}) => {
  const { word, start_time: startTime, duration } = wordObj;

  const [editedWord, setEditedWord] = useState(word);

  const isHighlighted =
    currentTime >= startTime && currentTime < startTime + duration;

  const handleSaveEdit = () => {
    if (!editedWord.length) {
      alert("Please enter a valid word");
      return;
    }
    onWordSave(editedWord);
  };

  const handleWordChange = (e) => {
    setEditedWord(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
      onEditEnd();
    }
    if (e.key == " ") {
      alert("Must be a word not a sentence");
    }
  };

  return (
    <span
      className={`inline-block p-1 cursor-pointer ${
        isHighlighted ? "border-2 rounded-lg border-yellow-300" : ""
      }`}
      onClick={onEditStart}
    >
      {isEditing ? (
        <input
          type="text"
          value={editedWord}
          onChange={handleWordChange}
          onBlur={() => {
            handleSaveEdit();
            onEditEnd();
          }}
          onKeyDown={handleKeyDown}
          className="border-b-2 border-gray-100 focus:outline-none bg-[#232323]"
          autoFocus
        />
      ) : (
        word
      )}
    </span>
  );
};

export default TranscriptWord;
