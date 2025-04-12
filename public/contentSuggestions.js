// contentSuggestions.js - AI content suggestion feature

import apiService from './apiService.js';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const postTitle = document.getElementById('postTitle');
const postContent = document.getElementById('postContent');

// Add suggestion button to the form
function addSuggestionFeature() {
  // Create the button
  const suggestBtn = document.createElement('button');
  suggestBtn.type = 'button';
  suggestBtn.className = 'search-btn';
  suggestBtn.style.backgroundColor = '#6aa84f';
  suggestBtn.style.marginTop = '10px';
  suggestBtn.innerHTML = '<i class="fas fa-lightbulb" style="margin-right: 5px;"></i> Get Content Suggestions';
  
  // Create container for suggestions
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.id = 'suggestionsContainer';
  suggestionsContainer.style.marginTop = '15px';
  suggestionsContainer.style.display = 'none';
  
  // Add elements after the post content field
  const postContentField = document.getElementById('postContent');
  postContentField.parentNode.appendChild(suggestBtn);
  postContentField.parentNode.appendChild(suggestionsContainer);
  
  // Add event listener
  suggestBtn.addEventListener('click', generateSuggestions);
}

// Generate suggestions based on search or post title
async function generateSuggestions() {
  const suggestionsContainer = document.getElementById('suggestionsContainer');
  const topic = (postTitle.value.trim() || searchInput.value.trim());
  
  if (!topic) {
    alert('Please enter a topic in the title field or search box first.');
    return;
  }
  
  // Show loading state
  suggestionsContainer.style.display = 'block';
  suggestionsContainer.innerHTML = '<div class="loading-spinner" style="display: block;"></div>';
  
  try {
    const suggestions = await apiService.generateContentSuggestions(topic);
    
    if (!suggestions || suggestions.length === 0) {
      suggestionsContainer.innerHTML = '<p>No suggestions available for this topic. Try another topic.</p>';
      return;
    }
    
    // Display suggestions
    suggestionsContainer.innerHTML = '<h4>Content Suggestions</h4>';
    
    suggestions.forEach((suggestion, index) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.style.marginBottom = '10px';
      
      let platformIcons = '';
      suggestion.bestPlatforms.forEach(platform => {
        let icon, color;
        switch(platform.toLowerCase()) {
          case 'twitter':
            icon = 'fa-twitter';
            color = '#1da1f2';
            break;
          case 'facebook':
            icon = 'fa-facebook-f';
            color = '#3b5998';
            break;
          case 'instagram':
            icon = 'fa-instagram';
            color = '#e1306c';
            break;
          case 'linkedin':
            icon = 'fa-linkedin-in';
            color = '#0077b5';
            break;
          default:
            icon = '';
            color = '';
        }
        if (icon) {
          platformIcons += `<i class="fab ${icon}" style="margin-right: 8px; color: ${color};"></i>`;
        }
      });
      
      card.innerHTML = `
        <h3>${suggestion.title}</h3>
        <p>${suggestion.content}</p>
        <div style="margin-top: 8px;">
          <small>Best for: ${platformIcons}</small>
        </div>
        <button class="search-btn" style="margin-top: 8px;" 
                onclick="useSuggestion(${index})">Use This</button>
      `;
      
      suggestionsContainer.appendChild(card);
    });
    
    // Store suggestions in window for later use
    window.currentSuggestions = suggestions;
    
  } catch (error) {
    console.error('Error generating suggestions:', error);
    suggestionsContainer.innerHTML = '<p>Error generating suggestions. Please try again later.</p>';
  }
}

// Use a suggestion as content
window.useSuggestion = function(index) {
  const suggestion = window.currentSuggestions[index];
  if (!suggestion) return;
  
  postTitle.value = suggestion.title;
  postContent.value = suggestion.content;
  
  // Check the appropriate platform checkboxes
  document.querySelectorAll('input[name="platform"]').forEach(checkbox => {
    if (suggestion.bestPlatforms.includes(checkbox.value)) {
      checkbox.checked = true;
    }
  });
  
  // Hide suggestions
  document.getElementById('suggestionsContainer').style.display = 'none';
  
  // Smooth scroll to form
  postTitle.scrollIntoView({ behavior: 'smooth' });
};

// Initialize the suggestions feature
document.addEventListener('DOMContentLoaded', addSuggestionFeature);

// Export for use in other modules
export default {
  generateSuggestions
};