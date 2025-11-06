
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/TextArea';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Users, MessageCircle, Heart, Reply, Flag, Shield, Plus, Search, TrendingUp, Clock, Loader2, Send } from 'lucide-react';
import { useCommunity } from '../hooks/useCommunity.js';
import { useAuth } from '../hooks/useAuth.js';

const PeerSupport = () => {
  const { user } = useAuth();
  const { 
    posts, 
    loading, 
    error, 
    pagination, 
    trendingTopics,
    getCommunityPosts, 
    createCommunityPost,
    addComment,
    togglePostLike,
    toggleCommentLike
  } = useCommunity();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    isAnonymous: true,
    tags: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for reply functionality
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'anxiety', label: 'Anxiety Support' },
    { value: 'depression', label: 'Depression Support' },
    { value: 'academic', label: 'Academic Stress' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'sleep', label: 'Sleep Issues' },
    { value: 'general', label: 'General Wellbeing' }
  ];

  // Load posts on component mount and when filters change
  useEffect(() => {
    getCommunityPosts({
      page: currentPage,
      limit: 10,
      category: selectedCategory === 'all' ? null : selectedCategory,
      search: searchTerm || null,
      institutionId: user?.institutionId || null
    });
  }, [currentPage, selectedCategory, searchTerm, user?.institutionId]);

  const filteredPosts = posts;

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.category) return;
    
    try {
      const postData = {
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        isAnonymous: newPost.isAnonymous,
        tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : [],
        institutionId: user?.institutionId || 'iit-delhi' // Default institution
      };

      await createCommunityPost(postData);
      
      setShowNewPostForm(false);
      setNewPost({
        title: '',
        content: '',
        category: '',
        isAnonymous: true,
        tags: ''
      });
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleReply = async (postId) => {
    if (!replyContent.trim()) return;
    
    setSubmittingReply(true);
    try {
      const commentData = {
        content: replyContent,
        isAnonymous: true // Default to anonymous for replies
      };
      
      await addComment(postId, commentData);
      
      // Clear reply form
      setReplyContent('');
      setReplyingTo(null);
      
      // Refresh posts to show new comment
      getCommunityPosts({
        page: currentPage,
        limit: 10,
        category: selectedCategory === 'all' ? null : selectedCategory,
        search: searchTerm || null,
        institutionId: user?.institutionId || null
      });
    } catch (err) {
      console.error('Failed to add reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await togglePostLike(postId);
      
      // Refresh posts to show updated like count
      getCommunityPosts({
        page: currentPage,
        limit: 10,
        category: selectedCategory === 'all' ? null : selectedCategory,
        search: searchTerm || null,
        institutionId: user?.institutionId || null
      });
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    try {
      await toggleCommentLike(postId, commentId);
      
      // Refresh posts to show updated like count
      getCommunityPosts({
        page: currentPage,
        limit: 10,
        category: selectedCategory === 'all' ? null : selectedCategory,
        search: searchTerm || null,
        institutionId: user?.institutionId || null
      });
    } catch (err) {
      console.error('Failed to toggle comment like:', err);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      anxiety: 'bg-red-100 text-red-800',
      depression: 'bg-blue-100 text-blue-800',
      academic: 'bg-green-100 text-green-800',
      relationships: 'bg-pink-100 text-pink-800',
      sleep: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const isPostLiked = (post) => {
    return post.likes?.some(like => like === user?._id);
  };

  const isCommentLiked = (comment) => {
    return comment.likes?.some(like => like === user?._id);
  };

  return (
    
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Peer Support Community
          </CardTitle>
          <CardDescription>
            Connect with fellow students in a safe, moderated environment for mutual support and shared experiences
          </CardDescription>
        </CardHeader>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          This community is moderated by trained student volunteers and mental health professionals. 
          All posts are reviewed for safety and appropriateness. Remember to be kind and respectful.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="forum" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="resources">Community Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts and topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          {showNewPostForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Share your experience or ask for support from the community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>
                <div>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Textarea
                    placeholder="Share your thoughts, experiences, or questions..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={6}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Add tags (comma-separated): exam-stress, coping-strategies"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newPost.isAnonymous}
                      onChange={(e) => setNewPost({...newPost, isAnonymous: e.target.checked})}
                    />
                    Post anonymously (recommended)
                  </label>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost}>
                      Post to Community
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading posts...</span>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : filteredPosts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No posts found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or category filter.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {post.isAnonymous
                                ? "🧑"
                                : (post.author?.firstName?.charAt(0) || 'U').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {post.isAnonymous ? 'Anonymous Student' : `${post.author?.firstName || 'User'} ${post.author?.lastName || ''}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTimeAgo(new Date(post.createdAt))}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                          {post.isModerated && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Shield className="w-3 h-3 mr-1" />
                              Moderated
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h3 className="font-medium mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{post.content}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleLikePost(post._id)}
                            className={isPostLiked(post) ? "text-red-500" : ""}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${isPostLiked(post) ? "fill-current" : ""}`} />
                            {post.likes?.length || 0}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments?.length || 0} replies
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === post._id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {user?.firstName?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                placeholder="Write your reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="mb-3"
                                rows={3}
                              />
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    defaultChecked={true}
                                    disabled
                                  />
                                  Reply anonymously
                                </label>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyContent('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleReply(post._id)}
                                    disabled={!replyContent.trim() || submittingReply}
                                  >
                                    {submittingReply ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        Posting...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-4 h-4 mr-1" />
                                        Post Reply
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Comments Section */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="text-sm font-medium text-gray-700">Replies</h4>
                          {post.comments.map((comment) => (
                            <div key={comment._id} className="ml-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback>
                                      {comment.isAnonymous
                                        ? "🧑"
                                        : (comment.author?.firstName?.charAt(0) || 'U').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">
                                    {comment.isAnonymous ? 'Anonymous Student' : `${comment.author?.firstName || 'User'} ${comment.author?.lastName || ''}`}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {getTimeAgo(new Date(comment.createdAt))}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleLikeComment(post._id, comment._id)}
                                  className={isCommentLiked(comment) ? "text-red-500" : ""}
                                >
                                  <Heart className={`w-3 h-3 mr-1 ${isCommentLiked(comment) ? "fill-current" : ""}`} />
                                  {comment.likes?.length || 0}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Flag className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingTopics.length > 0 ? (
                      trendingTopics.map((topic) => (
                        <div key={topic.tag} className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            #{topic.tag}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {topic.count} posts
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No trending topics yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Be respectful and supportive</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>No giving medical advice</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Maintain anonymity when sharing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p>Report concerning content</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Support Groups</CardTitle>
                <CardDescription>Join weekly virtual support groups led by trained facilitators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Anxiety Support Circle</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Weekly group for students dealing with anxiety disorders
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Thursdays, 6:00 PM
                    </div>
                    <Button size="sm">Join Group</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Academic Stress Management</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Support for students struggling with academic pressure
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Tuesdays, 4:00 PM
                    </div>
                    <Button size="sm">Join Group</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peer Mentorship</CardTitle>
                <CardDescription>Connect with trained student mentors for one-on-one support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Find Your Mentor</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get matched with a trained peer mentor who has similar experiences
                  </p>
                  <Button>Request Mentor Match</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Resources</CardTitle>
              <CardDescription>Resources created and shared by the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Community resources coming soon</h3>
                <p className="text-sm text-muted-foreground">
                  This section will feature user-generated content, success stories, and peer-reviewed resources.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating centered New Post button */}
      <button
        type="button"
        onClick={() => setShowNewPostForm(true)}
        aria-label="Create new post"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 justify-center h-12 px-6 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        <Plus className="w-5 h-5" />
        New Post
      </button>
    </div>
    
  );
};

export default PeerSupport;