import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUser, FiMail, FiLock, FiKey, FiArrowRight } from 'react-icons/fi';

const SignupPage = () => {
  const navigate = useNavigate();
  const { sendOTP, signup, loading } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
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

  // Handle OTP sending
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email) {
      setErrors({ ...errors, email: 'Email is required' });
      return;
    }
    
    try {
      setMessage({ type: '', text: '' });
      const result = await sendOTP(formData.email);
      
      if (result.success) {
        setOtpSent(true);
        setMessage({ type: 'success', text: 'OTP sent successfully! Check your email.' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'Failed to send OTP' });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) 
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.otp) newErrors.otp = 'OTP is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setMessage({ type: '', text: '' });
      const result = await signup(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
        
        // Redirect to login after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'Registration failed' });
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Join Questify and start analyzing your documents</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="formName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="formName"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input pl-10 ${
                    errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email and Send OTP */}
            <div className="space-y-2">
              <label htmlFor="formEmail" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="flex gap-2">
                <div className={otpSent ? 'w-full' : 'w-2/3'}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="formEmail"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={otpSent}
                      className={`form-input pl-10 ${
                        errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={!formData.email || loading}
                    className="w-1/3 px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {/* OTP Input */}
            {otpSent && (
              <div className="space-y-2">
                <label htmlFor="formOTP" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="formOTP"
                    type="text"
                    name="otp"
                    placeholder="Enter the OTP sent to your email"
                    value={formData.otp}
                    onChange={handleChange}
                    className={`form-input pl-10 ${
                      errors.otp ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
                <p className="text-sm text-gray-600 mt-1">
                  Didn't receive OTP?
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="ml-1 text-primary-600 hover:text-primary-700 font-medium hover:underline disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="formPassword" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="formPassword"
                  type="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input pl-10 ${
                    errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="formConfirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="formConfirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input pl-10 ${
                    errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !otpSent}
              className="w-full btn-primary flex justify-center items-center mt-6"
            >
              {loading ? (
                <LoadingSpinner small white />
              ) : (
                <>
                  Create Account
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
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            <Link
              to="/login"
              className="mt-4 inline-block font-medium text-primary-600 hover:text-primary-500"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
