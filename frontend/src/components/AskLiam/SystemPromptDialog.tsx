import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

interface SystemPromptDialogProps {
  children: React.ReactNode
  onSetSystemPrompt: (prompt: string) => void
}

export function SystemPromptDialog({ children, onSetSystemPrompt }: SystemPromptDialogProps) {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSetPrompt = () => {
    onSetSystemPrompt(systemPrompt)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] w-[95vw] sm:w-[90vw] bg-white shadow-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">Set System Prompt</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:py-4">
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter system prompt here..."
            className="min-h-[150px] sm:min-h-[200px] text-base sm:text-lg p-2 sm:p-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button 
          onClick={handleSetPrompt} 
          className="w-full text-base sm:text-lg py-4 sm:py-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Set Prompt
        </Button>
      </DialogContent>
    </Dialog>
  )
}