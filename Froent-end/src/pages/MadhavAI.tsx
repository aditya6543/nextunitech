import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { chatService, authService } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext';

type Conversation = {
  id: string | number; // <--- FIX: Allow ID to be a string (from DB) or a number (temp)
  userId: number; // This should probably also be string if it comes from user DB
  title: string;
  messages: Message[];
};

type Message = {
  id: number | string; // <--- FIX: Allow ID to be string or number
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
};

const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty')
});

type MessageFormData = {
  message: string;
};

const MadhavAI: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const messagesContainerRef = useRef<null | HTMLDivElement>(null);

  const checkAuthentication = useCallback(async () => {
    try {
      const res: any = await authService.session();
      return !!(res?.success && res.data?.user);
    } catch {
      return false;
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await chatService.getHistory();
      const data: Conversation[] = (res?.data as any)?.conversations || [];
      setConversations(data);

      if (data.length > 0) {
        // User has existing chats, load the first one
        setCurrentConversation(data[0]);
      } else {
        // --- THIS IS THE FIX ---
        // User has no chats, so create a new one for them
        const newConversation: Conversation = {
          id: Date.now(),
          userId: 0, // This is temporary, the backend will handle the real one
          title: `New Chat 1`,
          messages: []
        };
        setConversations([newConversation]);
        setCurrentConversation(newConversation);
        // --- END OF FIX ---
      }
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    }
  }, []); // <-- The empty dependency array is correct and safe

  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);

      // --- THIS IS THE FIX ---
      // Explicitly clear state *before* checking auth or fetching
      setConversations([]);
      setCurrentConversation(null);
      // --- END OF FIX ---

      const isAuthed = await checkAuthentication();
      if (isAuthed) {
        // Now fetch conversations *after* clearing state
        await fetchConversations(); 
      } else {
        navigate('/madhav-ai/login');
      }
      setIsLoading(false);
    };

    initializePage();

    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkAuthentication, fetchConversations, navigate]); // <--- Added navigate to dep array

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema)
  });

  const startNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now(), // This is a temporary numeric ID
      userId: 0,
      title: `New Chat ${conversations.length + 1}`,
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]); // <--- FIX: Add to start
    setCurrentConversation(newConversation);
    
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const deleteChat = async () => {
    if (!currentConversation || typeof currentConversation.id !== 'string') {
        console.warn("Attempted to delete a temporary or non-selected chat.");
        return; // Cannot delete if ID is not a string (i.e., not from DB)
    }

    const conversationIdToDelete = currentConversation.id;
    const conversationTitle = currentConversation.title; // For logging

    console.log(`Attempting to delete chat ID: ${conversationIdToDelete} (Title: ${conversationTitle})`); // Log start

    try {
      // Call the backend API to delete the chat
      const response = await chatService.deleteChat(conversationIdToDelete);

      // Check if the backend confirmed deletion
      if (response && response.success) {
        console.log(`Successfully deleted chat ID: ${conversationIdToDelete} from backend.`);

        // --- Update local state ONLY AFTER successful backend deletion ---
        const updatedConversations = conversations.filter(
          conv => conv.id !== conversationIdToDelete
        );
        setConversations(updatedConversations);

        console.log(`Local state updated. Remaining conversations: ${updatedConversations.length}`);

        // Select the next available chat or start a new one
        if (updatedConversations.length > 0) {
          setCurrentConversation(updatedConversations[0]);
          console.log(`Selected new current conversation ID: ${updatedConversations[0].id}`);
        } else {
          console.log("No conversations left, starting a new temporary chat.");
          startNewChat(); // Creates a new temporary chat
        }
        // --- End state update ---

      } else {
        // Backend deletion failed
        console.error(`Backend failed to delete chat ID: ${conversationIdToDelete}. Response:`, response);
        // Optionally: Show an error message like "Failed to delete chat on server."
      }

    } catch (error) {
      console.error(`Error during deleteChat API call for ID ${conversationIdToDelete}:`, error);
      // Optionally show an error message like "Network error during delete."
    }
  };

  const onSubmit = async (data: MessageFormData) => {
    if (!currentConversation) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: data.message,
      timestamp: new Date().toISOString()
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage]
    };
    
    setCurrentConversation(updatedConversation);
    setConversations(prev => 
      prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
    );

    setIsAiTyping(true);
    reset();

    try {
      // <--- FIX 1: Check if the ID is real (a string) or temporary (a number)
      const isRealId = typeof currentConversation.id === 'string';

      const res = await chatService.sendMessage({ 
        message: data.message, 
        // Only send the ID if it's a real 24-char string
        conversation_id: isRealId ? currentConversation.id.toString() : undefined
      });
      // <--- END FIX 1

      const aiText = (res?.data as any)?.reply || '...';
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toISOString()
      };

      // <--- FIX 2: Get the real ID back from the backend
      const realConversationId = (res?.data as any)?.conversation_id;

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiMessage],
        // If the backend sent us a real ID, use it to update the state
        id: realConversationId ? realConversationId : currentConversation.id
      };
      // <--- END FIX 2

      setCurrentConversation(finalConversation);
      setConversations(prev => 
        prev.map(conv =>
          // Use the *old* ID for mapping, but replace with the *final* conversation
          conv.id === currentConversation.id ? finalConversation : conv
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    
    // Clear local state (still good practice)
    setConversations([]);
    setCurrentConversation(null);

    // --- THIS IS THE NEW FIX ---
    // Force a full page reload to the login page.
    // This destroys all cached data and React state.
    window.location.href = '/madhav-ai/login';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const selectConversation = (conv: Conversation) => {
    setCurrentConversation(conv);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#120224] via-[#1e0a3c] to-[#2b1257]">
        <p className="text-xl text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    // ... (Your JSX remains the same) ...
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-[#120224] via-[#1e0a3c] to-[#2b1257] pt-16">
      {/* Mobile Hamburger Button */}
      {isMobile && !isSidebarOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-[100] bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-lg shadow-xl transition-colors"
        >
          ☰
        </button>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || !isMobile) && (
            <motion.div 
              initial={{ x: isMobile ? '-100%' : 0, width: isMobile ? '100%' : '16rem' }}
              animate={{ x: 0, width: isMobile ? '100%' : '16rem' }}
              exit={{ x: isMobile ? '-100%' : 0 }}
              transition={{ type: 'tween' }}
              className={`absolute top-16 bottom-0 left-0 z-40 bg-[#1e0a3c] border-r border-gray-700 
                ${isMobile ? 'w-full' : 'w-64'} flex flex-col`}
            >
              <div className="p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Madhav.AI</h2>
                  <button 
                    onClick={startNewChat}
                    className="text-white bg-primary-500 hover:bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center"
                    title="New Chat"
                  >
                    +
                  </button>
                </div>
                {isMobile && (
                  <button 
                    onClick={toggleSidebar}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 space-y-2">
                {conversations.map(conv => (
                  <motion.div 
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                      currentConversation?.id === conv.id 
                        ? 'bg-primary-700 text-white' 
                        : 'hover:bg-[#2b1257] text-gray-300'
                    }`}
                  >
                    <p className="text-sm truncate flex-1 mr-2">{conv.title}</p>
                    {conversations.length > 1 && currentConversation?.id === conv.id && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selecting the conversation
                          deleteChat();
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                        title="Delete Chat"
                      >
                        🗑️
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-700 bg-[#1e0a3c]">
                <button 
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${isMobile ? 'pl-0' : 'pl-64'}`}>
          {/* Chat Messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-12 py-4 space-y-4"
          >
            {currentConversation?.messages.map((msg, index) => (
              <div 
                key={msg.id || index} // <--- FIX: Use a stable key
                className={`flex ${
                  msg.sender === 'user' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div 
                  className={`max-w-[65%] p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-primary-500 text-white ml-8 mr-16' 
                      : 'bg-[#2b1257] text-gray-200 mr-8 ml-16'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isAiTyping && (
              <div className="flex justify-end">
                <div className="bg-[#2b1257] text-gray-300 p-3 rounded-lg mr-8 ml-16">
                  Typing...
                </div>
              </div>
            )}
            
            {/* Scroll to bottom reference */}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="p-4 pb-12 border-t border-gray-700 bg-[#1e0a3c]"
          >
            <div className="flex space-x-2">
              <input
                {...register('message')}
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 rounded bg-[#2b1257] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button 
                type="submit" 
                disabled={isAiTyping}
                className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {errors.message && <p className="text-red-400 text-xs mt-1 text-center">{errors.message.message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MadhavAI;