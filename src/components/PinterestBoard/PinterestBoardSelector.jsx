import React, { useState, useEffect } from 'react';
// import PinterestService from '../../../Services/SocialMediaServices/PinterestService';
import PinterestService from '../../Services/SocialMediaServices/PinterestService';
import './PinterestBoard.css';

const PinterestBoardSelector = ({ onSelectionChange }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  
  const accessToken = localStorage.getItem("pinterest_token");
  
  useEffect(() => {
    if (accessToken) {
      fetchBoards();
    }
  }, [accessToken]);
  
  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await PinterestService.getBoards(accessToken);
      setBoards(result.boards);
      setLoading(false);
    } catch (err) {
      setError(err.error || "Could not load Pinterest boards");
      setLoading(false);
    }
  };
  
  const handleBoardChange = (e) => {
    const boardId = e.target.value;
    setSelectedBoardId(boardId);
    
    // Notify parent component of the selection
    onSelectionChange({
      boardId
    });
  };
  
  return (
    <div className="pinterest-selector">
      <div className="selector-type">
        <h4>Select Board:</h4>
        
        <div className="board-selector">
          <label htmlFor="pinterest-board">Choose a board:</label>
          <select 
            id="pinterest-board"
            value={selectedBoardId || ''}
            onChange={handleBoardChange}
            disabled={loading || boards.length === 0}
          >
            <option value="" disabled>Select a board...</option>
            {boards.map(board => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
          
          {loading && <p className="loading">Loading boards...</p>}
          {error && <p className="error">{error}</p>}
          
          {!accessToken && (
            <p className="error">
              Please connect your Pinterest account first
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinterestBoardSelector;