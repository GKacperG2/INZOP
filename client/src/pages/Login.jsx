import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(username, password);
    navigate('/')
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg'>
      <h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-gray-700'>Username</label>
          <input
            className='w-full p-2 border rounded-lg'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Password</label>
          <input
            type='password'
            className='w-full p-2 border rounded-lg'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-600 text-white p-2 rounded-lg'
        >
          Login
        </button>
        {error && <div className='text-red-600'>{error}</div>}
        <p className='pt-2'>
          Doesn't have an accout?{" "}
          <Link to='/register' className='text-blue-600'>
            Sign Up!
          </Link>
        </p>
      </form>
    </div>
  );
}
