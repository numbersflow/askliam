import React, { useRef, useState, ReactNode, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from "../ui/button"
import { Loader, Paperclip, Sliders, Bot, Settings, Image as ImageIcon, ArrowUp, Info } from 'lucide-react'
import { SystemPromptDialog } from './SystemPromptDialog'
import { MessageContent, ChatMessage, InferenceSettings } from './types'
import { Dialog, DialogContent } from "../ui/dialog"
import InferenceSettingsComponent from './InferenceSettings'
import { useServerUsage } from '../../hook/useServerUsage'
import { sendMessage } from '../../hook/useChat'
import { ContentPanel } from './ContentPanel'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ModelInfoDialog } from './ModelInfoDialog'

interface ChatInterfaceProps {
  disabled: boolean;
}

export default function Component({ disabled }: ChatInterfaceProps) {
  const [sessionId, setSessionId] = useState<string>('')
  const [newMessage, setNewMessage] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showModelInfo, setShowModelInfo] = useState(false)
  const [pastedImages, setPastedImages] = useState<string[]>([])
  const [showContentPanel, setShowContentPanel] = useState(false)
  const [activeContent, setActiveContent] = useState<MessageContent | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { serverUsage, updateServerUsage } = useServerUsage();

  const [inferenceSettings, setInferenceSettings] = useState<InferenceSettings>({
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
    const newSessionId = uuidv4()
    setSessionId(newSessionId)
    localStorage.setItem('chatSessionId', newSessionId)
  }, [])

  const renderMessage = (content: string): ReactNode => {
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={lastIndex} style={{ whiteSpace: 'pre-wrap' }}>{content.slice(lastIndex, match.index)}</span>);
      }
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push(
        <SyntaxHighlighter
          key={match.index}
          language={language}
          style={tomorrow}
          customStyle={{ margin: '1em 0' }}
        >
          {code}
        </SyntaxHighlighter>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(<span key={lastIndex} style={{ whiteSpace: 'pre-wrap' }}>{content.slice(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  const updateChatMessages = (newContent: string) => {
    setChatMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage.role === 'assistant') {
        return newMessages.map(msg => 
          msg === lastMessage ? { ...msg, content: newContent } : msg
        );
      } else {
        return [...newMessages, { role: 'assistant', content: newContent }];
      }
    });

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

const handleSendMessage = async () => {
  if ((newMessage.trim() || pastedImages.length > 0) && !disabled) {
    setIsLoading(true);

    const maxLength = 3000;
    const limitedMessage = newMessage.slice(0, maxLength); // 원본 메시지를 잘라냄

    const userMessage: ChatMessage = { role: 'user', content: limitedMessage, images: pastedImages };
    setChatMessages(prev => [...prev, userMessage]);

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    try {
      const stream = await sendMessage(limitedMessage, pastedImages, inferenceSettings, systemPrompt, sessionId);
      if (stream) {
        const reader = stream.getReader();
        let assistantMessage = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          try {
            const jsonData = JSON.parse(chunk);
            assistantMessage += jsonData.content;
            updateChatMessages(assistantMessage);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setNewMessage('');
      setPastedImages([]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      updateServerUsage();
    }
  }
}

  const handleSetSystemPrompt = (prompt: string) => {
    setSystemPrompt(prompt);
    console.log("System prompt set:", prompt);
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = newMessage;
    }
  }, [newMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-t-lg shadow-md border border-blue-400">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white drop-shadow-md tracking-wide">Ask Liam</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModelInfo(true)}
              className="text-white border-white hover:bg-white/20 transition-colors duration-200"
            >
              <Info className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Model Info</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-white border-white hover:bg-white/20 transition-colors duration-200"
            >
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-grow flex flex-col bg-white rounded-b-lg shadow-md border border-gray-200">
        <div 
          ref={chatContainerRef} 
          className="flex-grow overflow-y-auto p-2 bg-white border-b border-gray-200"
          style={{ height: 'calc(100vh - 120px)' }}
        >
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 p-1 mb-2 rounded-md shadow-md text-xs text-white flex flex-wrap justify-between items-center">
            {serverUsage.gpu_name && (
              <span className="font-semibold w-full mb-1">GPU: {serverUsage.gpu_name}</span>
            )}
            <span className="w-1/2">CPU: {serverUsage.cpu_usage.toFixed(2)}%</span>
            <span className="w-1/2">Mem: {serverUsage.memory_usage.toFixed(2)}%</span>
            {serverUsage.gpu_name && (
              <>
                {serverUsage.gpu_usage !== null && <span className="w-1/2">GPU: {serverUsage.gpu_usage.toFixed(2)}%</span>}
                {serverUsage.vram_usage !== null && <span className="w-1/2">VRAM: {serverUsage.vram_usage.toFixed(2)}%</span>}
              </>
            )}
          </div>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              {msg.role === 'assistant' && (
                <div className="mr-2 flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
              <div className={`max-w-[85%] p-2 rounded-lg shadow-md ${
                msg.role === 'user' 
                  ? 'bg-blue-100' 
                  : 'bg-gray-100 border border-gray-300'
              }`}>
                {typeof msg.content === 'string' ? renderMessage(msg.content) : JSON.stringify(msg.content)}
                {msg.images && msg.images.map((img, imgIndex) => (
                  <img key={imgIndex} src={img} alt={`Upload ${imgIndex + 1}`} className="mt-2 max-w-full h-auto rounded-md" />
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Loader className="animate-spin h-5 w-5 text-primary" />
            </div>
          )}
        </div>
        <div className="p-2">
          {pastedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-md mb-2">
              {pastedImages.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt={`Pasted ${index + 1}`} className="w-16 h-16 object-cover rounded-md" />
                  <button
                    onClick={() => handleImageDelete(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                  >
                    <Loader className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center space-x-1 bg-gray-50 border border-gray-300 rounded-md p-1 shadow-sm">
            <SystemPromptDialog onSetSystemPrompt={handleSetSystemPrompt}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                <Sliders className="h-4 w-4" />
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
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <input
              ref={inputRef}
              onChange={(e) => setNewMessage(e.target.value)}
              onPaste={handlePaste}
              placeholder="메시지를 입력하세요"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-grow bg-transparent text-xs text-black placeholder-gray-400 focus:outline-none min-w-0"
              disabled={disabled}
            />
            <Button 
               
              onClick={handleSendMessage} 
              disabled={isLoading || disabled}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md p-1"
              size="sm"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {showContentPanel && activeContent && (
        <ContentPanel 
          content={activeContent} 
          onClose={() => {
            setShowContentPanel(false);
            setActiveContent(null);
          }} 
        />
      )}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <InferenceSettingsComponent
            settings={inferenceSettings}
            onSettingsChange={(newSettings) => setInferenceSettings({ ...inferenceSettings, ...newSettings })}
            disabled={disabled}
          />
        </DialogContent>
      </Dialog>
      <ModelInfoDialog isOpen={showModelInfo} onClose={() => setShowModelInfo(false)} />
    </div>
  )
}