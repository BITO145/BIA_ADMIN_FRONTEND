import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="text-2xl mb-4">Oops! The page you're looking for doesn't exist.</p>
        <p className="mb-8 text-lg">Maybe you mistyped the URL or the page has been moved.</p>
        <div className="flex justify-center space-x-4">
          <a
            href="/"
            className="px-6 py-3 text-lg font-semibold bg-indigo-800 hover:bg-indigo-700 rounded-lg shadow-md transform transition duration-300 ease-in-out hover:scale-105"
          >
            Go Home
          </a>
          <a
            href="/contact"
            className="px-6 py-3 text-lg font-semibold bg-purple-800 hover:bg-purple-700 rounded-lg shadow-md transform transition duration-300 ease-in-out hover:scale-105"
          >
            Contact Support
          </a>
        </div>
        <div className="mt-10 text-xl opacity-70">
          <p>OR</p>
          <p className="font-semibold">Check out our <a href="/faq" className="underline text-pink-300">FAQs</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
