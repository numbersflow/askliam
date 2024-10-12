import React from 'react';
import AskLiam from '../components/AskLiam';

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-primary mb-6">Welcome to Easy Finetuning</h1>
        <AskLiam />
      </div>
    </div>
  );
};

export default Main;