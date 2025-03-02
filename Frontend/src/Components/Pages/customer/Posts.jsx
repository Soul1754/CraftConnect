import React, { useState } from 'react';
import CustomerLayout from '../../Layout/CustomerLayout';

const Posts = () => {
    const [posts] = useState([
        { 
            id: 1, 
            title: 'Need Plumbing Service',
            description: 'Looking for a professional plumber to fix a leaky faucet.',
            date: '2024-02-20',
            status: 'Open',
            responses: 3
        },
        { 
            id: 2, 
            title: 'Electrical Wiring Issue',
            description: 'Need help with electrical wiring in the kitchen.',
            date: '2024-02-18',
            status: 'Closed',
            responses: 5
        },
    ]);

    return (
        <CustomerLayout>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Posts</h1>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Create New Post
                    </button>
                </div>

                <div className="mb-6 flex gap-4">
                    <select className="p-2 border rounded-lg">
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>

                    <input
                        type="text"
                        className="p-2 border rounded-lg flex-1"
                        placeholder="Search posts..."
                    />
                </div>

                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">{post.title}</h3>
                                    <p className="text-gray-600 mt-1">{post.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span>Posted: {post.date}</span>
                                        <span>Responses: {post.responses}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        post.status === 'Open' ? 'bg-green-100 text-green-800' : 
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {post.status}
                                    </span>
                                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                        Load More Posts
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Posts;