import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Link } from "react-router";
import { useSignup } from "../hooks/useSignup";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {signup, error, isLoading} = useSignup()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(username, email, password)
    navigate('/')
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg'>
      <h2 className='text-2xl font-bold mb-4 text-center'>Sign Up</h2>
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
          <label className='block text-gray-700'>Email</label>
          <input
            type='email'
            className='w-full p-2 border rounded-lg'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Sign Up
        </button>
        {error && <div className='text-red-600'>{error}</div>}
        <p className='pt-2'>
          Already have an accout?{" "}
          <Link to='/login' className='text-blue-600'>
            Sign In!
          </Link>
        </p>
      </form>
    </div>
  );
}
