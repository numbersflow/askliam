import React from 'react'
import ChatInterface from './ChatInterface'

const AskLiam: React.FC = () => {
  return (
    <div className="w-full h-full">
      <ChatInterface disabled={false} />
    </div>
  )
}

export default AskLiam