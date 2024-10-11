import React from 'react'

interface CustomLoadingBarProps {
  progress: number;
}

export function CustomLoadingBar({ progress }: CustomLoadingBarProps) {
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      >
        <div className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <div className="h-full w-[200%] animate-[shimmer_2s_infinite]" 
                 style={{
                   backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                   backgroundSize: '50% 100%',
                 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}