'use client';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chatbot Assistant</h1>
          <p className="text-gray-600">Get instant marketing guidance and strategic advice</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4">
              <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Chatbot</h3>
            <p className="text-gray-500">Intelligent marketing assistant - Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
