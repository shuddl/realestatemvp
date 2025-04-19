'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StreamChat } from 'stream-chat';
import Link from 'next/link';

export default function CoachingPage() {
  const { user } = useAuth();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coaches, setCoaches] = useState([
    {
      id: 'coach-1',
      name: 'Sarah Johnson',
      title: 'Section 8 Investment Specialist',
      bio: 'With over 10 years of experience in Section 8 real estate investing, Sarah has helped hundreds of investors build profitable portfolios across multiple markets.',
      calendlyUrl: 'https://calendly.com/sarahjohnson/section8-strategy',
      image: 'https://randomuser.me/api/portraits/women/23.jpg',
    },
    {
      id: 'coach-2',
      name: 'Michael Rodriguez',
      title: 'Property Management Expert',
      bio: 'Michael specializes in optimizing Section 8 property management processes. His guidance has helped investors save thousands in operational costs while maintaining high-quality housing.',
      calendlyUrl: 'https://calendly.com/michaelrodriguez/property-management',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    {
      id: 'coach-3',
      name: 'Jennifer Lee',
      title: 'Market Analysis Strategist',
      bio: 'Jennifer helps investors identify high-potential Section 8 markets using data-driven approaches. Her analytical frameworks have become industry standards for market evaluation.',
      calendlyUrl: 'https://calendly.com/jenniferlee/market-analysis',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
  ]);

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

        // Create DM channels with coaches
        const coachChannels = await Promise.all(
          coaches.map(async (coach) => {
            const channel = client.channel('messaging', {
              members: [user.id, coach.id],
            });
            await channel.create();
            return channel;
          })
        );

        setChatClient(client);
      } catch (err) {
        console.error('Error initializing chat for coaching:', err);
        setError('Failed to initialize coaching chat. Please try again later.');
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
  }, [user, coaches]);

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
                Please sign in to access coaching services.{' '}
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Expert Section 8 Coaching</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get personalized guidance from our team of Section 8 investment experts. 
          Schedule a session and take your investment strategy to the next level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {coaches.map((coach) => (
          <div key={coach.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 relative">
              <img 
                src={coach.image} 
                alt={coach.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold">{coach.name}</h3>
              <p className="text-primary font-medium mb-2">{coach.title}</p>
              <p className="text-gray-600 mb-4">{coach.bio}</p>
              <div className="flex flex-col space-y-2">
                <Link 
                  href={`/coaching/${coach.id}/chat`}
                  className="btn btn-secondary w-full text-center"
                >
                  Message Coach
                </Link>
                <a 
                  href={coach.calendlyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full text-center"
                >
                  Schedule Session
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendly Integration */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Schedule a Coaching Session</h2>
          <p className="text-gray-600">Select a time slot that works best for you.</p>
        </div>
        <div className="h-[600px]">
          {/* In a real app, you would use the Calendly embed script or a React wrapper */}
          <div className="w-full h-full flex items-center justify-center bg-gray-50 p-6">
            <div className="text-center">
              <div className="rounded-full bg-gray-200 p-4 mb-4 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Calendly Integration</h3>
              <p className="text-gray-600 mb-4">
                In a production environment, this would load a Calendly scheduling widget.
                <br />
                For this MVP, please click on the "Schedule Session" button on a coach profile.
              </p>
              <a 
                href="https://calendly.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary inline-block"
              >
                Open Calendly
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Coaching Resources */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Free Coaching Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Section 8 Investment Guide</h3>
              <p className="text-gray-600 mb-4">
                Download our comprehensive guide to investing in Section 8 properties. Includes market analysis, financing strategies, and tenant management tips.
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Download PDF →
              </a>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Video Workshops</h3>
              <p className="text-gray-600 mb-4">
                Watch our collection of expert workshops covering different aspects of Section 8 investing, from property selection to tenant placement.
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                View Workshops →
              </a>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="mb-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Deal Calculator Templates</h3>
              <p className="text-gray-600 mb-4">
                Download our advanced Section 8 deal analysis spreadsheets to accurately evaluate potential investments and cash flow.
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Get Templates →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}