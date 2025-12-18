import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface BlogContextType {
  posts: BlogPost[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (title: string, content: string) => Promise<void>;
  updatePost: (id: string, title: string, content: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPost: (id: string) => Promise<BlogPost>;
  searchPosts: (query: string) => Promise<BlogPost[]>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      throw new Error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async (title: string, content: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, {
        title,
        content
      }, {
        headers: getAuthHeaders()
      });
      
      setPosts(prev => [response.data, ...prev]);
    } catch (error) {
      throw new Error('Failed to create post');
    }
  };

  const updatePost = async (id: string, title: string, content: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/posts/${id}`, {
        title,
        content
      }, {
        headers: getAuthHeaders()
      });
      
      setPosts(prev => prev.map(post => 
        post.id === id ? response.data : post
      ));
    } catch (error) {
      throw new Error('Failed to update post');
    }
  };

  const deletePost = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${id}`, {
        headers: getAuthHeaders()
      });
      
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      throw new Error('Failed to delete post');
    }
  };

  const getPost = async (id: string): Promise<BlogPost> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch post');
    }
  };

  const searchPosts = useCallback(async (query: string): Promise<BlogPost[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts?q=${query}`);
      setPosts(response.data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to search posts');
    }
  }, []);

  const addComment = async (postId: string, content: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${postId}/comments`, {
        content
      }, {
        headers: getAuthHeaders()
      });
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), response.data] }
          : post
      ));
    } catch (error) {
      throw new Error('Failed to add comment');
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
        headers: getAuthHeaders()
      });
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: post.comments?.filter(comment => comment.id !== commentId) 
            }
          : post
      ));
    } catch (error) {
      throw new Error('Failed to delete comment');
    }
  };

  const value = {
    posts,
    loading,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    getPost,
    searchPosts,
    addComment,
    deleteComment
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};
