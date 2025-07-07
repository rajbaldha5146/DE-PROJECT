import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFileText, FiMessageSquare, FiClock } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <FiHome /> },
    { name: 'Documents', path: '/my-documents', icon: <FiFileText /> },
    { name: 'History', path: '/qnahistory', icon: <FiClock /> },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white h-9 w-9 rounded-lg flex items-center justify-center font-heading font-bold text-lg">
              Q
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">Questify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentUser && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            
            {currentUser ? (
              <div className="relative ml-3 flex items-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 ml-4 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden flex items-center"
          >
            {isOpen ? (
              <FiX className="h-6 w-6 text-gray-600" />
            ) : (
              <FiMenu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'
        } overflow-hidden bg-white border-b border-gray-200`}
      >
        <div className="px-4 py-2 space-y-1">
          {currentUser && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={`w-full py-2 px-3 rounded-md text-base font-medium flex items-center space-x-3 ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          
          {currentUser ? (
            <button
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">Guest User</div>
                  <div className="text-sm font-medium text-gray-500">Please sign in</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full py-2 px-3 rounded-md text-base font-medium flex items-center hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="w-full py-2 px-3 rounded-md text-base font-medium flex items-center hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar; 