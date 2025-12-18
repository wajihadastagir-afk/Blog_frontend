import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import ReactMarkdown from 'react-markdown';

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { posts, searchPosts, fetchPosts } = useBlog();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          await searchPosts(searchQuery);
        } else {
          await fetchPosts();
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [searchQuery, searchPosts, fetchPosts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/[#*`]/g, '').replace(/\n/g, ' ');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {searchQuery ? `Search Results for "${searchQuery}"` : 'WELLCOME TO THE BLOG APP'}
      </Typography>

      {posts.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
          {searchQuery ? 'No posts found matching your search.' : 'No posts available yet.'}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#f3e8ff',
                  // light purple background
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {post.title}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={post.author.name}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    <ReactMarkdown>{getExcerpt(post.content)}</ReactMarkdown>
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    onClick={() => user ? navigate(`/post/${post.id}`) : navigate('/login')}
                    variant={user ? "contained" : "outlined"}
                    color={user ? "primary" : "warning"}
                  >
                    {user ? "Read More" : "Read more"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
