import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Send, Search, Users } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Conversation, Message as MessageType } from '../types/social';
import { getConversations, getMessages, sendMessage as sendMessageService } from '../services/socialService';
import { Avatar } from '../components/common/Avatar';
import { motion } from 'framer-motion';

const Messages = () => {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const convs = await getConversations(user.id);
        setConversations(convs);
        if (convs.length > 0 && !selectedConversation) {
          setSelectedConversation(convs[0]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        const msgs = await getMessages(selectedConversation.id);
        setMessages(msgs);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    const otherParticipant = selectedConversation.participants.find(p => p.userId !== user.id);
    if (!otherParticipant) return;

    try {
      const sent = await sendMessageService(
        user.id,
        otherParticipant.userId,
        newMessage.trim()
      );
      
      setMessages([...messages, sent]);
      setNewMessage('');
      
      // Update conversation
      const updated = conversations.map(c => 
        c.id === selectedConversation.id
          ? { ...c, lastMessage: sent, updatedAt: new Date().toISOString() }
          : c
      );
      setConversations(updated);
      setSelectedConversation({ ...selectedConversation, lastMessage: sent });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Please sign in to view messages</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full h-[calc(100vh-8rem)] flex bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const otherParticipant = conv.participants.find(p => p.userId !== user.id);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors text-left ${
                      selectedConversation?.id === conv.id ? 'bg-gray-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={otherParticipant?.userName || 'User'}
                        src={otherParticipant?.userAvatar}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">
                          {otherParticipant?.userName || 'User'}
                        </div>
                        {conv.lastMessage && (
                          <div className="text-sm text-gray-400 truncate">
                            {conv.lastMessage.content}
                          </div>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="bg-green-ecco text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-800">
                {(() => {
                  const otherParticipant = selectedConversation.participants.find(p => p.userId !== user.id);
                  return (
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={otherParticipant?.userName || 'User'}
                        src={otherParticipant?.userAvatar}
                        size="md"
                      />
                      <div>
                        <div className="font-semibold text-white">
                          {otherParticipant?.userName || 'User'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {otherParticipant?.isOnline ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.senderId === user.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-green-ecco text-black'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-gray-700' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-green-ecco text-black font-bold py-2 px-6 rounded-lg hover:bg-green-300 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;

