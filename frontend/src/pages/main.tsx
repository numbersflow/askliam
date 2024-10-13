import React from 'react';
import AskLiam from '../components/AskLiam';

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
        <div className="max-w-3xl mx-auto">
          <AskLiam />
        </div>
      </div>
    </div>
  );
};

export default Main;