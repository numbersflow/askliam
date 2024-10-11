import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Sliders, Loader, Bot, Image as ImageIcon, BarChart, Table, Paperclip, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type MessageContent = 
  | string 
  | { type: 'graph', data: any[] }
  | { type: 'image', url: string }
  | { type: 'table', data: any[] }
  | { type: 'file', name: string, url: string }

interface ChatMessage {
  role: 'user' | 'assistant'
  content: MessageContent
}

interface ChatInterfaceProps {
  disabled: boolean;
}

const ContentModal: React.FC<{ content: MessageContent | null; isOpen: boolean; onClose: () => void }> = ({ content, isOpen, onClose }) => {
  if (!isOpen || !content || typeof content === 'string') return null;

  const renderContent = () => {
    switch (content.type) {
      case 'graph':
        return (
          <div className="w-full h-[400px]">
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
        );
      case 'image':
        return <img src={content.url} alt="Chat image" className="max-w-full h-auto" />;
      case 'table':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(content.data[0]).map((key) => (
                  <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value: any, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'file':
        return (
          <div>
            <p>File: {content.name}</p>
            <a href={content.url} download className="text-blue-500 hover:underline">Download</a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-[90vw] bg-white shadow-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {content.type.charAt(0).toUpperCase() + content.type.slice(1)} Content
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ChatMessage: React.FC<{ message: ChatMessage; onContentClick: (content: MessageContent) => void }> = ({ message, onContentClick }) => {
  const getContentTypeIcon = () => {
    if (typeof message.content === 'string') {
      return null;
    }

    switch (message.content.type) {
      case 'graph':
        return <BarChart className="w-4 h-4 mr-2" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 mr-2" />;
      case 'table':
        return <Table className="w-4 h-4 mr-2" />;
      case 'file':
        return <Paperclip className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div className={`inline-flex items-start ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {message.role === 'assistant' && (
          <div className="mr-2 mt-1">
            <Bot className="h-6 w-6 text-blue-500" />
          </div>
        )}
        <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
          {typeof message.content === 'string' ? (
            <p>{message.content}</p>
          ) : (
            <button
              onClick={() => onContentClick(message.content)}
              className="flex items-center text-left px-3 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {getContentTypeIcon()}
              <span>{message.content.type.charAt(0).toUpperCase() + message.content.type.slice(1)} content (click to view)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export function ChatInterface({ disabled }: ChatInterfaceProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'user', content: 'Hello, how are you?' },
    { role: 'assistant', content: "I'm an AI, I don't have feelings." }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatingMessage, setGeneratingMessage] = useState('')
  const [modalContent, setModalContent] = useState<MessageContent | null>(null)
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if ((newMessage.trim() || pendingImage || pendingFile) && !disabled) {
      const messageContent: MessageContent = pendingImage 
        ? { type: 'image', url: pendingImage }
        : pendingFile
        ? { type: 'file', name: pendingFile.name, url: URL.createObjectURL(pendingFile) }
        : newMessage;

      setChatMessages([...chatMessages, { role: 'user', content: messageContent }])
      setNewMessage('')
      setPendingImage(null)
      setPendingFile(null)
      setIsLoading(true)
      
      // Simulated AI response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'assistant', content: "I've received your message. How can I help you further?" }])
        setIsLoading(false)
      }, 1000)
    }
  }

  const handleContentClick = (content: MessageContent) => {
    if (typeof content !== 'string') {
      setModalContent(content);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
              setPendingImage(event.target.result);
            }
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            setPendingImage(event.target.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setPendingFile(file);
      }
    }
  };

  return (
    <Card className="bg-white shadow-md h-full flex flex-col max-w-5xl mx-auto">
      <CardHeader className="bg-white">
        <CardTitle className="text-2xl font-bold">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4 overflow-hidden p-0">
        <div 
          ref={chatContainerRef} 
          className="flex-grow overflow-y-auto p-4 border rounded-md bg-gray-50"
          style={{ height: 'calc(100vh - 200px)', width: '100%' }}
        >
          {chatMessages.map((msg, index) => (
            <ChatMessage key={index} message={msg} onContentClick={handleContentClick} />
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
        {pendingImage && (
          <div className="relative flex items-center justify-between bg-gray-100 p-2 rounded-md">
            <img src={pendingImage} alt="Pending upload" className="h-16 w-16 object-cover rounded" />
            <Button
              onClick={() => setPendingImage(null)}
              variant="secondary"
              className="h-8 w-8 p-0 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {pendingFile && (
          <div className="relative flex items-center justify-between bg-gray-100 p-2 rounded-md">
            <div className="flex items-center">
              <Paperclip className="h-6 w-6 mr-2" />
              <span className="text-sm">{pendingFile.name}</span>
            </div>
            <Button
              onClick={() => setPendingFile(null)}
              variant="secondary"
              className="h-8 w-8 p-0 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex items-center p-4 w-full space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-12 w-12 p-0 flex-shrink-0 flex items-center justify-center" disabled={disabled}>
                <Sliders className="h-6 w-6" />
                <span className="sr-only">Set System Prompt</span>
              </Button>
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*, */*"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 h-12 w-12 p-0 flex-shrink-0 flex items-center justify-center rounded-md transition-all duration-200"
            disabled={disabled}
          >
            <Paperclip className="h-6 w-6" />
          </Button>
          <div className="flex-grow flex items-center space-x-2">
            <Input 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)}
              onPaste={handlePaste}
              placeholder="Type your message here..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={disabled}
            />
            <Button 
              onClick={handleSendMessage} 
              className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6 text-lg font-semibold rounded-md transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              disabled={isLoading || disabled}
            >
              Send
            </Button>
          </div>
        </div>
      </CardContent>
      <ContentModal
        content={modalContent}
        isOpen={!!modalContent}
        onClose={() => setModalContent(null)}
      />
    </Card>
  )
}