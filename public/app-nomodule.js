// Non-module version of app.js for testing
// Instead of importing apiService, we'll define a simple mock version
const apiService = {
  searchContent: async (query) => {
    console.log('Mock search for:', query);
    return [{ title: 'Mock Result', description: 'This is a mock search result' }];
  },
  createPost: async (post) => {
    console.log('Mock post creation:', post);
    return { success: true, id: 'mock-id-' + Date.now() };
  },
  getPosts: async () => {
    return [{ 
      id: 'mock-1', 
      title: 'Mock Post', 
      content: 'This is a mock post', 
      timestamp: new Date().toISOString(),
      platforms: ['twitter', 'facebook']
    }];
  },
  getAnalytics: async () => {
    return {
      totalPosts: 42,
      totalEngagement: 1337,
      avgLikes: 31,
      bestPlatform: 'Twitter'
    };
  }
};

// The rest of your app.js code, with DOM interactions
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initialized');
  
  // DOM Elements - check if they exist first
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  // Simple UI interaction
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Add a status message to the page to show it's working
  const main = document.querySelector('main');
  if (main) {
    const statusDiv = document.createElement('div');
    statusDiv.className = 'success-message';
    statusDiv.style.display = 'block';
    statusDiv.textContent = 'JavaScript loaded successfully!';
    main.prepend(statusDiv);
  }
});
