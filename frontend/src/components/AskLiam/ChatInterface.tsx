import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Loader, Paperclip, Sliders, Bot, Settings, Image as ImageIcon, ArrowUp, ChevronRight, X } from 'lucide-react'
import { SystemPromptDialog } from './SystemPromptDialog'
import { MessageContent, ChatMessage } from './types'
import { Dialog, DialogContent } from "../ui/dialog"
import { BarChart2, Image, Table, File } from 'lucide-react'
import InferenceSettings from './InferenceSettings'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChatInterfaceProps {
  disabled: boolean;
}

export default function ChatInterface({ disabled }: ChatInterfaceProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [pastedImages, setPastedImages] = useState<string[]>([])
  const [showContentPanel, setShowContentPanel] = useState(false)
  const [activeContent, setActiveContent] = useState<MessageContent | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [serverUsage, setServerUsage] = useState({
    cpuUsage: 'N/A',
    gpuUsage: 'N/A',
    totalTime: '00:00:00',
    vramUsage: 'N/A'
  });

  const [inferenceSettings, setInferenceSettings] = useState({
    temperature: 0.7,
    top_k: 40,
    top_p: 0.95,
    min_p: 0.05,
    n_predict: -1,
    n_keep: 0,
    stream: true,
    tfs_z: 1.0,
    typical_p: 1.0,
    repeat_penalty: 1.1,
    repeat_last_n: 64,
    penalize_nl: true,
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
    mirostat: 0,
    mirostat_tau: 5.0,
    mirostat_eta: 0.1,
    seed: -1,
    ignore_eos: false,
    cache_prompt: false,
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  useEffect(() => {
    const updateServerUsage = () => {
      setServerUsage({
        cpuUsage: Math.round(Math.random() * 100) + '%',
        gpuUsage: Math.round(Math.random() * 100) + '%',
        totalTime: '00:' + Math.round(Math.random() * 59).toString().padStart(2, '0') + ':' + Math.round(Math.random() * 59).toString().padStart(2, '0'),
        vramUsage: Math.round(Math.random() * 16) + 'GB'
      });
    };

    const intervalId = setInterval(updateServerUsage, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = () => {
    if ((newMessage.trim() || pastedImages.length > 0) && !disabled) {
      const newChatMessage: ChatMessage = {
        role: 'user',
        content: newMessage,
        images: pastedImages
      }
      setChatMessages([...chatMessages, newChatMessage])
      setNewMessage('')
      setPastedImages([])
      setIsLoading(true)
      
      setTimeout(() => {
        const aiResponse = generateAIResponse(newMessage)
        setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
        setIsLoading(false)
        if (typeof aiResponse !== 'string') {
          setActiveContent(aiResponse)
          setShowContentPanel(true)
        }
      }, 1000)
    }
  }

  const generateAIResponse = (userMessage: string): MessageContent => {
    if (userMessage.toLowerCase().includes('graph')) {
      return {
        type: 'graph',
        data: [
          { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
          { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
          { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
          { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
        ]
      }
    } else if (userMessage.toLowerCase().includes('table')) {
      return {
        type: 'table',
        data: [
          { id: 1, name: 'John Doe', age: 32 },
          { id: 2, name: 'Jane Doe', age: 28 },
          { id: 3, name: 'Bob Smith', age: 45 },
        ]
      }
    } else if (userMessage.toLowerCase().includes('image')) {
      return {
        type: 'image',
        url: 'https://via.placeholder.com/150'
      }
    } else if (userMessage.toLowerCase().includes('file')) {
      return {
        type: 'file',
        name: 'example.txt',
        url: 'https://example.com/example.txt'
      }
    } else {
      return "I've received your message. How can I help you further?"
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPastedImages(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile()
        if (blob) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setPastedImages(prev => [...prev, e.target?.result as string])
          }
          reader.readAsDataURL(blob)
        }
      }
    }
  }

  const handleImageDelete = (index: number) => {
    setPastedImages(prev => prev.filter((_, i) => i !== index))
  }

  const renderMessageContent = (content: MessageContent) => {
    if (typeof content === 'string') {
      return content;
    }
    return (
      <Button
        onClick={() => {
          setActiveContent(content)
          setShowContentPanel(true)
        }}
        variant="outline"
        className="font-semibold text-primary hover:text-primary-dark transition-all duration-300 transform hover:scale-105 hover:shadow-md bg-white border border-primary rounded-lg px-4 py-2 flex items-center space-x-2"
      >
        {content.type === 'graph' && <BarChart2 className="h-4 w-4" />}
        {content.type === 'image' && <Image className="h-4 w-4" />}
        {content.type === 'table' && <Table className="h-4 w-4" />}
        {content.type === 'file' && <File className="h-4 w-4" />}
        <span>View {content.type} content</span>
      </Button>
    );
  }

  const renderContentPanel = () => {
    if (!activeContent || typeof activeContent === 'string') return null;

    switch (activeContent.type) {
      case 'graph':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={activeContent.data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'image':
        return <img src={activeContent.url} alt="Content" className="max-w-full h-auto" />;
      case 'table':
        if (!activeContent.data || activeContent.data.length === 0) return null;
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(activeContent.data[0]).map((key) => (
                  <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeContent.data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'file':
        return (
          <div className="flex items-center space-x-2">
            <File className="h-6 w-6" />
            <a href={activeContent.url} download={activeContent.name} className="text-blue-600 hover:underline">
              {activeContent.name}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full h-full">
      <Card className={`h-full flex flex-col shadow-lg ${showContentPanel ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
        <CardHeader className="pb-2 bg-gradient-to-r from-primary to-primary-dark flex items-center justify-between">
          <div className="flex items-center w-full">
            <CardTitle className="text-2xl font-bold text-gray-800">Chat</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="ml-2 text-gray-800 hover:text-primary-dark transition-all duration-300 transform hover:scale-110 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 animate-pulse"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-4 space-y-4">
          <div 
            ref={chatContainerRef} 
            className="flex-grow overflow-y-auto p-6 border rounded-md bg-gray-50 shadow-inner"
            style={{ height: '700px' }}  
          >
            <div className="sticky top-0 bg-gray-100 p-2 mb-4 rounded-md shadow-sm text-xs text-gray-600 flex justify-between items-center">
              <span>CPU: {serverUsage.cpuUsage}</span>
              <span>GPU: {serverUsage.gpuUsage}</span>
              <span>시간: {serverUsage.totalTime}</span>
              <span>VRAM: {serverUsage.vramUsage}</span>
            </div>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                {msg.role === 'assistant' && (
                  <div className="mr-2 flex-shrink-0">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                )}
                <div className={`max-w-[70%] p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-blue-100' : 'bg-white'}`}>
                  {renderMessageContent(msg.content)}
                  {msg.images && msg.images.map((img, imgIndex) => (
                    <img key={imgIndex} src={img} alt={`Upload ${imgIndex + 1}`} className="mt-2 max-w-full h-auto rounded-md" />
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center items-center">
                <Loader className="animate-spin h-6 w-6 text-primary" />
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            {pastedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-md">
                {pastedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt={`Pasted ${index + 1}`} className="w-20 h-20 object-cover rounded-md" />
                    <button
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                    >
                      <Loader className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center  space-x-2 bg-white border border-gray-300 rounded-md p-2">
              <SystemPromptDialog>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Sliders className="h-5 w-5" />
                </Button>
              </SystemPromptDialog>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
                multiple
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-600 hover:text-gray-800"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-600 hover:text-gray-800"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPaste={handlePaste}
                placeholder="Use shift + return for new line"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                className="flex-grow bg-transparent text-black placeholder-gray-400 focus:outline-none"
                disabled={disabled}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || disabled}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-md p-2"
                size="sm"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {showContentPanel && (
        <Card className="w-1/3 h-full ml-4 flex flex-col shadow-lg">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary to-primary-dark flex items-center justify-between relative">
            <CardTitle className="text-2xl font-bold text-gray-800">Content Panel</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowContentPanel(false)
                setActiveContent(null)
              }}
              className="absolute top-2 right-2 text-gray-800 hover:text-primary-dark transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            >
              <X className="h-6 w-6" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4">
            {renderContentPanel()}
          </CardContent>
        </Card>
      )}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <div className="p-6 bg-white">
            <InferenceSettings
              settings={inferenceSettings}
              onSettingsChange={(newSettings) => setInferenceSettings({ ...inferenceSettings, ...newSettings })}
              disabled={disabled}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}