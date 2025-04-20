// Mock implementations for stream-chat dependencies

export const StreamChat = class {
  constructor(apiKey: string, token?: string) {
    console.log('Mock StreamChat initialized with:', apiKey);
  }

  connectUser(user: any, token: string) {
    return Promise.resolve({
      id: user.id || 'mock-user',
      name: user.name || 'Mock User',
      image: user.image || 'https://placehold.co/100x100',
    });
  }

  disconnectUser() {
    return Promise.resolve();
  }

  channel(type: string, id: string, data: any = {}) {
    return {
      watch: () => Promise.resolve(),
      id,
      type,
      data,
      sendMessage: () => Promise.resolve({ message: 'Mock message sent!' }),
      state: { messages: [] }
    };
  }
};

export const useChannelStateContext = () => ({
  messages: [],
  loading: false,
  loadingMore: false,
});

export const useChatContext = () => ({
  client: new StreamChat('mock-key'),
  setActiveChannel: () => {},
  channel: {
    id: 'mock-channel',
    watch: () => Promise.resolve(),
    sendMessage: () => Promise.resolve({ message: 'Mock message sent!' }),
  }
});

export const Channel = ({ children }: { children: React.ReactNode }) => <div className="stream-chat-channel">{children}</div>;
export const ChannelHeader = () => <div className="p-4 bg-gray-100 border-b">Chat Channel Header</div>;
export const MessageList = () => (
  <div className="p-4 h-64 overflow-y-auto bg-white">
    <div className="p-2 bg-gray-100 rounded-lg mb-2">
      <p className="font-semibold">User 1</p>
      <p>This is a mock message in the demo version.</p>
      <span className="text-xs text-gray-500">11:30 AM</span>
    </div>
    <div className="p-2 bg-blue-100 rounded-lg mb-2">
      <p className="font-semibold">User 2</p>
      <p>Thanks for the information about this property!</p>
      <span className="text-xs text-gray-500">11:32 AM</span>
    </div>
  </div>
);

export const MessageInput = () => (
  <div className="p-4 border-t">
    <div className="flex">
      <input
        type="text"
        placeholder="Type your message here (Demo Only)"
        className="flex-grow p-2 border rounded-l-lg focus:outline-none"
        disabled
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">
        Send
      </button>
    </div>
  </div>
);

export const Chat = ({ client, children }: { client: any; children: React.ReactNode }) => (
  <div className="stream-chat-container">{children}</div>
);

// Mock styles for stream-chat
export const mockStreamChatStyles = `
  .stream-chat-container { 
    display: flex;
    flex-direction: column;
    height: 500px;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .stream-chat-channel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;
