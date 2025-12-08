import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          <Route
            path="/create-post"
            element={
              <AdminRoute>
                <CreatePost />
              </AdminRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <AdminRoute>
                <EditPost />
              </AdminRoute>
            }
          />
          </Routes>
        </div>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
