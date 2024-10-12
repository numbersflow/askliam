import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

interface SystemPromptDialogProps {
  children: React.ReactNode
}

export function SystemPromptDialog({ children }: SystemPromptDialogProps) {
  const [systemPrompt, setSystemPrompt] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-[90vw] bg-white shadow-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Set System Prompt</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter system prompt here..."
            className="min-h-[200px] text-lg p-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button 
          onClick={() => console.log("System prompt set:", systemPrompt)} 
          className="w-full text-lg py-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Set Prompt
        </Button>
      </DialogContent>
    </Dialog>
  )
}