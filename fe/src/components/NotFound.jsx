import React from "react";

const NotFound = () => { 
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col justify-between">
      {/* 404 Content */}
      <main className="flex flex-col items-center justify-center text-center flex-grow">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">404 Not Found</h1>
        <p className="text-gray-500 mb-8">
          oops! The page you requested was not found!
        </p>
        <button className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-400">
          Back To Home
        </button>
        <div className="mt-8">
          <img
            src="/assets/construction-illustration.png"
            alt="Under Construction"
            className="w-96 mx-auto"
          />
        </div>
      </main>
    </div>
  );
}

export default NotFound;
