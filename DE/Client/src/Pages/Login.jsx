import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific error when user corrects the field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setMessage({ type: '', text: '' });
      const result = await login(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        
        // Redirect to home page after successful login
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'Login failed' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-indigo-50 animate-fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white h-12 w-12 rounded-xl flex items-center justify-center font-heading font-bold text-xl">
                Q
              </div>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {message.text && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg animate-fade-in ${
                message.type === 'danger'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="loginEmail"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input pl-10 ${
                    errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="loginPassword"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input pl-10 ${
                    errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary flex justify-center items-center"
              disabled={loading}
            >
              {loading ? <LoadingSpinner small /> : (
                <>
                  Sign in 
                  <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
            <Link
              to="/signup"
              className="mt-4 inline-block font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
