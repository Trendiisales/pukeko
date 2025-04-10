import React, { useState, useCallback } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, BarChart2, Grid } from 'lucide-react';

const PukekoSocialMedia = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [topic, setTopic] = useState('');
  const [posts, setPosts] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleGeneratePosts = useCallback(() => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    // Simulate API call or generation logic
    setTimeout(() => {
      setPosts({
        facebook: `Check out this interesting finding about "${topic}"! [Link to source] #facebook #topic`,
        twitter: `"${topic}" is making waves! 🌊 Short insights here. #twitter #news [Link]`,
        linkedin: `Professional perspective on "${topic}": Exploring the implications for the industry. Let's discuss the impact.\n\n#linkedin #business #${topic.replace(/\s+/g, '')}`,
        instagram: `Visually exploring "${topic}". What are your thoughts? 🤔 #instagram #visuals #${topic.replace(/\s+/g, '')} #instadaily`,
      });
      setIsGenerating(false);
    }, 1000); // Simulate network delay
  }, [topic]);

  const handlePostAll = useCallback(() => {
     setIsPosting(true);
     // Simulate posting to all platforms
     setTimeout(() => {
        setIsPosting(false);
        setShowConfirmation(true);
        // Hide confirmation after 3s
        setTimeout(() => setShowConfirmation(false), 3000);
     }, 1500);
  }, []); 

  const handleInputChange = (platform, value) => {
    setPosts(prev => ({ ...prev, [platform]: value }));
  };

  const platformConfig = [
    { 
      name: 'Facebook', 
      key: 'facebook', 
      charLimit: 5000, 
      icon: <Facebook size={32} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      placeholder: 'Write your Facebook post here...' 
    },
    { 
      name: 'Twitter', 
      key: 'twitter', 
      charLimit: 280, 
      icon: <Twitter size={32} />,
      color: 'text-sky-500',
      bgColor: 'bg-sky-100',
      placeholder: 'Craft your tweet (max 280 chars)...' 
    },
    { 
      name: 'LinkedIn', 
      key: 'linkedin', 
      charLimit: 3000, 
      icon: <Linkedin size={32} />,
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
      placeholder: 'Compose your LinkedIn update...' 
    },
    { 
      name: 'Instagram', 
      key: 'instagram', 
      charLimit: 2200, 
      icon: <Instagram size={32} />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      placeholder: 'Write your Instagram caption...' 
    },
  ];

  const canPost = Object.values(posts).some(post => post.trim() !== '');

  // Logo SVG based on provided image
  const PukekoLogo = () => (
    <svg viewBox="0 0 100 100" className="h-14 w-14">
      <defs>
        <clipPath id="hexagonClip">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        </clipPath>
      </defs>
      <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#7BC142" stroke="#7BC142" strokeWidth="2" />
      <g clipPath="url(#hexagonClip)">
        <rect x="5" y="5" width="90" height="90" fill="white" />
        <g transform="translate(20, 20) scale(0.6)">
          <path d="M10,30 Q30,10 40,20 Q50,30 60,25 Q70,20 80,30 L80,50 Q70,70 50,60 Q30,50 20,60 Z" fill="black" />
          <path d="M30,60 L20,90" stroke="black" strokeWidth="3" />
          <path d="M70,60 L80,90" stroke="black" strokeWidth="3" />
          <path d="M50,60 L50,85" stroke="black" strokeWidth="3" />
          <path d="M60,60 L65,80" stroke="black" strokeWidth="3" />
          <circle cx="85" cy="25" r="3" fill="white" />
          <path d="M30,25 Q35,15 45,20 Q55,25 60,20" fill="none" stroke="white" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );

  // Render Dashboard Content
  const renderDashboard = () => (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Posts</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-green-100">
        <label htmlFor="topicInput" className="block text-sm font-medium text-gray-700 mb-2">
          What would you like to post about?
        </label>
        <div className="flex gap-4">
          <textarea
            id="topicInput"
            rows={2}
            className="flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="e.g., 'Our new eco-friendly product line'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={handleGeneratePosts}
            disabled={!topic.trim() || isGenerating}
            className={`whitespace-nowrap px-6 py-3 border border-transparent font-medium rounded-lg shadow-sm text-white ${
              !topic.trim() || isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'
            } transition-colors flex items-center justify-center min-w-[120px]`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating</span>
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platformConfig.map((platform) => (
          <div key={platform.key} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className={`p-2 rounded-full ${platform.bgColor} ${platform.color} mr-3`}>
                  {platform.icon}
                </span>
                <h2 className="text-xl font-semibold text-gray-800">{platform.name}</h2>
              </div>
              <span className={`text-sm ${posts[platform.key].length > platform.charLimit * 0.9 ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
                {posts[platform.key].length} / {platform.charLimit}
              </span>
            </div>
            <textarea
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-400"
              placeholder={platform.placeholder}
              value={posts[platform.key]}
              onChange={(e) => handleInputChange(platform.key, e.target.value)}
              maxLength={platform.charLimit}
            />
            <div className="mt-4 flex justify-between items-center">
              <div>
                <button className="inline-flex items-center text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Media
                </button>
              </div>
              <div>
                <button className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors mr-2">
                  Schedule
                </button>
                <button className="text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end items-center">
         {showConfirmation && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center mr-4 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Posts submitted successfully!
          </div>
        )}
        <button
          onClick={handlePostAll}
          disabled={!canPost || isPosting}
          className={`inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white ${
            !canPost || isPosting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
          } transition-colors`}
        >
           {isPosting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </>
          ) : (
            'Post to All Platforms'
          )}
        </button>
      </div>
    </>
  );

  // Render Analytics Content
  const renderAnalytics = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {platformConfig.map((platform) => (
          <div key={platform.key} className={`p-4 rounded-lg border ${platform.bgColor}`}>
            <div className="flex items-center">
              <span className={platform.color}>{platform.icon}</span>
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">{platform.name}</h3>
                <p className="text-2xl font-bold">{Math.floor(Math.random() * 900) + 100}</p>
                <p className="text-sm text-gray-600">Engagements this week</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Engagement by Platform</h3>
          <div className="h-64 flex items-end justify-around">
            {platformConfig.map((platform, index) => {
              const height = 30 + Math.random() * 70;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-16 ${platform.bgColor} ${platform.color} rounded-t-lg relative flex items-end justify-center`} 
                    style={{height: `${height}%`}}
                  >
                    <span className="absolute -top-7 text-sm font-medium">{Math.floor(height)}%</span>
                  </div>
                  <span className={`mt-2 ${platform.color}`}>{platform.icon}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Recent Posts Performance</h3>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center p-2 border-b">
                <div className={`p-2 rounded-full ${platformConfig[i % 4].bgColor} ${platformConfig[i % 4].color} mr-3`}>
                  {platformConfig[i % 4].icon}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-800 truncate">Post about {["new products", "industry updates", "customer stories", "team highlights"][i]}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{["2 days ago", "5 days ago", "1 week ago", "2 weeks ago"][i]}</span>
                    <span className="text-green-600 font-medium">{[82, 65, 43, 28][i]}% engagement</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-100 min-h-screen font-sans">
      {/* Header with Pukeko logo */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
          <div className="flex items-center">
            <PukekoLogo />
          </div>
          <h1 className="text-3xl font-bold text-green-600 flex-grow text-center">Pukeko Social Media</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-3 py-2 font-medium rounded transition-colors ${
                activeTab === 'dashboard' 
                  ? 'text-white bg-green-500' 
                  : 'text-gray-600 hover:bg-green-100'
              }`}
            >
              <Grid className="mr-1 h-5 w-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center px-3 py-2 font-medium rounded transition-colors ${
                activeTab === 'analytics' 
                  ? 'text-white bg-green-500' 
                  : 'text-gray-600 hover:bg-green-100'
              }`}
            >
              <BarChart2 className="mr-1 h-5 w-5" />
              Analytics
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' ? renderDashboard() : renderAnalytics()}
      </main>
      
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto py-6 px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-8 w-8 mr-2">
              <PukekoLogo />
            </div>
            <p className="text-gray-500 text-sm">© 2025 Pukeko Social Media. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">Help</a>
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-green-600 text-sm">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PukekoSocialMedia;
