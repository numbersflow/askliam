import React from 'react'
import AskLiam from '../components/AskLiam'

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">AskLiam</h1>
        </div>
      </header>
      <main className="flex-grow">
        <AskLiam />
      </main>
    </div>
  )
}

export default Main