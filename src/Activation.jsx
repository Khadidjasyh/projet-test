import { useState } from 'react';
import { useParams } from 'react-router-dom';

function Activation() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const response = await fetch(`/api/auth/activate/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (response.ok) {
      setSuccess('Password set');
      setPassword('');
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to activate account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Activate Your Account</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <button type="submit" className="w-full p-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors duration-200">
            Activate Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Activation; 