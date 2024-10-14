import React from 'react';
import AskLiam from '../components/AskLiam';

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex items-stretch">
        <div className="w-full max-w-3xl mx-auto">
          <AskLiam />
        </div>
      </div>
    </div>
  );
};

export default Main;