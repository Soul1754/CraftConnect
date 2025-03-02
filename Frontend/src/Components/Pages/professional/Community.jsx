import React from 'react';
import ProfessionalLayout from '../../Layout/ProfessionalLayout';

const Community = () => {
  // Demo data for community posts
  const posts = [
    {
      id: 1,
      author: 'Jane Smith',
      role: 'Master Electrician',
      title: 'Tips for Managing Multiple Projects',
      content: 'Here are some strategies I use to handle multiple clients effectively...',
      likes: 24,
      comments: 8,
      time: '2 hours ago'
    },
    {
      id: 2,
      author: 'Mike Brown',
      role: 'Plumbing Expert',
      title: 'New Regulations Update',
      content: 'Important updates regarding local plumbing codes and regulations...',
      likes: 15,
      comments: 5,
      time: '4 hours ago'
    },
    {
      id: 3,
      author: 'Sarah Wilson',
      role: 'Interior Designer',
      title: 'Collaboration Opportunity',
      content: 'Looking for skilled craftsmen for an upcoming renovation project...',
      likes: 32,
      comments: 12,
      time: '1 day ago'
    }
  ];

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Professional Community</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create Post
          </button>
        </div>

        {/* Community Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-sm font-medium text-gray-900">{post.author}</span>
                    <span className="text-sm text-gray-500">• {post.role}</span>
                    <span className="text-sm text-gray-500">• {post.time}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">{post.content}</p>
              
              <div className="flex items-center space-x-4 text-sm">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>{post.likes} Likes</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                  </svg>
                  <span>{post.comments} Comments</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default Community;