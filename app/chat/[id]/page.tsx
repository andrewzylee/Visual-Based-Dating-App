'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'me' | 'them'
  timestamp: Date
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! You both like clean, athletic aesthetics. What draws you to that style?',
      sender: 'them',
      timestamp: new Date(Date.now() - 3600000),
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'me',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'That sounds interesting! Tell me more.',
        sender: 'them',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-sm border-b border-purple-500/30 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold">Match</h2>
            <p className="text-sm text-slate-400">Visual compatibility: High</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === 'me'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-slate-900/95 backdrop-blur-sm border-t border-purple-500/30 p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none text-white placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

