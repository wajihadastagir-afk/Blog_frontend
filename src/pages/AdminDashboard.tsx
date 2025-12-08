import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';

interface AdminPost {
  id: string;
  title: string;
  content: string;
  author: { id: string; name: string; email: string };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<AdminPost[]>([]);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAllPosts = async () => {
    const { data } = await axios.get(`${API_BASE_URL}/admin/posts`, { headers: authHeaders() });
    setPosts(data);
  };

  const deletePost = async (id: string) => {
    await axios.delete(`${API_BASE_URL}/admin/posts/${id}`, { headers: authHeaders() });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Admin Dashboard</Typography>
      <Typography variant="subtitle1" mb={2}>Manage all posts</Typography>
      <Stack spacing={2}>
        {posts.map(post => (
          <Paper key={post.id} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  by {post.author.name} ({post.author.email})
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {/* Optional: add edit support if needed */}
                <Button color="error" variant="outlined" onClick={() => deletePost(post.id)}>Delete</Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default AdminDashboard;


