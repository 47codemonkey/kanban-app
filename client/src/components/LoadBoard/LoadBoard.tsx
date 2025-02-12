import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCards } from '../../store/kanban/kanbanAsyncActions';
import type { AppDispatch } from '../../store';

import './LoadBoard.css';

export const LoadBoard = () => {
  const [inputBoardId, setInputBoardId] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleLoadBoard = () => {
    if (!inputBoardId.trim()) return;
    localStorage.setItem('boardId', inputBoardId);
    dispatch(fetchCards(inputBoardId));
  };

  return (
    <div className="load-board-container">
      <input
        type="text"
        className="load-board-input"
        placeholder="Enter board ID..."
        value={inputBoardId}
        onChange={(e) => setInputBoardId(e.target.value)}
      />
      <button className="load-board-button" onClick={handleLoadBoard}>
        Load
      </button>
    </div>
  );
};
