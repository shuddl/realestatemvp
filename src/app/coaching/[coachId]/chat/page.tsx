'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css';

// These should come from a database in a real app
const coaches = [
  {
    id: 'coach-1',
    name: 'Sarah Johnson',
    title: 'Section 8 Investment Specialist',
    image: 'https://randomuser.me/api/portraits/women/23.jpg',
  },
  {
    id: 'coach-2',
    name: 'Michael Rodriguez',
    title: 'Property Management Expert',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 'coach-3',
    name: 'Jennifer Lee',
    title: 'Market Analysis Strategist',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
];

export default function CoachChatPage() {
  const { coachId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [coach, setCoach] = useState<any | null>(null);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Find coach by ID
    const foundCoach = coaches.find(c => c.id === coachId);
    if (!foundCoach) {
      setError('Coach not found');
      setIsLoading(false);
      return;
    }
    setCoach(foundCoach);

    if (!user) return;

    const initChat = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize Stream Chat client
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        if (!apiKey) {
          throw new Error('Stream API key is missing');
        }

        const client = StreamChat.getInstance(apiKey);

        // Connect user to chat
        await client.connectUser(
          {
            id: user.id,
            name: user.email?.split('@')[0] || user.id,
            image: `https://getstream.io/random_svg/?id=${user.id}&name=${user.email?.split('@')[0] || user.id}`,
          },
          // In a real app, this token would be generated on the server
          client.devToken(user.id)
        );

        // Create or get DM channel with coach
        const channelId = `private-coaching-${user.id}-${foundCoach.id}`;
        const channel = client.channel('messaging', channelId, {
          name: `Private Coaching with ${foundCoach.name}`,
          image: foundCoach.image,
          members: [user.id, foundCoach.id],
        });

        await channel.create();
        
        setChatClient(client);
        setChannel(channel);
      } catch (err) {
        console.error('Error initializing private coaching chat:', err);
        setError('Failed to initialize chat. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initChat();

    // Cleanup function
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [coachId, user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please sign in to access coaching chat.{' '}
                <a href="/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !chatClient || !channel || !coach) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error || 'Failed to initialize chat'}
        </div>
        <div className="text-center">
          <button 
            onClick={() => router.push('/coaching')} 
            className="btn btn-primary inline-block"
          >
            Back to Coaching
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/coaching')}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img src={coach.image} alt={coach.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{coach.name}</h2>
                  <p className="text-sm text-gray-500">{coach.title}</p>
                </div>
              </div>
            </div>
            <a
              href={`https://calendly.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm"
            >
              Schedule Session
            </a>
          </div>
        </div>
        <div className="flex-grow">
          <Chat client={chatClient} theme="messaging light">
            <Channel channel={channel}>
              <Window hideOnThread>
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
}