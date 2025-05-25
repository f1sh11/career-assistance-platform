'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIdentifier('');
    setPassword('');
  }, [role]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!role || !identifier || !password) {
      setError('All fields are required');
      return;
    }

    const payload = {
      identifier,
      password,
      role: role.toLowerCase()
    };

    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setIsLoading(false);

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Register</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-4 w-full p-2 border rounded text-black"
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="alumni">Alumni</option>
          <option value="industry">Industry professional</option>
        </select>

        <input
          type="text"
          placeholder={role === 'student' ? 'Student ID' : 'Email'}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="mb-4 w-full p-2 border rounded text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full p-2 border rounded text-black"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
