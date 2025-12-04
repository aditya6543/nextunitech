import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messageService, authService, ApiError } from '../services/api'; // Import services
import { useAuth } from '../contexts/AuthContext'; // Assuming you use AuthContext

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
};

const AdminDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
      const response = await messageService.getMessages();

      // --- FIX: Add a check for response.data ---
      if (response.success && response.data && typeof response.data === 'object' && 'messages' in response.data) {
        // Now TypeScript knows response.data exists and likely has messages
        const messagesData = response.data.messages as any[]; // Type assertion might be needed depending on API response typing

        const fetchedMessages = messagesData.map((msg: any) => ({
          ...msg,
          createdAt: msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A'
        }));
        setMessages(fetchedMessages);
        setFilteredMessages(fetchedMessages);
      } else {
        // Handle cases where success is false or data/messages are missing
        console.error("Backend error or missing data:", response.error || response.message);
        setError(response.error || response.message || "Failed to fetch messages or no messages found");
        // Clear messages if the fetch failed or returned no data
        setMessages([]);
        setFilteredMessages([]);
      }
      // --- END FIX ---

    } catch (error) { // Keep the improved catch block
      console.error('Failed to fetch messages', error);
      if (error instanceof ApiError && error.status === 401) {
          logout();
          navigate('/');
          setError('Session expired. Please log in again.');
      } else if (error instanceof Error) {
          setError(error.message);
      } else {
          setError('Could not load messages. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

    fetchMessages();
  }, []);

  useEffect(() => {
    let result = messages;

    if (filter !== 'all') {
      result = result.filter(msg => msg.status === filter);
    }

    if (searchTerm) {
      result = result.filter(
        msg => 
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMessages(result);
  }, [filter, searchTerm, messages]);

  const updateMessageStatus = async (id: string, newStatus: Message['status']) => {
    try {
      const response = await fetch(`http://localhost:4000/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === id ? { ...msg, status: newStatus } : msg
          )
        );
      }
    } catch (error) {
      // Handle error silently or show a user-friendly message
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex mb-4 space-x-4">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>

            <input 
              type="text" 
              placeholder="Search by name or email" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map(msg => (
                <tr key={msg.id} className="border-b dark:border-gray-700">
                  <td className="p-3">{msg.name}</td>
                  <td className="p-3">{msg.email}</td>
                  <td className="p-3 truncate max-w-xs">{msg.message}</td>
                  <td className="p-3">
                    <span 
                      className={`px-2 py-1 rounded text-xs ${
                        msg.status === 'unread' ? 'bg-red-100 text-red-800' :
                        msg.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    {msg.status === 'unread' && (
                      <button 
                        onClick={() => updateMessageStatus(msg.id, 'read')}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Mark Read
                      </button>
                    )}
                    {msg.status === 'read' && (
                      <button 
                        onClick={() => updateMessageStatus(msg.id, 'replied')}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Mark Replied
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
