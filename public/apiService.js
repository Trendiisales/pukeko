// apiService.js - API service that can switch between mock and real APIs

import mockDataService from './mockDataService.js';

class ApiService {
  constructor() {
    // Check if we're in mock mode
    this.useMockData = localStorage.getItem('useMockApi') === 'true';
    // Reference to Firebase Firestore and Functions
    this.db = firebase.firestore();
    this.functions = firebase.functions();
    this.analytics = firebase.analytics();
    // Default user ID for public users
    this.publicUserId = "public-user";
  }
  
  // Toggle mock API mode
  setMockMode(enabled) {
    this.useMockData = enabled;
    localStorage.setItem('useMockApi', enabled ? 'true' : 'false');
  }
  
  isMockModeEnabled() {
    return this.useMockData;
  }
  
  // Check connectivity to Firebase
  async checkFirestoreConnection() {
    if (this.useMockData) return true;
    
    try {
      const testRef = this.db.collection('_connection_test').doc('test');
      await testRef.set({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      return true;
    } catch (error) {
      console.warn('Firestore connection failed:', error);
      // Auto-switch to mock mode when connection fails
      this.setMockMode(true);
      return false;
    }
  }
  
  // API Methods
  
  // Search for trending topics
  async searchTrendingTopics(query) {
    if (this.useMockData) {
      return mockDataService.searchTrendingTopics(query);
    }
    
    try {
      // In real implementation, call Firebase Function or direct API
      const searchFunction = this.functions.httpsCallable('searchTrendingTopics');
      const result = await searchFunction({ query });
      return result.data;
    } catch (error) {
      console.error('API Error in searchTrendingTopics:', error);
      // Fallback to mock data on error
      return mockDataService.searchTrendingTopics(query);
    }
  }
  
  // Create a new post
  async createPost(postData) {
    try {
      // Track in analytics regardless of mock mode
      this.analytics.logEvent('post_created', {
        platforms: postData.platforms.join(','),
        user_id: this.publicUserId
      });
      
      if (this.useMockData) {
        return mockDataService.createPost(postData);
      }
      
      // Real API implementation
      const docRef = await this.db.collection('users')
        .doc(this.publicUserId)
        .collection('posts')
        .add(postData);
        
      return { ...postData, id: docRef.id };
    } catch (error) {
      console.error('API Error in createPost:', error);
      // Fallback to mock on error
      return mockDataService.createPost(postData);
    }
  }
  
  // Get posts (with optional filtering)
  async getPosts(limit = 10, status = null) {
    if (this.useMockData) {
      return mockDataService.getPosts(limit, status);
    }
    
    try {
      let query = this.db.collection('users')
        .doc(this.publicUserId)
        .collection('posts')
        .orderBy('createdAt', 'desc');
        
      if (status) {
        query = query.where('status', '==', status);
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return [];
      }
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('API Error in getPosts:', error);
      // Fallback to mock data on error
      return mockDataService.getPosts(limit, status);
    }
  }
  
  // Delete a post
  async deletePost(postId) {
    if (this.useMockData) {
      return mockDataService.deletePost(postId);
    }
    
    try {
      await this.db.collection('users')
        .doc(this.publicUserId)
        .collection('posts')
        .doc(postId)
        .delete();
        
      return { success: true, id: postId };
    } catch (error) {
      console.error('API Error in deletePost:', error);
      throw error; // Don't fallback for delete - it should fail explicitly
    }
  }
  
  // Update a post
  async updatePost(postId, updates) {
    if (this.useMockData) {
      return mockDataService.updatePost(postId, updates);
    }
    
    try {
      await this.db.collection('users')
        .doc(this.publicUserId)
        .collection('posts')
        .doc(postId)
        .update(updates);
        
      // Fetch the updated document
      const docSnap = await this.db.collection('users')
        .doc(this.publicUserId)
        .collection('posts')
        .doc(postId)
        .get();
        
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('API Error in updatePost:', error);
      throw error; // Don't fallback for update - it should fail explicitly
    }
  }
  
  // Get analytics data
  async getAnalytics() {
    if (this.useMockData) {
      return mockDataService.getAnalytics();
    }
    
    try {
      // In real implementation, might call a cloud function
      const analyticsFunction = this.functions.httpsCallable('getUserAnalytics');
      const result = await analyticsFunction({ userId: this.publicUserId });
      return result.data;
    } catch (error) {
      console.error('API Error in getAnalytics:', error);
      // Fallback to mock data on error
      return mockDataService.getAnalytics();
    }
  }
  
  // Generate AI content suggestions
  async generateContentSuggestions(topic) {
    if (this.useMockData) {
      return mockDataService.generateContentSuggestions(topic);
    }
    
    try {
      // In real implementation, call a GenAI API
      const aiFunction = this.functions.httpsCallable('generateContent');
      const result = await aiFunction({ topic });
      return result.data;
    } catch (error) {
      console.error('API Error in generateContentSuggestions:', error);
      // Fallback to mock data on error
      return mockDataService.generateContentSuggestions(topic);
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;