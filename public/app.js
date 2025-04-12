// app.js - Main application logic for Pukeko Social Dashboard

import apiService from './apiService.js';

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const postTitle = document.getElementById('postTitle');
const postContent = document.getElementById('postContent');
const postDateTime = document.getElementById('postDateTime');
const submitPostBtn = document.getElementById('submitPostBtn');
const platformCheckboxes = document.querySelectorAll('input[name="platform"]');
const postHistoryList = document.getElementById('postHistoryList');
const totalPostsEl = document.getElementById('totalPosts');
const totalEngagementEl = document.getElementById('totalEngagement');
const avgLikesEl = document.getElementById('avgLikes');
const bestPlatformEl = document.getElementById('bestPlatform');
const engagementChart = document.getElementById('engagementChart');

// Mock Mode Toggle (add this to your UI somewhere)
const mockModeToggle = document.createElement('div');
mockModeToggle.className = 'settings-card';
mockModeToggle.innerHTML = `
  <h3>Testing Mode</h3>
  <div>
    <p>Use Mock API Data</p>
    <label class="toggle-switch">
      <input type="checkbox" id="mockApiToggle" ${localStorage.getItem('useMockApi') === 'true' ? 'checked' : ''}>
      <span class="slider"></span>
    </label>
  </div>
  <p style="margin-top: 10px; font-size: 0.8rem; color: #666;">
    Use mock data for testing without real API calls
  </p>
`;

// Add the mock mode toggle to settings
const settingsGrid = document.querySelector('.settings-grid');
settingsGrid.appendChild(mockModeToggle);

// Add event listener for the mock API toggle
document.getElementById('mockApiToggle').addEventListener('change', function(e) {
  apiService.setMockMode(e.target.checked);
  // Refresh data
  loadPostHistory();
  loadAnalytics();
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Navigation active state
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(link => link.classList.remove('active'));
    item.classList.add('active');
    navLinks.classList.remove('active');
  });
});

// Search functionality
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
}

// Initialize the app
async function initializeApp() {
  try {
    // Check if we can connect to Firebase or should use mock data
    await apiService.checkFirestoreConnection();
    
    // Set the initial scheduled time to now plus 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1); // Add 1 hour
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
    postDateTime.value = localISOTime;
    
    // Set example search terms
    searchInput.placeholder = "Try: AI trends, remote work, sustainability...";
    
    // Load initial data
    loadPostHistory();
    loadAnalytics();
    
    // Set up the submit event handler
    submitPostBtn.addEventListener('click', submitPost);
    
    // Display mode indicator
    const modeIndicator = document.createElement('div');
    modeIndicator.style.position = 'fixed';
    modeIndicator.style.bottom = '10px';
    modeIndicator.style.right = '10px';
    modeIndicator.style.padding = '5px 10px';
    modeIndicator.style.backgroundColor = apiService.isMockModeEnabled() ? '#6aa84f' : '#1da1f2';
    modeIndicator.style.color = 'white';
    modeIndicator.style.borderRadius = '5px';
    modeIndicator.style.fontSize = '0.8rem';
    modeIndicator.style.zIndex = '1000';
    modeIndicator.textContent = apiService.isMockModeEnabled() ? 'Mock API Mode' : 'Real API Mode';
    document.body.appendChild(modeIndicator);
    
    // Update indicator when mode changes
    document.getElementById('mockApiToggle').addEventListener('change', function(e) {
      modeIndicator.style.backgroundColor = e.target.checked ? '#6aa84f' : '#1da1f2';
      modeIndicator.textContent = e.target.checked ? 'Mock API Mode' : 'Real API Mode';
    });
    
  } catch (error) {
    console.error('Error initializing app:', error);
    
    // Show error notification
    const errorNotice = document.createElement('div');
    errorNotice.style.position = 'fixed';
    errorNotice.style.top = '70px';
    errorNotice.style.left = '50%';
    errorNotice.style.transform = 'translateX(-50%)';
    errorNotice.style.padding = '10px 20px';
    errorNotice.style.backgroundColor = '#e74c3c';
    errorNotice.style.color = 'white';
    errorNotice.style.borderRadius = '5px';
    errorNotice.style.zIndex = '1000';
    errorNotice.textContent = 'Error initializing app. Using mock data mode.';
    document.body.appendChild(errorNotice);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorNotice.style.display = 'none';
    }, 5000);
    
    // Force mock mode and try again
    apiService.setMockMode(true);
    document.getElementById('mockApiToggle').checked = true;
    
    // Set the initial scheduled time
    const now = new Date();
    now.setHours(now.getHours() + 1); // Add 1 hour
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
    postDateTime.value = localISOTime;
    
    // Load data anyway
    loadPostHistory();
    loadAnalytics();
  }
}

// Initialize when document is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
});

async function performSearch() {
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) return;
  
  loadingSpinner.style.display = 'block';
  resultsContainer.innerHTML = '';
  errorMessage.style.display = 'none';
  
  try {
    const results = await apiService.searchTrendingTopics(searchTerm);
    loadingSpinner.style.display = 'none';
    
    if (!results || results.length === 0) {
      errorMessage.textContent = 'No results found. Try another search term.';
      errorMessage.style.display = 'block';
      return;
    }
    
    displaySearchResults(results);
  } catch (error) {
    console.error('Search error:', error);
    loadingSpinner.style.display = 'none';
    errorMessage.textContent = 'Error performing search. Please try again.';
    errorMessage.style.display = 'block';
  }
}

function displaySearchResults(results) {
  results.forEach(result => {
    const resultCard = document.createElement('div');
    resultCard.className = 'result-card';
    
    let platformIcon = '';
    let platformColor = '';
    switch(result.platform.toLowerCase()) {
      case 'twitter':
        platformIcon = 'fa-twitter';
        platformColor = '#1da1f2';
        break;
      case 'facebook':
        platformIcon = 'fa-facebook-f';
        platformColor = '#3b5998';
        break;
      case 'instagram':
        platformIcon = 'fa-instagram';
        platformColor = '#e1306c';
        break;
      case 'linkedin':
        platformIcon = 'fa-linkedin-in';
        platformColor = '#0077b5';
        break;
      default:
        platformIcon = '';
    }
    
    const platformHtml = platformIcon ? 
      `<i class="fab ${platformIcon}" style="margin-right: 4px; color: ${platformColor};"></i> ${result.platform}` : 
      result.platform;
    
    resultCard.innerHTML = `
      <h3>${result.title}</h3>
      <p>${result.description}</p>
      <div class="result-stats">
        <span>${platformHtml}</span>
        <span><i class="fas fa-fire"></i> ${result.trending_score}</span>
      </div>
      <button class="search-btn" onclick="useThisContent('${encodeURIComponent(result.title)}', '${encodeURIComponent(result.description)}')">Use This</button>
    `;
    
    resultsContainer.appendChild(resultCard);
  });
}

// Use search result as content
window.useThisContent = function(title, description) {
  postTitle.value = decodeURIComponent(title);
  postContent.value = decodeURIComponent(description);
  
  // Scroll to post form
  postTitle.scrollIntoView({ behavior: 'smooth' });
};

// Submit post functionality
submitPostBtn.addEventListener('click', submitPost);

async function submitPost() {
  const title = postTitle.value.trim();
  const content = postContent.value.trim();
  const scheduledTime = postDateTime.value ? new Date(postDateTime.value) : new Date();
  
  if (!title || !content) {
    errorMessage.textContent = 'Please enter both title and content for your post.';
    errorMessage.style.display = 'block';
    return;
  }
  
  const selectedPlatforms = [];
  platformCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedPlatforms.push(checkbox.value);
    }
  });
  
  if (selectedPlatforms.length === 0) {
    errorMessage.textContent = 'Please select at least one platform.';
    errorMessage.style.display = 'block';
    return;
  }
  
  loadingSpinner.style.display = 'block';
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
  
  // Prepare post data
  const postData = {
    title: title,
    content: content,
    platforms: selectedPlatforms,
    scheduledFor: apiService.isMockModeEnabled() 
      ? scheduledTime.toISOString() 
      : firebase.firestore.Timestamp.fromDate(scheduledTime),
    createdAt: apiService.isMockModeEnabled() 
      ? new Date().toISOString() 
      : firebase.firestore.FieldValue.serverTimestamp(),
    analytics: {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0
    },
    status: 'scheduled'
  };
  
  try {
    await apiService.createPost(postData);
    
    loadingSpinner.style.display = 'none';
    successMessage.textContent = 'Post created successfully!';
    successMessage.style.display = 'block';
    
    postTitle.value = '';
    postContent.value = '';
    platformCheckboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    
    loadPostHistory();
    loadAnalytics();
    
    successMessage.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error creating post:', error);
    loadingSpinner.style.display = 'none';
    errorMessage.textContent = 'Error creating post: ' + error.message;
    errorMessage.style.display = 'block';
  }
}

// Load post history
async function loadPostHistory() {
  postHistoryList.innerHTML = '';
  
  const loadingItem = document.createElement('li');
  loadingItem.textContent = 'Loading post history...';
  postHistoryList.appendChild(loadingItem);
  
  try {
    const posts = await apiService.getPosts(10);
    
    postHistoryList.innerHTML = '';
    
    if (posts.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = 'No posts yet. Create your first post above!';
      postHistoryList.appendChild(emptyItem);
      return;
    }
    
    posts.forEach(post => {
      createPostHistoryItem(post.id, post);
    });
  } catch (error) {
    console.error('Error loading posts:', error);
    postHistoryList.innerHTML = '<li>Error loading post history. Please try again.</li>';
  }
}

// Create post history item
function createPostHistoryItem(id, post) {
  const postItem = document.createElement('li');
  postItem.className = 'post-item';
  
  const createdDate = post.createdAt ? 
    new Date(typeof post.createdAt === 'string' ? post.createdAt : post.createdAt.toDate()).toLocaleDateString() 
    : 'Just now';
  const platformsText = Array.isArray(post.platforms) ? post.platforms.join(', ') : 'Multiple platforms';
  
  postItem.innerHTML = `
    <div class="post-content">
      <h3>${post.title}</h3>
      <div class="post-meta">
        <span>${createdDate}</span> • 
        <span>${platformsText}</span> • 
        <span>${post.status}</span>
      </div>
    </div>
    <div class="post-actions">
      <button onclick="editPost('${id}')"><i class="fas fa-edit"></i></button>
      <button onclick="deletePost('${id}')"><i class="fas fa-trash"></i></button>
    </div>
  `;
  
  postHistoryList.appendChild(postItem);
}

// Edit post functionality
// Delete post functionality 
window.deletePost = async function(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  
  try {
    await apiService.deletePost(id);
    
    // Refresh post history
    loadPostHistory();
    loadAnalytics();
    
    // Show success message
    successMessage.textContent = 'Post deleted successfully!';
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Error deleting post. Please try again.');
  }
};

// Edit post functionality
window.editPost = async function(id) {
  // Find the post in history
  try {
    const posts = await apiService.getPosts(20);
    const post = posts.find(p => p.id === id);
    
    if (!post) {
      alert('Post not found. It may have been deleted.');
      return;
    }
    
    // Fill the form with post data
    postTitle.value = post.title;
    postContent.value = post.content;
    
    // Update platform checkboxes
    platformCheckboxes.forEach(checkbox => {
      checkbox.checked = post.platforms.includes(checkbox.value);
    });
    
    // Set the scheduled time if available
    if (post.scheduledFor) {
      const scheduledDate = new Date(
        typeof post.scheduledFor === 'string' ? post.scheduledFor : post.scheduledFor.toDate()
      );
      
      // Format for datetime-local input
      const localISOTime = scheduledDate.toISOString().slice(0, 16);
      postDateTime.value = localISOTime;
    }
    
    // Change submit button to update mode
    submitPostBtn.textContent = 'Update Post';
    submitPostBtn.setAttribute('data-edit-id', id);
    
    // Show a message that we're editing
    successMessage.textContent = 'Editing post. Make your changes and click "Update Post".';
    successMessage.style.display = 'block';
    
    // Scroll to form
    postTitle.scrollIntoView({ behavior: 'smooth' });
    
    // Change submit button behavior
    submitPostBtn.removeEventListener('click', submitPost);
    submitPostBtn.addEventListener('click', updatePost);
  } catch (error) {
    console.error('Error fetching post for edit:', error);
    alert('Error loading post data. Please try again.');
  }
};

// Update post handler
// Load analytics data
async function loadAnalytics() {
  try {
    const analyticsData = await apiService.getAnalytics();
    
    // Update statistics
    totalPostsEl.textContent = analyticsData.totalPosts || 0;
    totalEngagementEl.textContent = analyticsData.totalEngagement || 0;
    avgLikesEl.textContent = analyticsData.avgLikes || 0;
    
    // Find best performing platform
    if (analyticsData.platformPerformance) {
      const platforms = Object.keys(analyticsData.platformPerformance);
      if (platforms.length > 0) {
        let bestPlatform = platforms[0];
        
        platforms.forEach(platform => {
          if (analyticsData.platformPerformance[platform] > analyticsData.platformPerformance[bestPlatform]) {
            bestPlatform = platform;
          }
        });
        
        // Capitalize first letter
        bestPlatformEl.textContent = bestPlatform.charAt(0).toUpperCase() + bestPlatform.slice(1);
      } else {
        bestPlatformEl.textContent = '-';
      }
    } else {
      bestPlatformEl.textContent = '-';
    }
    
    // Render chart if time series data available
    if (analyticsData.timeSeriesData && analyticsData.timeSeriesData.length > 0) {
      renderEngagementChart(analyticsData.timeSeriesData);
    } else {
      renderMockChart();
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
    // Just render mock chart on error
    renderMockChart();
  }
}

// Render engagement chart with time series data
function renderEngagementChart(timeSeriesData) {
  // For a real implementation, you'd use Chart.js or a similar library
  // For now, we'll just show a mock chart image
  renderMockChart();
  
  // When ready to implement real charts:
  /*
  import Chart from 'chart.js';
  
  const ctx = document.createElement('canvas');
  ctx.width = engagementChart.clientWidth;
  ctx.height = engagementChart.clientHeight;
  engagementChart.innerHTML = '';
  engagementChart.appendChild(ctx);
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeSeriesData.map(item => item.date),
      datasets: [
        {
          label: 'Engagement',
          data: timeSeriesData.map(item => item.engagement),
          borderColor: '#1da1f2',
          backgroundColor: 'rgba(29, 161, 242, 0.1)',
          tension: 0.3
        },
        {
          label: 'Likes',
          data: timeSeriesData.map(item => item.likes),
          borderColor: '#e1306c',
          backgroundColor: 'rgba(225, 48, 108, 0.1)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  */
}

// Render mock chart (placeholder)
function renderMockChart() {
  engagementChart.innerHTML = `
    <div style="position: relative; width: 100%; height: 100%;">
      <img src="https://firebasestorage.googleapis.com/v0/b/pukeko-social.appspot.com/o/mock-chart.png?alt=media" 
           alt="Engagement Chart" style="width: 100%; height: 100%; object-fit: contain;">
    </div>
  `;
}

async function updatePost() {
  const id = submitPostBtn.getAttribute('data-edit-id');
  
  if (!id) {
    alert('Error: Post ID missing');
    return;
  }
  
  const title = postTitle.value.trim();
  const content = postContent.value.trim();
  const scheduledTime = postDateTime.value ? new Date(postDateTime.value) : new Date();
  
  if (!title || !content) {
    errorMessage.textContent = 'Please enter both title and content for your post.';
    errorMessage.style.display = 'block';
    return;
  }
  
  const selectedPlatforms = [];
  platformCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedPlatforms.push(checkbox.value);
    }
  });
  
  if (selectedPlatforms.length === 0) {
    errorMessage.textContent = 'Please select at least one platform.';
    errorMessage.style.display = 'block';
    return;
  }
  
  loadingSpinner.style.display = 'block';
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
  
  // Prepare update data
  const updateData = {
    title: title,
    content: content,
    platforms: selectedPlatforms,
    scheduledFor: apiService.isMockModeEnabled() 
      ? scheduledTime.toISOString() 
      : firebase.firestore.Timestamp.fromDate(scheduledTime),
    status: 'scheduled' // Reset status since it was edited
  };
  
  try {
    await apiService.updatePost(id, updateData);
    
    loadingSpinner.style.display = 'none';
    successMessage.textContent = 'Post updated successfully!';
    successMessage.style.display = 'block';
    
    // Reset form
    postTitle.value = '';
    postContent.value = '';
    platformCheckboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    
    // Reset button to normal mode
    submitPostBtn.textContent = 'Submit Post';
    submitPostBtn.removeAttribute('data-edit-id');
    
    // Reset event listeners
    submitPostBtn.removeEventListener('click', updatePost);
    submitPostBtn.addEventListener('click', submitPost);
    
    loadPostHistory();
    loadAnalytics();
    
    successMessage.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Error updating post:', error);
    loadingSpinner.style.display = 'none';
    errorMessage.textContent = 'Error updating post: ' + error.message;
    errorMessage.style.display = 'block';
  }
}