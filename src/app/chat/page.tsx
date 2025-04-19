'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css';

export default function ChatPage() {
  const { user } = useAuth();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

        // Create default channels if they don't exist
        const generalChannel = client.channel('messaging', 'general', {
          name: 'General',
          image: 'https://getstream.io/random_svg/?id=general&name=General',
        });

        const dealsChannel = client.channel('messaging', 'deals', {
          name: 'Deal Discussions',
          image: 'https://getstream.io/random_svg/?id=deals&name=Deals',
        });

        const marketingChannel = client.channel('messaging', 'marketing', {
          name: 'Marketing & Growth',
          image: 'https://getstream.io/random_svg/?id=marketing&name=Marketing',
        });

        const questionsChannel = client.channel('messaging', 'questions', {
          name: 'Q&A',
          image: 'https://getstream.io/random_svg/?id=questions&name=Questions',
        });

        // Initialize channels
        await Promise.all([
          generalChannel.create(),
          dealsChannel.create(),
          marketingChannel.create(), 
          questionsChannel.create()
        ]);

        setChatClient(client);
      } catch (err) {
        console.error('Error initializing chat:', err);
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
  }, [user]);

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
                Please sign in to access the community chat.{' '}
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

  if (error || !chatClient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error || 'Failed to initialize chat'}
        </div>
        <div className="text-center">
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary inline-block"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex h-full">
        <Chat client={chatClient} theme="messaging light">
          <div className="flex h-full w-full">
            <div className="w-1/4 h-full bg-white border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">Section 8 Community</h2>
                <p className="text-sm text-gray-500">Connect with other investors</p>
              </div>
              <ChannelList 
                filters={{
                  type: 'messaging',
                  members: { $in: [user.id] },
                }} 
                sort={{ last_message_at: -1 }}
                options={{ state: true, watch: true }}
              />
            </div>
            <div className="w-3/4 h-full flex flex-col">
              <Channel>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </div>
          </div>
        </Chat>
      </div>
    </div>
  );
}