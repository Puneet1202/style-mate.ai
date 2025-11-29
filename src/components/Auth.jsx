import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-hot-toast';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // 👈 Naya State: Naam ke liye
  const [isSignUp, setIsSignUp] = useState(false); 

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    let error;
    
    if (isSignUp) {
      // 👇 SIGN UP LOGIC (Name ke saath)
      const { error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name, // 👈 Yahan humne naam "Hidden Pocket" (Metadata) mein daal diya
          }
        }
      });
      error = signUpError;
    } else {
      // LOGIN LOGIC (Waisa hi rahega)
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isSignUp ? "Account created! Welcome 🎉" : "Welcome back! 👋");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
        
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">StyleMate</h1>
        <p className="text-center text-gray-500 mb-8">Your Personal AI Stylist</p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          {/* 👇 NAME INPUT (Sirf Signup ke waqt dikhega) */}
          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 bg-gray-50"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase ml-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 bg-gray-50"
              required
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 bg-gray-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition-all mt-4 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"} 
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-purple-600 font-bold ml-1 hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Auth;