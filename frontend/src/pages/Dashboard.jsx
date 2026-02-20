import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkBalance = async () => {
    setLoading(true);
    setError('');
    setBalance(null);
    try {
      const { data } = await api.get('/balance');
      setBalance(data.balance);
      // Celebration animation when balance loads
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError(err.response?.data?.error || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear cookie by calling backend logout or just redirect; cookie will be ignored when expired
    navigate('/login');
  };

  return (
    <div className="page">
      <div className="card dashboard">
        <h1>Kodbank</h1>
        <h2>Dashboard</h2>
        <button type="button" className="primary" onClick={checkBalance} disabled={loading}>
          {loading ? 'Loading...' : 'Check Balance'}
        </button>
        {error && <p className="error">{error}</p>}
        {balance !== null && !error && (
          <p className="balance">Your balance is: {balance.toLocaleString()}</p>
        )}
        <button type="button" className="secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
