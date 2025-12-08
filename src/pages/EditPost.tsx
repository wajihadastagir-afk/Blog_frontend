import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { getPost, updatePost } = useBlog();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        const post = await getPost(id);
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, getPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!id) return;

    setSaving(true);
    setError('');

    try {
      await updatePost(id, title, content);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Post
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
              disabled={saving}
              size="large"
            >
              {saving ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Saving...
                </>
              ) : (
                'Update Post'
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

export default EditPost;
