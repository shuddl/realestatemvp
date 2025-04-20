'use client';

import React from 'react';
import { 
  Channel, 
  Chat, 
  ChannelHeader, 
  MessageInput, 
  MessageList
} from '@/lib/mockStreamChat';

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Section 8 Investor Community</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Channels</h2>
          <ul className="space-y-2">
            <li className="p-2 bg-blue-100 rounded cursor-pointer hover:bg-blue-200"># general</li>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer"># market-trends</li>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer"># property-showcase</li>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer"># hud-updates</li>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer"># deal-analysis</li>
          </ul>
          
          <h2 className="font-semibold mt-6 mb-4">Direct Messages</h2>
          <ul className="space-y-2">
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center">
              <span className="bg-green-500 w-2 h-2 rounded-full mr-2"></span>
              John Smith
            </li>
            <li className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center">
              <span className="bg-gray-300 w-2 h-2 rounded-full mr-2"></span>
              Sarah Johnson
            </li>
          </ul>
        </div>
        
        <div className="md:col-span-3 border rounded-lg overflow-hidden">
          <Chat client={{}}>
            <Channel>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Channel>
          </Chat>
          
          <div className="p-4 bg-yellow-50 border-t border-yellow-100">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> This is a demo version. In the production app, you would be connected to our real-time chat platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}