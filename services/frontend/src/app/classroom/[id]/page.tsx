'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  Settings,
  Phone,
  Send,
  Hand,
  X,
} from 'lucide-react';
import { mockLiveClasses } from '@/data/mockData';
import { ChatMessage } from '@/types';
import { getInitials } from '@/lib/utils';

export default function ClassroomPage() {
  const params = useParams();
  const classId = params.id as string;

  const liveClass = mockLiveClasses.find((c) => c.id === classId) || mockLiveClasses[0];

  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      classId,
      userId: 'user-1',
      userName: 'Sarah Mitchell',
      message: 'Hello everyone! Excited for this class.',
      timestamp: new Date(Date.now() - 5 * 60000),
      isQuestion: false,
    },
    {
      id: '2',
      classId,
      userId: 'user-2',
      userName: 'Jennifer Park',
      message: 'Can you explain the difference between Russian and classic technique?',
      timestamp: new Date(Date.now() - 3 * 60000),
      isQuestion: true,
    },
    {
      id: '3',
      classId,
      userId: 'edu-1',
      userName: liveClass.educator.name,
      message: 'Great question Jennifer! I will cover that in detail in the next segment.',
      timestamp: new Date(Date.now() - 2 * 60000),
      isQuestion: false,
    },
  ]);

  const [isEducator] = useState(false); // Toggle for educator view
  const viewerCount = 34;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      classId,
      userId: 'current-user',
      userName: 'You',
      message: messageInput,
      timestamp: new Date(),
      isQuestion: messageInput.includes('?'),
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-[var(--charcoal)] flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-[#1a1a1a] border-b border-white/10 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </Link>
          <div className="hidden sm:block">
            <h1 className="text-white font-light text-sm">{liveClass.title}</h1>
            <p className="text-white/50 text-xs font-light">
              {liveClass.educator.name} • {liveClass.category.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-medium uppercase tracking-wider">Live</span>
          </div>
          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <Users className="w-4 h-4" />
            <span>{viewerCount}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Video */}
          <div className="flex-1 relative bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
            {/* Educator Video Placeholder */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--plum)] to-[var(--plum-light)] flex items-center justify-center">
                  <span className="text-4xl font-light text-white">
                    {getInitials(liveClass.educator.name)}
                  </span>
                </div>
                <p className="text-white text-xl font-light">{liveClass.educator.name}</p>
                <p className="text-white/50 text-sm font-light mt-1">
                  {liveClass.educator.specialty[0]}
                </p>
              </div>
            </div>

            {/* Self View (Small) */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-lg bg-[#2a2a2a] border border-white/10 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[var(--champagne)]/20 flex items-center justify-center">
                    <span className="text-sm font-light text-[var(--champagne)]">YO</span>
                  </div>
                  <p className="text-white/70 text-xs font-light mt-2">You</p>
                </div>
              </div>
              {!isVideoOn && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <VideoOff className="w-6 h-6 text-white/50" />
                </div>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="h-20 bg-[#1a1a1a] border-t border-white/10 flex items-center justify-center px-4">
            <div className="flex items-center space-x-3">
              {/* Mic */}
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMicOn ? 'bg-white/10 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Video */}
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOn ? 'bg-white/10 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Screen Share (Educator only) */}
              {isEducator && (
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isScreenSharing ? 'bg-[var(--champagne)] text-white' : 'bg-white/10 text-white'
                  }`}
                >
                  {isScreenSharing ? (
                    <MonitorOff className="w-5 h-5" />
                  ) : (
                    <Monitor className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Raise Hand */}
              <button className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <Hand className="w-5 h-5" />
              </button>

              {/* Chat Toggle */}
              <button
                onClick={() => {
                  setIsChatOpen(!isChatOpen);
                  setIsParticipantsOpen(false);
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isChatOpen ? 'bg-[var(--champagne)] text-white' : 'bg-white/10 text-white'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* Participants */}
              <button
                onClick={() => {
                  setIsParticipantsOpen(!isParticipantsOpen);
                  setIsChatOpen(false);
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isParticipantsOpen ? 'bg-[var(--champagne)] text-white' : 'bg-white/10 text-white'
                }`}
              >
                <Users className="w-5 h-5" />
              </button>

              {/* Settings */}
              <button className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* Leave */}
              <button className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors ml-4">
                <Phone className="w-5 h-5 rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel - Chat */}
        {isChatOpen && (
          <div className="w-80 bg-[#1a1a1a] border-l border-white/10 flex flex-col flex-shrink-0">
            {/* Chat Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
              <h2 className="text-white font-light">Live Chat</h2>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="group">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-white/70">{getInitials(msg.userName)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            msg.userName === liveClass.educator.name
                              ? 'text-[var(--champagne)]'
                              : 'text-white/80'
                          }`}
                        >
                          {msg.userName}
                        </span>
                        <span className="text-xs text-white/30">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-light mt-1 ${
                          msg.isQuestion ? 'text-blue-400' : 'text-white/70'
                        }`}
                      >
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 bg-white/10 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded bg-[var(--champagne)] text-white flex items-center justify-center hover:bg-[var(--champagne-light)] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Side Panel - Participants */}
        {isParticipantsOpen && (
          <div className="w-80 bg-[#1a1a1a] border-l border-white/10 flex flex-col flex-shrink-0">
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
              <h2 className="text-white font-light">Participants ({viewerCount})</h2>
              <button
                onClick={() => setIsParticipantsOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Educator */}
              <div className="mb-4">
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                  Educator
                </p>
                <div className="flex items-center space-x-3 p-2 rounded bg-white/5">
                  <div className="w-10 h-10 rounded-full bg-[var(--champagne)]/20 flex items-center justify-center">
                    <span className="text-sm text-[var(--champagne)]">
                      {getInitials(liveClass.educator.name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white">{liveClass.educator.name}</p>
                    <p className="text-xs text-white/50">Host</p>
                  </div>
                </div>
              </div>

              {/* Students */}
              <div>
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                  Students
                </p>
                <div className="space-y-2">
                  {['Sarah Mitchell', 'Jennifer Park', 'Maria Santos', 'Emma Thompson'].map(
                    (name, i) => (
                      <div key={i} className="flex items-center space-x-3 p-2 rounded hover:bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-sm text-white/70">{getInitials(name)}</span>
                        </div>
                        <p className="text-sm text-white/80">{name}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
