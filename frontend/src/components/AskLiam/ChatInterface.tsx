import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Sliders, Loader, Bot } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type MessageContent = string | { type: 'graph', data: any[] }

interface ChatMessage {
  role: 'user' | 'assistant'
  content: MessageContent
}

interface ChatInterfaceProps {
  disabled: boolean;
}

export function ChatInterface({ disabled }: ChatInterfaceProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'user', content: 'Hello, how are you?' },
    { role: 'assistant', content: "I'm an AI, I don't have feelings." }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatingMessage, setGeneratingMessage] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (generatingMessage) {
      const timer = setTimeout(() => {
        setGeneratingMessage(prev => prev + '.')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [generatingMessage])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (newMessage.trim() && !disabled) {
      setChatMessages([...chatMessages, { role: 'user', content: newMessage }])
      setNewMessage('')
      setIsLoading(true)
      
      if (newMessage.toLowerCase() === 'test') {
        setGeneratingMessage('Generating response')
        setTimeout(() => {
          setChatMessages(prev => [...prev, { role: 'assistant', content: "This is a test response that took 5 seconds to generate." }])
          setIsLoading(false)
          setGeneratingMessage('')
        }, 5000)
      } else if (newMessage.toLowerCase() === 'graph') {
        setTimeout(() => {
          const graphData = [
            { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
            { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
            { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
            { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
            { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
            { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
            { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
          ]
          setChatMessages(prev => [...prev, { role: 'assistant', content: { type: 'graph', data: graphData } }])
          setIsLoading(false)
        }, 1000)
      } else {
        setTimeout(() => {
          setChatMessages(prev => [...prev, { role: 'assistant', content: "I'm an AI assistant. How can I help you?" }])
          setIsLoading(false)
        }, 1000)
      }
    }
  }

  const renderMessageContent = (content: MessageContent) => {
    if (typeof content === 'string') {
      return content
    } else if (content.type === 'graph') {
      return (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={content.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    }
  }

  return (
    <Card className="bg-white shadow-md h-full flex flex-col">
      <CardHeader>
        <CardTitle>Chat with Model</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 overflow-hidden">
        <div 
          ref={chatContainerRef} 
          className="flex-grow overflow-y-auto p-4 border rounded-md bg-gray-50"
          style={{ maxHeight: 'calc(100vh - 250px)' }}
        >
          {chatMessages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-flex items-start ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="mr-2 mt-1">
                    <Bot className="h-6 w-6 text-blue-500" />
                  </div>
                )}
                <div className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              {generatingMessage ? (
                <p className="text-blue-500">{generatingMessage}</p>
              ) : (
                <Loader className="animate-spin h-6 w-6 text-blue-500" />
              )}
            </div>
          )}
        </div>
        <div className="flex space-x-2 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-12 w-12 p-0 flex items-center justify-center" disabled={disabled}>
                <Sliders className="h-6 w-6" />
                <span className="sr-only">Set System Prompt</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] w-[90vw] bg-white shadow-lg border border-gray-200">
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
                className="w-full text-lg py-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-200 ease-in-out"
              >
                Set Prompt
              </Button>
            </DialogContent>
          </Dialog>
          <Input 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            disabled={disabled}
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6 text-lg font-semibold rounded-md transition duration-200 ease-in-out"
            disabled={isLoading || disabled}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}