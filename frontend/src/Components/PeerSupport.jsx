// PeerSupport.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/TextArea';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import {
  Heart,
  MessageCircle,
  Reply,
  Flag,
  Plus,
  Search,
  TrendingUp,
  Loader2,
  MoreHorizontal,
  Verified,
  Image,
  Smile,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Shield,
  Users,
  Sparkles
} from 'lucide-react';
import { useCommunity } from '../hooks/useCommunity.js';
import { useAuth } from '../hooks/useAuth.js';

const PeerSupport = () => {
  const { user } = useAuth();
  const {
    posts,
    loading,
    error,
    trendingTopics,
    getCommunityPosts,
    createCommunityPost,
    addComment,
    togglePostLike,
    toggleCommentLike,
  } = useCommunity();

  /* ----------------------- STATE ----------------------- */
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    isAnonymous: true,
    tags: '',
  });
  const [currentPage] = useState(1);
  const [replyingToPost, setReplyingToPost] = useState(null);
  const [postReplyText, setPostReplyText] = useState('');
  const [submittingPostReply, setSubmittingPostReply] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});

  // Validation errors
  const [errors, setErrors] = useState({
    title: '',
    content: '',
    category: '',
  });

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'anxiety', label: 'Anxiety Support' },
    { value: 'depression', label: 'Depression Support' },
    { value: 'academic', label: 'Academic Stress' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'sleep', label: 'Sleep Issues' },
    { value: 'general', label: 'General Wellbeing' },
  ];

  /* ----------------------- FETCH ----------------------- */
  useEffect(() => {
    getCommunityPosts({
      page: currentPage,
      limit: 10,
      category: selectedCategory === 'all' ? null : selectedCategory,
      search: searchTerm || null,
      institutionId: user?.institutionId || null,
    });
  }, [currentPage, selectedCategory, searchTerm, user?.institutionId]);

  /* ----------------------- VALIDATE & CREATE POST ----------------------- */
  const validatePost = () => {
    const newErrors = { title: '', content: '', category: '' };
    if (!newPost.title.trim()) newErrors.title = 'Title is required';
    if (!newPost.content.trim()) newErrors.content = 'Content is required';
    if (!newPost.category) newErrors.category = 'Please select a category';

    setErrors(newErrors);
    return Object.values(newErrors).every(e => e === '');
  };

  const handleCreatePost = async () => {
    if (!validatePost()) return;

    try {
      const postData = {
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        isAnonymous: newPost.isAnonymous,
        tags: newPost.tags ? newPost.tags.split(',').map(t => t.trim()) : [],
        institutionId: user?.institutionId || 'iit-delhi',
      };
      await createCommunityPost(postData);
      setNewPost({ title: '', content: '', category: '', isAnonymous: true, tags: '' });
      setErrors({ title: '', content: '', category: '' }); // reset
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  /* ----------------------- REPLY TO POST (TOP-LEVEL) ----------------------- */
  const handlePostReply = async (postId) => {
    if (!postReplyText.trim()) return;
    setSubmittingPostReply(true);
    try {
      await addComment(postId, { content: postReplyText, isAnonymous: true });
      setPostReplyText('');
      setReplyingToPost(null);
      getCommunityPosts({ /* same filters */ });
    } catch (err) {
      console.error('Failed to reply to post:', err);
    } finally {
      setSubmittingPostReply(false);
    }
  };

  /* ----------------------- LIKE HANDLERS ----------------------- */
  const handleLikePost = async (postId) => {
    try {
      await togglePostLike(postId);
      getCommunityPosts({ /* same filters */ });
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    try {
      await toggleCommentLike(postId, commentId);
      getCommunityPosts({ /* same filters */ });
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  /* ----------------------- UTILS ----------------------- */
  const getCategoryColor = (category) => {
    const colors = {
      anxiety: 'bg-red-50 text-red-700 border-red-100',
      depression: 'bg-blue-50 text-blue-700 border-blue-100',
      academic: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      relationships: 'bg-pink-50 text-pink-700 border-pink-100',
      sleep: 'bg-purple-50 text-purple-700 border-purple-100',
      general: 'bg-gray-50 text-gray-700 border-gray-100',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-100';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(timestamp).getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1h ago';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1d ago';
    return `${diffInDays}d ago`;
  };

  const isPostLiked = (post) => post.likes?.some(l => l === user?._id);
  const isCommentLiked = (comment) => comment.likes?.some(l => l === user?._id);

  /* ----------------------- BUILD NESTED TREE ----------------------- */
  const buildCommentTree = (comments) => {
    const map = new Map();
    const roots = [];

    comments.forEach(c => {
      c.replies = [];
      map.set(c._id, c);
    });

    comments.forEach(c => {
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) parent.replies.push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  };

  /* ----------------------- RECURSIVE COMMENT COMPONENT ----------------------- */
  const Comment = ({ comment, postId, level = 0 }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleReply = async () => {
      if (!replyText.trim()) return;
      setSubmitting(true);
      try {
        await addComment(postId, {
          content: replyText,
          isAnonymous: true,
          parentId: comment._id,
        });
        setReplyText('');
        setReplying(false);
        getCommunityPosts({ /* same filters */ });
      } catch (err) {
        console.error('Failed to add reply:', err);
      } finally {
        setSubmitting(false);
      }
    };

    const hasReplies = comment.replies?.length > 0;

    return (
      <div className={`relative ${level > 0 ? 'ml-6 pl-4 border-l-2 border-gray-100' : 'mt-4'}`}>
        {/* Comment */}
        <div className="flex gap-3 group">
          <Avatar className="w-8 h-8 border border-gray-100">
            <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-xs">
              {comment.isAnonymous ? 'A' : comment.author?.firstName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-gray-50/80 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-gray-800">
                  {comment.isAnonymous ? 'Anonymous' : `${comment.author?.firstName} ${comment.author?.lastName}`}
                </span>
                <span className="text-xs text-gray-400">{getTimeAgo(comment.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
            </div>

            <div className="flex items-center gap-4 mt-1.5 ml-1">
              <button
                onClick={() => handleLikeComment(postId, comment._id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isCommentLiked(comment) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isCommentLiked(comment) ? 'fill-current' : ''}`} />
                {comment.likes?.length || 0}
              </button>
              <button
                onClick={() => setReplying(!replying)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-teal-600 transition-colors"
              >
                <Reply className="w-3.5 h-3.5" /> Reply
              </button>
              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 ml-2"
                >
                  {showReplies ? 'Hide' : 'View'} {comment.replies.length} {comment.replies.length > 1 ? 'replies' : 'reply'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replying && (
          <div className="mt-3 flex gap-3 ml-11 animate-in fade-in slide-in-from-top-2 duration-200">
            <Avatar className="w-8 h-8 border border-gray-100">
              <AvatarFallback className="bg-teal-50 text-teal-600 text-xs">
                {user?.firstName?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  className="text-sm resize-none min-h-[80px] pr-20 bg-white border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl"
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button size="sm" variant="ghost" className="h-7 px-3 text-xs" onClick={() => { setReplying(false); setReplyText(''); }}>
                    Cancel
                  </Button>
                  <Button size="sm" className="h-7 px-3 text-xs bg-teal-600 hover:bg-teal-700" onClick={handleReply} disabled={submitting || !replyText.trim()}>
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Reply'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Nested Replies */}
        {showReplies && (
          <div className="mt-2 space-y-4">
            {comment.replies.map(reply => (
              <Comment key={reply._id} comment={reply} postId={postId} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ----------------------- RENDER ----------------------- */
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT – FEED */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 -mx-4 px-4 py-4 mb-6 flex items-center justify-between lg:rounded-2xl lg:border lg:mx-0 lg:mb-6 shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Community Feed</h1>
                <p className="text-sm text-gray-500">Connect, share, and support each other</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 rounded-full h-10 transition-all"
                  />
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Composer Card */}
            <Card className="mb-6 border-none shadow-md overflow-hidden ring-1 ring-gray-100">
              <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-semibold">
                        {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                      <div className="relative group">
                        <Textarea
                          placeholder="What's on your mind? Share your thoughts..."
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          rows={3}
                          className={`resize-none border-0 bg-gray-50/50 focus:bg-white p-0 text-lg placeholder:text-gray-400 focus:ring-0 transition-colors placeholder:text-center placeholder:align-middle ${errors.content ? 'placeholder:text-red-300' : ''}`}
                        />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent group-focus-within:via-teal-500 transition-all" />
                      </div>
                      {errors.content && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-left-1">{errors.content}</p>}

                      {newPost.content && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                          <div>
                            <Input
                              placeholder="Add a descriptive title..."
                              value={newPost.title}
                              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                              className={`border-0 border-b border-gray-100 rounded-none px-0 focus:ring-0 focus:border-teal-500 font-medium ${errors.title ? 'border-red-300 placeholder:text-red-300' : ''}`}
                            />
                            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <div className="w-full sm:w-auto">
                              <Select
                                value={newPost.category}
                                onValueChange={(v) => setNewPost({ ...newPost, category: v })}
                              >
                                <SelectTrigger className={`w-full sm:w-[180px] h-9 bg-gray-50 border-transparent hover:bg-gray-100 transition-colors ${errors.category ? 'ring-1 ring-red-500 bg-red-50' : ''}`}>
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.slice(1).map((c) => (
                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                            </div>

                            <Input
                              placeholder="Tags (e.g. stress, help)"
                              value={newPost.tags}
                              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                              className="flex-1 h-9 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full">
                            <Image className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-full">
                            <Smile className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${newPost.isAnonymous ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'}`}>
                              <input
                                type="checkbox"
                                checked={newPost.isAnonymous}
                                onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                                className="hidden"
                              />
                              {newPost.isAnonymous && <Verified className="w-3 h-3 text-white" />}
                            </div>
                            <span className="group-hover:text-gray-900 transition-colors">Post Anonymously</span>
                          </label>

                          <Button
                            onClick={handleCreatePost}
                            disabled={!newPost.content || !newPost.category}
                            className="rounded-full bg-teal-600 hover:bg-teal-700 text-white px-6 shadow-lg shadow-teal-600/20 transition-all hover:scale-105 active:scale-95"
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                <p className="text-gray-500 font-medium">Loading community discussions...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No discussions yet</h3>
                <p className="text-gray-500 mt-1">Be the first to start a conversation in the community.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card key={post._id} className="border-none shadow-sm hover:shadow-md transition-all duration-200 ring-1 ring-gray-100 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-5 sm:p-6">
                        {/* Post Header */}
                        <div className="flex gap-4">
                          <Avatar className="w-10 h-10 border border-gray-100">
                            <AvatarFallback className={post.isAnonymous ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'}>
                              {post.isAnonymous ? 'A' : (post.author?.firstName?.[0] ?? 'U').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-sm mb-1">
                              <span className="font-bold text-gray-900 truncate">
                                {post.isAnonymous
                                  ? 'Anonymous Member'
                                  : `${post.author?.firstName ?? 'User'} ${post.author?.lastName ?? ''}`}
                              </span>
                              {post.author?.verified && <Verified className="w-3.5 h-3.5 text-blue-500" />}
                              <span className="text-gray-400 text-xs">•</span>
                              <span className="text-gray-500 text-xs">{getTimeAgo(post.createdAt)}</span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{post.title}</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline" className={`rounded-full px-3 py-0.5 border ${getCategoryColor(post.category)}`}>
                                {categories.find(c => c.value === post.category)?.label || post.category}
                              </Badge>
                              {post.tags?.map((t, i) => (
                                <Badge key={i} variant="secondary" className="rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent font-normal">
                                  #{t}
                                </Badge>
                              ))}
                            </div>

                            {/* Post Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                              <div className="flex items-center gap-6">
                                <button
                                  onClick={() => handleLikePost(post._id)}
                                  className={`flex items-center gap-2 text-sm font-medium transition-colors group ${isPostLiked(post) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                                >
                                  <div className={`p-2 rounded-full group-hover:bg-red-50 transition-colors ${isPostLiked(post) ? 'bg-red-50' : ''}`}>
                                    <Heart className="w-5 h-5" />
                                  </div>
                                  <span>{post.likes?.length ?? 0}</span>
                                </button>

                                <button
                                  onClick={() => setReplyingToPost(replyingToPost === post._id ? null : post._id)}
                                  className={`flex items-center gap-2 text-sm font-medium transition-colors group ${replyingToPost === post._id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                                >
                                  <div className={`p-2 rounded-full group-hover:bg-blue-50 transition-colors ${replyingToPost === post._id ? 'bg-blue-50' : ''}`}>
                                    <MessageCircle className="w-5 h-5" />
                                  </div>
                                  <span>{post.comments?.length ?? 0}</span>
                                </button>

                                <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
                                  <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                                    <Reply className="w-5 h-5" />
                                  </div>
                                </button>
                              </div>

                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <Flag className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Top-Level Reply Form */}
                        {replyingToPost === post._id && (
                          <div className="mt-6 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200 pl-14">
                            <Avatar className="w-8 h-8 border border-gray-100">
                              <AvatarFallback className="bg-teal-50 text-teal-600 text-xs">
                                {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="relative">
                                <Textarea
                                  placeholder="Write a thoughtful reply..."
                                  value={postReplyText}
                                  onChange={(e) => setPostReplyText(e.target.value)}
                                  rows={2}
                                  className="resize-none min-h-[80px] bg-gray-50 border-gray-200 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20 rounded-xl pr-24"
                                />
                                <div className="absolute bottom-2 right-2 flex gap-2">
                                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setReplyingToPost(null); setPostReplyText(''); }}>
                                    Cancel
                                  </Button>
                                  <Button size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700" onClick={() => handlePostReply(post._id)} disabled={!postReplyText.trim() || submittingPostReply}>
                                    {submittingPostReply ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Reply'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Comments Section */}
                        {post.comments?.length > 0 && (
                          <div className="mt-4 pl-14">
                            <button
                              onClick={() =>
                                setExpandedComments({
                                  ...expandedComments,
                                  [post._id]: !expandedComments[post._id],
                                })
                              }
                              className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors mb-3"
                            >
                              {expandedComments[post._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              {expandedComments[post._id] ? 'Hide Comments' : `View all ${post.comments.length} comments`}
                            </button>

                            {expandedComments[post._id] && (
                              <div className="space-y-5 animate-in fade-in duration-300">
                                {buildCommentTree(post.comments).map((topComment) => (
                                  <Comment key={topComment._id} comment={topComment} postId={post._id} />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT – SIDEBAR */}
          <div className="hidden lg:block w-80 space-y-6">
            {/* Trending Topics */}
            <Card className="border-none shadow-sm ring-1 ring-gray-100">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-800">
                  <TrendingUp className="w-5 h-5 text-teal-500" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {trendingTopics.length > 0 ? (
                  <div className="space-y-3">
                    {trendingTopics.map((topic) => (
                      <div key={topic.tag} className="flex items-center justify-between group cursor-pointer">
                        <Badge variant="secondary" className="bg-gray-50 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors px-3 py-1.5 rounded-lg border border-transparent group-hover:border-teal-100">
                          #{topic.tag}
                        </Badge>
                        <span className="text-xs text-gray-400 font-medium">{topic.count} posts</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No trending topics yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="border-none shadow-sm ring-1 ring-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-blue-900">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-blue-800/80">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <p>Be respectful, kind, and supportive to everyone.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <p>Do not give medical advice. Share experiences only.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <p>Maintain anonymity when sharing sensitive info.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <p>Report any concerning or harmful content immediately.</p>
                </div>
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-2 px-2">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Guidelines</a>
              <span>© 2024 Medhya</span>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING + BUTTON (Mobile Only) */}
      <button className="lg:hidden fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-teal-600 text-white shadow-xl hover:bg-teal-700 transition-transform hover:scale-105 active:scale-95 z-50">
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};

export default PeerSupport;