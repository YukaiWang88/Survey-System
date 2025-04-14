import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VotingCard from '../components/audience/VotingCard';
import ResultsChart from '../components/common/ResultsChart';

export default function AudienceView() {
  const { roomId } = useParams();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Simulated WebSocket connection
  useEffect(() => {
    // TODO: Connect to WebSocket
    const mockPoll = {
      question: "What's your favorite frontend framework?",
      options: [
        { id: 1, text: "React", votes: 42 },
        { id: 2, text: "Vue", votes: 25 },
        { id: 3, text: "Angular", votes: 18 }
      ]
    };
    setPoll(mockPoll);
  }, []);

  if (!poll) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold text-indigo-600 mb-2">
            Room: {roomId}
          </h3>
          {hasVoted ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Thanks for voting!
              </h2>
              <ResultsChart poll={poll} />
            </div>
          ) : (
            <VotingCard poll={poll} onVote={() => setHasVoted(true)} />
          )}
        </div>
      </div>
    </div>
  );
}