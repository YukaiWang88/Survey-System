// client/src/components/presenter/CreatePoll.jsx
import { motion } from 'framer-motion';
import { useSocket } from '../../contexts/SocketContext';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { socket } = useSocket();

  const createPoll = async () => {
    const { data: roomCode } = await api.post('/polls', {
      question,
      options: options.filter(opt => opt.trim())
    });
    
    socket.emit('create-room', roomCode);
    navigate(`/present/${roomCode}`);
  };

  return (
    <motion.div 
      style={glassStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <input
        className="modern-input"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question..."
      />
      
      {options.map((opt, i) => (
        <div key={i} className="option-row">
          <input
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[i] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Option ${i + 1}`}
          />
          {i > 1 && (
            <button 
              onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
              className="icon-button"
            >
              <FiX />
            </button>
          )}
        </div>
      ))}

      <button 
        onClick={() => setOptions([...options, ''])}
        className="add-option"
      >
        <FiPlus /> Add Option
      </button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="primary-button"
        onClick={createPoll}
      >
        Launch Poll
      </motion.button>
    </motion.div>
  );
}