'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 步骤：1 = 输入账号，2 = 验证通过，3 = 修改密码
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fakeVerify = (e) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please enter your student ID or email.');
      return;
    }
    setError('');
    setMessage(`Verification code sent to your registered email (${identifier}).`);
    setTimeout(() => {
      setStep(2);
      setMessage('');
    }, 1000); // 模拟邮箱验证
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Password reset failed');
      } else {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={step === 1 ? fakeVerify : handleReset}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Reset Password</h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Email or Student ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mb-4 w-full p-2 border rounded text-black"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
            >
              Send Verification
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4 w-full p-2 border rounded text-black"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4 w-full p-2 border rounded text-black"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
            >
              Confirm Reset
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {message && <p className="text-green-600 text-sm mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}
