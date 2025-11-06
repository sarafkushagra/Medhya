import { useState, useEffect } from 'react';

import { API_BASE_URL } from '../config/environment.js';

export const useCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);

  // Get community posts
  const getCommunityPosts = async (options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.category) params.append('category', options.category);
      if (options.search) params.append('search', options.search);
      if (options.institutionId) params.append('institutionId', options.institutionId);
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }

      setPosts(data.data.posts);
      setPagination(data.data.pagination);
      setTrendingTopics(data.data.trendingTopics);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single post
  const getCommunityPost = async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch post');
      }

      return data.data.post;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createCommunityPost = async (postData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      // Add the new post to the current list
      setPosts(prev => [data.data.post, ...prev]);
      return data.data.post;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a post
  const updateCommunityPost = async (postId, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/${postId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      // Update the post in the current list
      setPosts(prev => prev.map(post => 
        post._id === postId ? data.data.post : post
      ));
      return data.data.post;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a post
  const deleteCommunityPost = async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }

      // Remove the post from the current list
      setPosts(prev => prev.filter(post => post._id !== postId));
      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a comment
  const addComment = async (postId, commentData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }

      // Update the post with the new comment
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, data.data.comment]
          };
        }
        return post;
      }));

      return data.data.comment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a comment
  const updateComment = async (postId, commentId, content) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update comment');
      }

      // Update the comment in the post
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment =>
              comment._id === commentId ? data.data.comment : comment
            )
          };
        }
        return post;
      }));

      return data.data.comment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const deleteComment = async (postId, commentId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete comment');
      }

      // Remove the comment from the post
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.filter(comment => comment._id !== commentId)
          };
        }
        return post;
      }));

      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle post like
  const togglePostLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle like');
      }

      // Update the post's like status
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: data.data.liked 
              ? [...post.likes, localStorage.getItem('userId')] // Add current user
              : post.likes.filter(id => id !== localStorage.getItem('userId')) // Remove current user
          };
        }
        return post;
      }));

      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Toggle comment like
  const toggleCommentLike = async (postId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/community/${postId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle comment like');
      }

      // Update the comment's like status
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  likes: data.data.liked 
                    ? [...comment.likes, localStorage.getItem('userId')]
                    : comment.likes.filter(id => id !== localStorage.getItem('userId'))
                };
              }
              return comment;
            })
          };
        }
        return post;
      }));

      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Flag content
  const flagContent = async (postId, commentId = null, reason) => {
    try {
      const token = localStorage.getItem('token');
      const url = commentId 
        ? `${API_BASE_URL}/community/${postId}/comments/${commentId}/flag`
        : `${API_BASE_URL}/community/${postId}/flag`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to flag content');
      }

      return data.message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get community statistics
  const getCommunityStats = async (institutionId = null) => {
    try {
      const token = localStorage.getItem('token');
      const params = institutionId ? `?institutionId=${institutionId}` : '';
      
      const response = await fetch(`${API_BASE_URL}/community/stats${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch community stats');
      }

      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    pagination,
    trendingTopics,
    getCommunityPosts,
    getCommunityPost,
    createCommunityPost,
    updateCommunityPost,
    deleteCommunityPost,
    addComment,
    updateComment,
    deleteComment,
    togglePostLike,
    toggleCommentLike,
    flagContent,
    getCommunityStats
  };
};
