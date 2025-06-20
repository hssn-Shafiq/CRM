import React, { useState, useEffect } from 'react';
import { LinkedInService } from '../../Services/SocialMediaServices';
import './LinkedinPage.css';

const LinkedInSelector = ({ onSelectionChange }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState('person'); // Default to personal profile
  const [selectedPageId, setSelectedPageId] = useState(null);
  
  const accessToken = localStorage.getItem("linkedin_token");
  
  useEffect(() => {
    if (accessToken) {
      fetchPages();
    }
  }, [accessToken]);
  
  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await LinkedInService.getLinkedInPages(accessToken);
      setPages(result.pages);
      setLoading(false);
    } catch (err) {
      setError(err.error || "Could not load LinkedIn pages");
      setLoading(false);
    }
  };
  
  const handleTargetChange = (e) => {
    const newTarget = e.target.value;
    setSelectedTarget(newTarget);
    
    // Reset page selection if changing to personal profile
    if (newTarget === 'person') {
      setSelectedPageId(null);
    }
    
    // Notify parent component of the selection
    onSelectionChange({
      targetType: newTarget,
      pageId: newTarget === 'organization' ? selectedPageId : null
    });
  };
  
  const handlePageChange = (e) => {
    const pageId = e.target.value;
    setSelectedPageId(pageId);
    
    // Notify parent component of the selection
    onSelectionChange({
      targetType: 'organization',
      pageId
    });
  };
  
  return (
    <div className="linkedin-selector">
      <div className="selector-type">
        <h4>Post to:</h4>
        <div className="radio-group">
          <label>
            <input 
              type="radio" 
              name="linkedinTarget" 
              value="person" 
              checked={selectedTarget === 'person'} 
              onChange={handleTargetChange}
            />
            Personal Profile
          </label>
          
          <label>
            <input 
              type="radio" 
              name="linkedinTarget" 
              value="organization" 
              checked={selectedTarget === 'organization'} 
              onChange={handleTargetChange}
              disabled={pages.length === 0}
            />
            Company Page
          </label>
        </div>
      </div>
      
      {selectedTarget === 'organization' && (
        <div className="page-selector">
          <label htmlFor="linkedin-page">Select Page:</label>
          <select 
            id="linkedin-page"
            value={selectedPageId || ''}
            onChange={handlePageChange}
            disabled={loading || pages.length === 0}
          >
            <option value="" disabled>Select a page...</option>
            {pages.map(page => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
          
          {loading && <p className="loading">Loading pages...</p>}
          {error && <p className="error">{error}</p>}
          
          {!accessToken && (
            <p className="error">
              Please connect your LinkedIn account first
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkedInSelector;