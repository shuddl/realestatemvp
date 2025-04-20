'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Channel, 
  Chat, 
  ChannelHeader, 
  MessageInput, 
  MessageList
} from '@/lib/mockStreamChat';

export default function CoachChatPage({ params }: { params: { coachId: string } }) {
  const coachId = params.coachId;
  const coachName = coachId === '1' ? 'Sarah Wilson' : coachId === '2' ? 'Michael Johnson' : 'Your Coach';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/coaching" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Coaching Portal
        </Link>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mr-4">
          <span className="text-2xl">{coachName.charAt(0)}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{coachName}</h1>
          <p className="text-gray-600">Section 8 Investment Coach</p>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Chat client={{}}>
          <Channel>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Channel>
        </Chat>
        
        <div className="p-4 bg-yellow-50 border-t border-yellow-100">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> This is a demo version. In the production app, you would have secure, private messaging with your coach.
          </p>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Upcoming Coaching Sessions</h2>
        <div className="bg-white p-4 rounded-lg mb-2 border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Section 8 Deal Analysis</h3>
              <p className="text-gray-600 text-sm">30-minute strategy session</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Tue, May 24</p>
              <p className="text-gray-600 text-sm">2:00 PM - 2:30 PM</p>
            </div>
          </div>
        </div>
        
        <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
          Schedule Another Session
        </button>
      </div>
    </div>
  );
}