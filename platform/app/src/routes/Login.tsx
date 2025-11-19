import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icons } from '@ohif/ui-next';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`https://app.supravi.ai/proxy/login`, {
        username,
        password,
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        setError('Login failed: Invalid response from server');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#f8f8f8]">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 outline-none"
            />
          </div>
          <div className="relative mb-6">
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 outline-none"
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Icons.EyeVisible className="w-6 text-gray-900 transition duration-300 hover:opacity-80" />
              ) : (
                <Icons.EyeHidden className="w-6 text-gray-900 transition duration-300 hover:opacity-80" />
              )}
            </span>
            {error && <p className="absolute top-full text-base text-red-500">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
