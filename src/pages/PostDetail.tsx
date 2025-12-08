import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import ReactMarkdown from 'react-markdown';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { getPost, addComment, deleteComment } = useBlog();
  const navigate = useNavigate();
  const [shouldLogin, setShouldLogin] = useState(false);

  useEffect(() => {
    if (!user) {
      setShouldLogin(true);
      setLoading(false);
      return;
    }
    setShouldLogin(false);
    const loadPost = async () => {
      if (!id) return;
      try {
        const postData = await getPost(id);
        setPost(postData);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, getPost, user]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !id) return;

    setCommenting(true);
    try {
      await addComment(id, comment);
      setComment('');
      // Reload post to get updated comments
      const updatedPost = await getPost(id);
      setPost(updatedPost);
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    
    try {
      await deleteComment(id, commentId);
      // Reload post to get updated comments
      const updatedPost = await getPost(id);
      setPost(updatedPost);
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAuthor = user && post && user.id === post.author.id;

  if (shouldLogin) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Alert severity="warning" sx={{ mb: 2, width: '100%' }}>
            You must be logged in to view the full content of this blog post.
          </Alert>
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
            Login to read full post
          </Button>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Post not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {post.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Chip
                label={post.author.name}
                avatar={<Avatar>{post.author.name.charAt(0).toUpperCase()}</Avatar>}
                color="primary"
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Box>
          
          {isAuthor && (
            <Box>
              <IconButton
                onClick={() => navigate(`/edit-post/${post.id}`)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 4 }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h5" gutterBottom>
          Comments ({post.comments?.length || 0})
        </Typography>

        {user ? (
          <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={commenting || !comment.trim()}
              startIcon={<SendIcon />}
            >
              {commenting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        ) : (
          <Box mb={3}>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
            >
              Login to comment
            </Button>
          </Box>
        )}

        {post.comments?.map((comment: any) => (
          <Paper key={comment.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {comment.author.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatDate(comment.createdAt)}
                </Typography>
                <Typography variant="body1">
                  {comment.content}
                </Typography>
              </Box>
              
              {(user?.id === comment.author.id || isAuthor) && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Paper>
        ))}

        {(!post.comments || post.comments.length === 0) && (
          <Typography variant="body2" color="text.secondary" align="center">
            No comments yet. Be the first to comment!
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default PostDetail;
