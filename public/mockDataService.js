// mockDataService.js - A comprehensive mock data provider for Pukeko Social

class MockDataService {
  constructor() {
    // Initialize with some persisted mock data
    this.posts = this.loadFromStorage('mockPosts') || this.generateInitialPosts();
    this.trendingTopics = this.generateTrendingTopics();
    this.analytics = this.generateAnalyticsData();
    
    // Save initial data to localStorage if not already there
    if (!this.loadFromStorage('mockPosts')) {
      this.saveToStorage('mockPosts', this.posts);
    }
  }
  
  // Storage helpers
  saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  loadFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  // Generate random initial posts
  generateInitialPosts() {
    return [
      {
        id: 'mock-' + Date.now() + '-1',
        title: 'Our Latest Product Launch',
        content: 'Excited to announce our newest product line hitting the shelves next week!',
        platforms: ['twitter', 'facebook', 'instagram'],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        scheduledFor: new Date(Date.now() + 86400000),
        status: 'scheduled',
        analytics: {
          views: 1245,
          likes: 89,
          shares: 32,
          comments: 14
        }
      },
      {
        id: 'mock-' + Date.now() + '-2',
        title: 'Customer Appreciation Day',
        content: 'Join us this Friday for exclusive deals and giveaways as we celebrate YOU!',
        platforms: ['facebook', 'instagram'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        scheduledFor: new Date(Date.now() - 86400000),
        status: 'published',
        analytics: {
          views: 3567,
          likes: 241,
          shares: 68,
          comments: 47
        }
      },
      {
        id: 'mock-' + Date.now() + '-3',
        title: 'Industry Insights: AI Trends 2025',
        content: 'Our latest research shows how AI is transforming business operations. Check out the full report!',
        platforms: ['linkedin', 'twitter'],
        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        scheduledFor: new Date(Date.now() - 259200000), // 3 days ago
        status: 'published',
        analytics: {
          views: 4892,
          likes: 315,
          shares: 112,
          comments: 57
        }
      }
    ];
  }
  
  // Generate trending topics
  generateTrendingTopics() {
    return {
      "AI and Machine Learning": [
        {
          title: "Advancements in Generative AI",
          description: "New generative AI models are creating more realistic content than ever before.",
          platform: "LinkedIn",
          trending_score: 94
        },
        {
          title: "AI Ethics Guidelines",
          description: "Industry leaders collaborate on new ethics framework for artificial intelligence development.",
          platform: "Twitter",
          trending_score: 87
        }
      ],
      "Remote Work": [
        {
          title: "New Work From Home Trends",
          description: "The shift to remote work is creating new challenges and opportunities for businesses.",
          platform: "Twitter",
          trending_score: 85
        },
        {
          title: "Hybrid Office Solutions",
          description: "Companies are adopting innovative approaches to balance remote and in-office work.",
          platform: "LinkedIn",
          trending_score: 82
        }
      ],
      "Sustainability": [
        {
          title: "Eco-Friendly Products Surge",
          description: "Consumer interest in sustainable products continues to rise in 2024.",
          platform: "Instagram",
          trending_score: 92
        },
        {
          title: "Corporate Carbon Neutrality",
          description: "Major corporations announce ambitious carbon neutrality goals for the coming decade.",
          platform: "Facebook",
          trending_score: 79
        }
      ],
      "Health Tech": [
        {
          title: "AI in Healthcare Advancements",
          description: "Artificial intelligence is revolutionizing patient care and medical research.",
          platform: "LinkedIn",
          trending_score: 88
        },
        {
          title: "Wearable Health Monitoring",
          description: "New wearable devices offer unprecedented health tracking capabilities.",
          platform: "Instagram",
          trending_score: 76
        }
      ]
    };
  }
  
  // Generate analytics data
  generateAnalyticsData() {
    return {
      totalPosts: this.posts.length,
      totalEngagement: this.posts.reduce((total, post) => {
        return total + post.analytics.views + post.analytics.likes + 
               post.analytics.shares + post.analytics.comments;
      }, 0),
      avgLikes: Math.floor(this.posts.reduce((total, post) => {
        return total + post.analytics.likes;
      }, 0) / Math.max(this.posts.length, 1)),
      platformPerformance: {
        twitter: Math.floor(Math.random() * 100),
        facebook: Math.floor(Math.random() * 100),
        instagram: Math.floor(Math.random() * 100),
        linkedin: Math.floor(Math.random() * 100)
      },
      timeSeriesData: this.generateTimeSeriesData()
    };
  }
  
  // Generate time series data for charts
  generateTimeSeriesData() {
    const data = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        engagement: Math.floor(Math.random() * 1000) + 200,
        likes: Math.floor(Math.random() * 200) + 50,
        shares: Math.floor(Math.random() * 50) + 10,
        comments: Math.floor(Math.random() * 40) + 5
      });
    }
    return data;
  }
  
  // API simulation methods
  
  // Search for trending topics
  searchTrendingTopics(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query) {
          resolve([]);
          return;
        }
        
        let results = [];
        
        // Search in all topic categories
        Object.keys(this.trendingTopics).forEach(category => {
          if (category.toLowerCase().includes(query.toLowerCase())) {
            // If category matches, add all its items
            results = results.concat(this.trendingTopics[category]);
          } else {
            // Otherwise check individual topics
            const matchingTopics = this.trendingTopics[category].filter(topic => 
              topic.title.toLowerCase().includes(query.toLowerCase()) || 
              topic.description.toLowerCase().includes(query.toLowerCase())
            );
            results = results.concat(matchingTopics);
          }
        });
        
        resolve(results);
      }, 500); // Simulate network delay
    });
  }
  
  // Create a new post
  createPost(postData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost = {
          id: 'mock-' + Date.now(),
          ...postData,
          analytics: {
            views: 0,
            likes: 0,
            shares: 0,
            comments: 0
          }
        };
        
        this.posts.unshift(newPost);
        this.saveToStorage('mockPosts', this.posts);
        this.analytics = this.generateAnalyticsData(); // Update analytics
        
        resolve(newPost);
      }, 800); // Simulate network delay
    });
  }
  
  // Get all posts (with optional filtering)
  getPosts(limit = 10, status = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredPosts = [...this.posts];
        
        if (status) {
          filteredPosts = filteredPosts.filter(post => post.status === status);
        }
        
        // Sort by created date (newest first)
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Apply limit
        if (limit && limit > 0) {
          filteredPosts = filteredPosts.slice(0, limit);
        }
        
        resolve(filteredPosts);
      }, 600); // Simulate network delay
    });
  }
  
  // Delete a post
  deletePost(postId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = this.posts.length;
        this.posts = this.posts.filter(post => post.id !== postId);
        
        if (this.posts.length === initialLength) {
          reject(new Error(`Post with ID ${postId} not found`));
        } else {
          this.saveToStorage('mockPosts', this.posts);
          this.analytics = this.generateAnalyticsData(); // Update analytics
          resolve({ success: true, id: postId });
        }
      }, 700); // Simulate network delay
    });
  }
  
  // Update a post
  updatePost(postId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = this.posts.findIndex(post => post.id === postId);
        
        if (postIndex === -1) {
          reject(new Error(`Post with ID ${postId} not found`));
        } else {
          // Update the post
          this.posts[postIndex] = {
            ...this.posts[postIndex],
            ...updates
          };
          
          this.saveToStorage('mockPosts', this.posts);
          resolve(this.posts[postIndex]);
        }
      }, 800); // Simulate network delay
    });
  }
  
  // Get analytics data
  getAnalytics() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Refresh analytics data
        this.analytics = this.generateAnalyticsData();
        resolve(this.analytics);
      }, 900); // Simulate network delay
    });
  }
  
  // Generate content suggestions (simulated AI response)
  generateContentSuggestions(topic) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = [
          {
            title: `5 Ways to Leverage ${topic} in Your Business`,
            content: `Discover how ${topic} is transforming industries and how your business can stay ahead of the curve.`,
            bestPlatforms: ['linkedin', 'twitter']
          },
          {
            title: `The Future of ${topic}: 2025 Predictions`,
            content: `Our experts analyze current trends and predict how ${topic} will evolve in the coming year.`,
            bestPlatforms: ['facebook', 'linkedin']
          },
          {
            title: `Quick Guide: Getting Started with ${topic}`,
            content: `New to ${topic}? Here's everything you need to know to get started and implement it in your workflow.`,
            bestPlatforms: ['instagram', 'twitter']
          }
        ];
        
        resolve(suggestions);
      }, 1200); // Simulate network delay for AI processing
    });
  }
  
  // Toggle API testing mode
  static isEnabled() {
    return localStorage.getItem('useMockApi') === 'true';
  }
  
  static enable() {
    localStorage.setItem('useMockApi', 'true');
  }
  
  static disable() {
    localStorage.setItem('useMockApi', 'false');
  }
}

// Create and export an instance
const mockDataService = new MockDataService();
export default mockDataService;