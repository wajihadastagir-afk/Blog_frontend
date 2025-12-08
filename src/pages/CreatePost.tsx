import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createPost } = useBlog();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createPost(title, content);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Post Title"
            variant="outlined"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            label="Content (Markdown supported)"
            variant="outlined"
            margin="normal"
            multiline
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            helperText="You can use Markdown formatting for rich text"
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Publishing...
                </>
              ) : (
                'Publish Post'
              )}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              size="large"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;
