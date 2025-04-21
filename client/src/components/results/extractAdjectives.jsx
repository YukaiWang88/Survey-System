import React, { useState } from 'react';
import axios from 'axios';

const ExtractAdjectives = () => {
  const [description, setDescription] = useState('');
  const [adjectives, setAdjectives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!description.trim()) {
      setError('Please enter a course description.');
      return;
    }

    setError('');
    setLoading(true);
    setAdjectives([]);

    try {
      const response = await axios.post('/api/extract', { description });
      setAdjectives(response.data.adjectives);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract adjectives.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Extract Key Adjectives</h1>
      <textarea
        placeholder="Enter a course description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="5"
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button
        onClick={handleExtract}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Extracting...' : 'Extract Adjectives'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {adjectives.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Key Adjectives:</h3>
          <ul>
            {adjectives.map((adj, index) => (
              <li key={index}>{adj}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExtractAdjectives;