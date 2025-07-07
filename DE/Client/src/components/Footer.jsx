import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white h-8 w-8 rounded-lg flex items-center justify-center font-heading font-bold text-lg">
                Q
              </div>
              <span className="font-heading font-bold text-xl text-gray-900">Questify</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Transform how you interact with documents. AI-powered document analysis made simple.
            </p>
            <div className="flex mt-4 space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <FiTwitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-primary-600 text-sm">Document Analysis</Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-primary-600 text-sm">AI-Powered Q&A</Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-primary-600 text-sm">Semantic Search</Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-primary-600 text-sm">History Tracking</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600 text-sm">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-primary-600 text-sm">Careers</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-primary-600 text-sm">Blog</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 text-sm">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-primary-600 text-sm">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-gray-600 hover:text-primary-600 text-sm">GDPR</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {currentYear} Questify. All rights reserved.</p>
          <div className="mt-4 sm:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link to="/privacy" className="text-xs text-gray-500 hover:text-primary-600">Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-xs text-gray-500 hover:text-primary-600">Terms</Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-xs text-gray-500 hover:text-primary-600">Sitemap</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 