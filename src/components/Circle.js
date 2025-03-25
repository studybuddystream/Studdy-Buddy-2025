import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Ensure this is set up in your app

const Circle = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', media: null, category: 'General' });
  const [selectedCategory, setSelectedCategory] = useState('Home');
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [communities, setCommunities] = useState([]);
  const [newCommunity, setNewCommunity] = useState('');
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', content: '', media: null });
  const [error, setError] = useState('');

  // Initialize followedCommunities with user.following or fallback
  const [followedCommunities, setFollowedCommunities] = useState(user?.following || ['General']);

  // Set up axios defaults with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }

    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          alert('Your session has expired. Please log in again.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }, [token]);

  // Update followed communities when user changes
  useEffect(() => {
    if (user?.following) {
      setFollowedCommunities(user.following);
    }
  }, [user]);

  // Check authentication
  const isAuthenticated = () => !!token && !!user;

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      if (!isAuthenticated()) {
        console.warn('No valid authentication detected.');
        setLoading(false);
        return;
      }

      try {
        const [postsRes, trendingRes, communitiesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/posts'),
          axios.get('http://localhost:5000/api/posts/trending'),
          axios.get('http://localhost:5000/api/communities'),
        ]);
        setPosts(postsRes.data);
        setTrendingPosts(trendingRes.data);
        setCommunities(communitiesRes.data);
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load data. Please try again later.');
        setPosts([]);
        setTrendingPosts([]);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      alert('You must be logged in to post.');
      return;
    }
    if (!followedCommunities.includes(newPost.category) && 
        !communities.find(c => c.name === newPost.category && c.creator === user?.username)) {
      alert('You can only post in your own or followed communities.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    formData.append('category', newPost.category);
    if (newPost.media) {
      console.log('Uploading media:', newPost.media);
      formData.append('media', newPost.media);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/posts', formData);
      console.log('Post response:', res.data);
      setPosts([res.data, ...posts]);
      setNewPost({ title: '', content: '', media: null, category: 'General' });
    } catch (err) {
      console.error('Post error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle community creation
  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      alert('You must be logged in to create a community.');
      return;
    }
    if (!newCommunity) {
      alert('Community name cannot be empty.');
      return;
    }
    if (communities.some(c => c.name === newCommunity)) {
      alert('A community with this name already exists.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/communities', { name: newCommunity });
      setCommunities([...communities, res.data]);
      setFollowedCommunities([...followedCommunities, newCommunity]);
      setNewCommunity('');
      setShowCreateCommunity(false);
    } catch (err) {
      console.error('Community creation error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle following a community
  const handleToggleCommunity = async (community) => {
    if (!isAuthenticated()) {
      alert('You must be logged in to join or leave communities.');
      return;
    }
    setError('');
    console.log('Toggling community:', community, 'User:', user, 'Token:', token);
    try {
      const res = await axios.put('http://localhost:5000/api/user/follow', { community });
      console.log('Toggle response:', res.data);
      setFollowedCommunities(res.data.following);
      if (setUser) {
        setUser({ ...user, following: res.data.following });
      } else {
        console.warn('setUser is not available; user state not updated in context');
      }
    } catch (err) {
      console.error('Toggle community error:', err.response?.status, err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update community subscription. Please try again.');
    }
  };

  // Delete a community
  const handleDeleteCommunity = async (communityName) => {
    const community = communities.find(c => c.name === communityName);
    if (!community || community.creator !== user?.username) {
      alert('You can only delete communities you created.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${communityName}"? This will delete all posts.`)) {
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/communities/${communityName}`);
        setCommunities(communities.filter(c => c.name !== communityName));
        setFollowedCommunities(followedCommunities.filter(c => c !== communityName));
        setPosts(posts.filter(p => p.category !== communityName));
        if (selectedCategory === communityName) setSelectedCategory('Home');
      } catch (err) {
        console.error('Delete community error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to delete community. Please try again.');
      }
    }
  };

  // Delete a post
  const handleDeletePost = async (postId) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;
    const canDelete = post.user._id === user?._id || 
                      communities.find(c => c.name === post.category)?.creator === user?.username;
    if (!canDelete) {
      alert('You can only delete your own posts or posts in communities you created.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      setError('');
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`);
        setPosts(posts.filter(p => p._id !== postId));
      } catch (err) {
        console.error('Delete post error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to delete post. Please try again.');
      }
    }
  };

  // Handle upvote
  const handleUpvote = async (postId) => {
    if (!isAuthenticated()) {
      alert('You must be logged in to vote.');
      return;
    }
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}/upvote`);
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Upvote error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to upvote post. Please try again.');
    }
  };

  // Handle downvote
  const handleDownvote = async (postId) => {
    if (!isAuthenticated()) {
      alert('You must be logged in to vote.');
      return;
    }
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}/downvote`);
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Downvote error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to downvote post. Please try again.');
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId, commentText) => {
    if (!isAuthenticated()) {
      alert('You must be logged in to comment.');
      return;
    }
    if (!commentText.trim()) return;
    setError('');
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, { text: commentText });
      setPosts(posts.map(post => post._id === postId ? res.data : post));
    } catch (err) {
      console.error('Comment error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add comment. Please try again.');
    }
  };

  // Handle editing a post
  const handleEditPost = (postId) => {
    const postToEdit = posts.find(post => post._id === postId);
    if (!postToEdit || postToEdit.user._id !== user?._id) {
      alert('You can only edit your own posts.');
      return;
    }
    setEditingPostId(postId);
    setEditFormData({ title: postToEdit.title, content: postToEdit.content, media: null });
  };

  // Handle saving edited post
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('title', editFormData.title);
    formData.append('content', editFormData.content);
    if (editFormData.media) {
      console.log('Uploading edited media:', editFormData.media);
      formData.append('media', editFormData.media);
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${editingPostId}`, formData);
      setPosts(posts.map(post => post._id === editingPostId ? res.data : post));
      setEditingPostId(null);
      setEditFormData({ title: '', content: '', media: null });
    } catch (err) {
      console.error('Edit post error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    }
  };

  // Handle reporting a post
  const handleReportPost = async (postId) => {
    if (!isAuthenticated()) {
      alert('You must be logged in to report a post.');
      return;
    }
    setError('');
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/report`);
      alert(`Post ${postId} has been reported. Our moderators will review it.`);
    } catch (err) {
      console.error('Report post error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to report post. Please try again.');
    }
  };

  // Filter posts with unique _id for homeFeedPosts
  const homeFeedPosts = Array.from(
    new Map(
      [...trendingPosts, ...posts.filter(post => followedCommunities.includes(post.category))]
        .map(post => [post._id, post])
    ).values()
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredPosts = selectedCategory === 'Home'
    ? homeFeedPosts
    : selectedCategory === 'All'
    ? posts
    : posts.filter(post =>
        post.category === selectedCategory &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         post.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  if (loading && posts.length === 0) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <>
      <style>{`
        .circle-container { display: flex; min-height: 100vh; background-color: #f0f2f5; }
        .sidebar { width: 250px; padding: 20px; background-color: #1a1a1b; color: white; }
        .sidebar h2 { font-size: 24px; margin-bottom: 20px; }
        .search-bar { width: 100%; padding: 8px; margin-bottom: 20px; border-radius: 4px; }
        .categories button { display: block; width: 100%; padding: 10px; margin: 5px 0; background: none; border: none; color: white; text-align: left; cursor: pointer; }
        .categories button.active { background-color: #ff4500; border-radius: 4px; }
        .profile-btn { margin-top: 20px; padding: 10px; background-color: #ff4500; border: none; color: white; border-radius: 4px; cursor: pointer; }
        .main-content { flex: 1; padding: 20px; }
        .post-form { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .post-form form { display: flex; flex-direction: column; gap: 10px; }
        .post-form input, .post-form textarea, .post-form select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        .post-form button { padding: 10px; background-color: #ff4500; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .posts { display: flex; flex-direction: column; gap: 20px; }
        .post { display: flex; background: white; padding: 15px; border-radius: 8px; }
        .vote-section { display: flex; flex-direction: column; align-items: center; width: 60px; }
        .vote-section button { background: none; border: none; font-size: 20px; cursor: pointer; }
        .post-content { flex: 1; }
        .comments { margin-top: 10px; }
        .comment { padding: 5px 0; border-top: 1px solid #eee; }
        .comments form { display: flex; gap: 10px; margin-top: 10px; }
        .comments input { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 20px; border-radius: 8px; width: 400px; color: black; }
        .modal-content textarea { width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }
        .modal-content button { padding: 10px; margin: 5px; background-color: #ff4500; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .report-btn { margin-left: 10px; color: #ff4500; background: none; border: none; cursor: pointer; }
        .loading-container { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.5rem; }
        .error-message { background-color: #ffcccc; color: #cc0000; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        .delete-btn { margin-left: 5px; background: none; border: none; color: #ff4500; cursor: pointer; }
        .media-preview { max-width: 100%; max-height: 300px; margin-top: 10px; border-radius: 4px; }
      `}</style>

      <div className="circle-container">
        <div className="sidebar">
          <h2>Circle</h2>
          <input
            type="text"
            placeholder="Search Communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <div className="categories">
            <button onClick={() => setSelectedCategory('Home')} className={selectedCategory === 'Home' ? 'active' : ''}>
              Home
            </button>
            <button onClick={() => setSelectedCategory('All')} className={selectedCategory === 'All' ? 'active' : ''}>
              All
            </button>
            <h3>Communities</h3>
            {communities.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (
              <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedCategory(cat.name)}
                  className={selectedCategory === cat.name ? 'active' : ''}
                >
                  {cat.name}
                </button>
                <div>
                  <button
                    onClick={() => handleToggleCommunity(cat.name)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: followedCommunities.includes(cat.name) ? '#ff6666' : '#66cc66',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    {followedCommunities.includes(cat.name) ? 'Leave' : 'Join'}
                  </button>
                  {cat.creator === user?.username && (
                    <button className="delete-btn" onClick={() => handleDeleteCommunity(cat.name)}>
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowCreateCommunity(true)}
              style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ff4500', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
            >
              Create Community
            </button>
          </div>
          {user && <button onClick={() => setShowProfile(true)} className="profile-btn">{user.username}</button>}
        </div>

        <div className="main-content">
          {error && <div className="error-message">{error}</div>}
          
          {showCreateCommunity && (
            <div className="modal">
              <div className="modal-content">
                <h3>Create a Community</h3>
                <form onSubmit={handleCreateCommunity}>
                  <input
                    type="text"
                    value={newCommunity}
                    onChange={(e) => setNewCommunity(e.target.value)}
                    placeholder="Community Name"
                    style={{ width: '100%', padding: '8px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' }}
                    required
                  />
                  <button type="submit" disabled={loading}>Create</button>
                  <button type="button" onClick={() => setShowCreateCommunity(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )}

          <div className="post-form">
            <h3>Create a Post</h3>
            <form onSubmit={handlePostSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
              <textarea
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
                rows="4"
              />
              <input
                type="file"
                onChange={(e) => setNewPost({ ...newPost, media: e.target.files[0] })}
              />
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              >
                {communities.filter(c => c.creator === user?.username || followedCommunities.includes(c.name)).map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>

          <div className="posts">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Post
                  key={post._id}
                  post={post}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  onCommentSubmit={handleCommentSubmit}
                  onDeletePost={handleDeletePost}
                  onEditPost={handleEditPost}
                  onReportPost={handleReportPost}
                  user={user}
                  communities={communities}
                />
              ))
            ) : (
              <p>No posts available in this category.</p>
            )}
          </div>
        </div>

        {editingPostId && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Post</h2>
              <form onSubmit={handleSaveEdit}>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                />
                <textarea
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  required
                  rows="4"
                />
                <input
                  type="file"
                  onChange={(e) => setEditFormData({ ...editFormData, media: e.target.files[0] })}
                />
                <small>Note: Leave file blank to keep existing media</small>
                <div>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setEditingPostId(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {showProfile && (
          <div className="modal">
            <div className="modal-content">
              <h2>User Profile</h2>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Bio:</strong> {user?.bio || 'No bio yet.'}</p>
              <p><strong>Communities:</strong> {followedCommunities.join(', ')}</p>
              <button onClick={() => setShowProfile(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const Post = ({ post, onUpvote, onDownvote, onCommentSubmit, onDeletePost, onEditPost, onReportPost, user, communities }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const isAdmin = communities.find(c => c.name === post.category)?.creator === user?.username;

  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onCommentSubmit(post._id, commentText);
      setCommentText('');
    }
  };

  const getVoteCount = () => post.upvotes.length - post.downvotes.length;
  const hasUpvoted = () => post.upvotes.some(id => id.toString() === user?._id);
  const hasDownvoted = () => post.downvotes.some(id => id.toString() === user?._id);
  const formatDate = date => new Date(date).toLocaleString();

  return (
    <div className="post">
      <div className="vote-section">
        <button 
          onClick={() => onUpvote(post._id)}
          style={{ color: hasUpvoted() ? '#ff4500' : 'inherit' }}
        >
          ▲
        </button>
        <span>{getVoteCount()}</span>
        <button 
          onClick={() => onDownvote(post._id)}
          style={{ color: hasDownvoted() ? '#9494ff' : 'inherit' }}
        >
          ▼
        </button>
      </div>
      <div className="post-content">
        <h4>{post.title}</h4>
        <p>{post.content}</p>
        {post.media && (
          <img 
            src={`http://localhost:5000${post.media}`} 
            alt="Post Media" 
            className="media-preview"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300?text=Media+Not+Available';
            }}
          />
        )}
        <small>Posted by {post.user.username} in {post.category} on {formatDate(post.createdAt)}</small>
        <div style={{ marginTop: '5px' }}>
          <button onClick={() => setShowComments(!showComments)}>
            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </button>
          {post.user._id === user?._id && (
            <button style={{ marginLeft: '10px' }} onClick={() => onEditPost(post._id)}>Edit</button>
          )}
          {(post.user._id === user?._id || isAdmin) && (
            <button style={{ marginLeft: '10px' }} onClick={() => onDeletePost(post._id)}>Delete</button>
          )}
          <button className="report-btn" onClick={() => onReportPost(post._id)}>Report</button>
        </div>
        {showComments && (
          <div className="comments">
            {post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <strong>{comment.user || 'Unknown'}:</strong> {comment.text}
                  <div><small>{formatDate(comment.createdAt)}</small></div>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
            <form onSubmit={handleComment}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
              />
              <button type="submit">Comment</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Circle;