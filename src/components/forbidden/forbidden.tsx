import React from "react";
import { Link } from "react-router-dom";

const Forbidden: React.FC = () => {
  return (
    <div className="min-h-screen bg-yellow-300 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-700">403</h1>
        <h2 className="mt-4 text-4xl font-semibold text-gray-600">Access Denied</h2>
        <p className="mt-2 text-lg text-gray-700">You do not have permission to view this page.</p>

        <div className="mt-8">
          <Link
            to="/"
            className="px-6 py-3 bg-yellow-500 text-white font-bold text-lg rounded-full hover:bg-yellow-700 transition duration-300"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
