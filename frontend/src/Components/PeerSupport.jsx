// // PeerSupport.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { Textarea } from '../ui/Textarea';
// import { Badge } from '../ui/Badge';
// import { Alert, AlertDescription } from '../ui/Alert';
// import { Avatar, AvatarFallback } from '../ui/Avatar';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/Select';
// import {
//   Heart,
//   MessageCircle,
//   Reply,
//   Flag,
//   Plus,
//   Search,
//   TrendingUp,
//   Loader2,
//   MoreHorizontal,
//   Verified,
//   Image,
//   Smile,
//   MapPin,
//   Calendar,
//   X,
// } from 'lucide-react';
// import { useCommunity } from '../hooks/useCommunity.js';
// import { useAuth } from '../hooks/useAuth.js';

// const PeerSupport = () => {
//   const { user } = useAuth();
//   const {
//     posts,
//     loading,
//     error,
//     trendingTopics,
//     getCommunityPosts,
//     createCommunityPost,
//     addComment,
//     togglePostLike,
//     toggleCommentLike,
//   } = useCommunity();

//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showNewPostForm, setShowNewPostForm] = useState(false);
//   const [newPost, setNewPost] = useState({
//     title: '',
//     content: '',
//     category: '',
//     isAnonymous: true,
//     tags: '',
//   });
//   const [currentPage] = useState(1);
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [replyContent, setReplyContent] = useState('');
//   const [submittingReply, setSubmittingReply] = useState(false);

//   const categories = [
//     { value: 'all', label: 'All Topics' },
//     { value: 'anxiety', label: 'Anxiety Support' },
//     { value: 'depression', label: 'Depression Support' },
//     { value: 'academic', label: 'Academic Stress' },
//     { value: 'relationships', label: 'Relationships' },
//     { value: 'sleep', label: 'Sleep Issues' },
//     { value: 'general', label: 'General Wellbeing' },
//   ];

//   /* --------------------------------------------------- */
//   /*  LOGIC – EXACTLY YOUR CODE (unchanged)              */
//   /* --------------------------------------------------- */
//   useEffect(() => {
//     getCommunityPosts({
//       page: currentPage,
//       limit: 10,
//       category: selectedCategory === 'all' ? null : selectedCategory,
//       search: searchTerm || null,
//       institutionId: user?.institutionId || null,
//     });
//   }, [currentPage, selectedCategory, searchTerm, user?.institutionId]);

//   const handleCreatePost = async () => {
//     if (!newPost.title || !newPost.content || !newPost.category) return;
//     try {
//       const postData = {
//         title: newPost.title,
//         content: newPost.content,
//         category: newPost.category,
//         isAnonymous: newPost.isAnonymous,
//         tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : [],
//         institutionId: user?.institutionId || 'iit-delhi',
//       };
//       await createCommunityPost(postData);
//       setShowNewPostForm(false);
//       setNewPost({ title: '', content: '', category: '', isAnonymous: true, tags: '' });
//     } catch (err) {
//       console.error('Failed to create post:', err);
//     }
//   };

//   const handleReply = async (postId) => {
//     if (!replyContent.trim()) return;
//     setSubmittingReply(true);
//     try {
//       const commentData = { content: replyContent, isAnonymous: true };
//       await addComment(postId, commentData);
//       setReplyContent('');
//       setReplyingTo(null);
//       getCommunityPosts({
//         page: currentPage,
//         limit: 10,
//         category: selectedCategory === 'all' ? null : selectedCategory,
//         search: searchTerm || null,
//         institutionId: user?.institutionId || null,
//       });
//     } catch (err) {
//       console.error('Failed to add reply:', err);
//     } finally {
//       setSubmittingReply(false);
//     }
//   };

//   const handleLikePost = async (postId) => {
//     try {
//       await togglePostLike(postId);
//       getCommunityPosts({
//         page: currentPage,
//         limit: 10,
//         category: selectedCategory === 'all' ? null : selectedCategory,
//         search: searchTerm || null,
//         institutionId: user?.institutionId || null,
//       });
//     } catch (err) {
//       console.error('Failed to toggle like:', err);
//     }
//   };

//   const handleLikeComment = async (postId, commentId) => {
//     try {
//       await toggleCommentLike(postId, commentId);
//       getCommunityPosts({
//         page: currentPage,
//         limit: 10,
//         category: selectedCategory === 'all' ? null : selectedCategory,
//         search: searchTerm || null,
//         institutionId: user?.institutionId || null,
//       });
//     } catch (err) {
//       console.error('Failed to toggle comment like:', err);
//     }
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       anxiety: 'bg-red-100 text-red-800',
//       depression: 'bg-blue-100 text-blue-800',
//       academic: 'bg-green-100 text-green-800',
//       relationships: 'bg-pink-100 text-pink-800',
//       sleep: 'bg-purple-100 text-purple-800',
//       general: 'bg-gray-100 text-gray-800',
//     };
//     return colors[category] || 'bg-gray-100 text-gray-800';
//   };

//   const getTimeAgo = (timestamp) => {
//     const now = new Date();
//     const diffInHours = Math.floor((now.getTime() - new Date(timestamp).get  ) / (1000 * 60 * 60));
//     if (diffInHours < 1) return 'Less than an hour ago';
//     if (diffInHours === 1) return '1 hour ago';
//     if (diffInHours < 24) return `${diffInHours} hours ago`;
//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays === 1) return '1 day ago';
//     return `${diffInDays} days ago`;
//   };

//   const isPostLiked = (post) => post.likes?.some(like => like === user?._id);
//   const isCommentLiked = (comment) => comment.likes?.some(like => like === user?._id);

//   /* --------------------------------------------------- */
//   /*  UI – X-STYLE (matches your screenshot)             */
//   /* --------------------------------------------------- */
//   return (
//     <div className="max-w-6xl mx-auto flex gap-6 pb-20">
//       {/* ==================== LEFT – FEED ==================== */}
//       <div className="flex-1 max-w-2xl">
//         {/* Sticky Header + Composer */}
//         <div className="bg-white border-b border-gray-200">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3">
//             <h1 className="text-xl font-bold">Peer Support</h1>
//             {/* <div className="flex items-center gap-3">
//               <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
//               <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
//             </div> */}
//           </div>

//           {/* X-STYLE COMPOSER */}
//           <div className="px-4 pb-3">
//             <div className="flex gap-3">
//               <Avatar className="w-12 h-12">
//                 <AvatarFallback>
//                   {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="flex-1">
//                 <Textarea
//                   placeholder="What's happening?"
//                   value={newPost.content}
//                   onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
//                   rows={3}
//                   className="resize-none border-0 placeholder:text-xl placeholder:text-gray-500 focus:ring-0"
//                 />

//                 {/* Title (optional – hidden until user types) */}
//                 {newPost.content && (
//                   <Input
//                     placeholder="Add a title..."
//                     value={newPost.title}
//                     onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
//                     className="mt-2 border-0 placeholder:text-gray-500 focus:ring-0"
//                   />
//                 )}

//                 {/* Category + Tags */}
//                 <div className="mt-2 flex gap-2">
//                   <Select
//                     value={newPost.category}
//                     onValueChange={(v) => setNewPost({ ...newPost, category: v })}
//                   >
//                     <SelectTrigger className="w-48 h-9">
//                       <SelectValue placeholder="Category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.slice(1).map((c) => (
//                         <SelectItem key={c.value} value={c.value}>
//                           {c.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Input
//                     placeholder="Tags (comma-separated)"
//                     value={newPost.tags}
//                     onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
//                     className="flex-1 h-9"
//                   />
//                 </div>

//                 {/* Bottom bar */}
//                 <div className="mt-3 flex items-center justify-between">
//                   <div className="flex gap-4 text-blue-500">
//                     <Image className="w-5 h-5 cursor-pointer" />
//                     <Smile className="w-5 h-5 cursor-pointer" />
//                     <MapPin className="w-5 h-5 cursor-pointer" />
//                     <Calendar className="w-5 h-5 cursor-pointer" />
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <label className="flex items-center gap-2 text-sm">
//                       <input
//                         type="checkbox"
//                         checked={newPost.isAnonymous}
//                         onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
//                         className="rounded"
//                       />
//                       Anonymous
//                     </label>

//                     <Button
//                       size="sm"
//                       onClick={handleCreatePost}
//                       disabled={!newPost.content || !newPost.category}
//                       className="rounded-full"
//                     >
//                       Post
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* SEARCH BAR (inside feed, below composer) */}
//         <div className="px-4 py-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//             <Input
//               placeholder="Search posts..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-gray-100 rounded-full"
//             />
//           </div>
//         </div>

//         {/* POSTS FEED */}
//         {loading ? (
//           <div className="flex justify-center py-8">
//             <Loader2 className="w-6 h-6 animate-spin" />
//           </div>
//         ) : error ? (
//           <Alert variant="destructive" className="mx-4 mt-4">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <MessageCircle className="w-12 h-12 mx-auto mb-3" />
//             <p>No posts yet. Be the first!</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-200">
//             {posts.map((post) => (
//               <div key={post._id} className="px-4 py-3 hover:bg-gray-50 transition">
//                 {/* Header */}
//                 <div className="flex gap-3">
//                   <Avatar className="w-10 h-10">
//                     <AvatarFallback>
//                       {post.isAnonymous ? 'A' : (post.author?.firstName?.[0] ?? 'U').toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div className="flex-1">
//                     <div className="flex items-center gap-1 text-sm">
//                       <span className="font-semibold">
//                         {post.isAnonymous
//                           ? 'Anonymous Student'
//                           : `${post.author?.firstName ?? 'User'} ${post.author?.lastName ?? ''}`}
//                       </span>
//                       {post.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
//                       <span className="text-gray-500">· {getTimeAgo(post.createdAt)}</span>
//                     </div>

//                     <h3 className="mt-1 font-medium">{post.title}</h3>
//                     <p className="mt-1 text-gray-700">{post.content}</p>

//                     {post.tags?.length > 0 && (
//                       <div className="mt-2 flex flex-wrap gap-1">
//                         {post.tags.map((t, i) => (
//                           <Badge key={i} variant="secondary" className="text-xs">
//                             #{t}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}

//                     {/* Actions */}
//                     <div className="mt-3 flex items-center justify-between text-gray-500 text-sm">
//                       <button
//                         onClick={() => handleLikePost(post._id)}
//                         className={`flex items-center gap-1 hover:text-red-500 transition ${
//                           isPostLiked(post) ? 'text-red-500' : ''
//                         }`}
//                       >
//                         <Heart className={`w-5 h-5 ${isPostLiked(post) ? 'fill-current' : ''}`} />
//                         <span>{post.likes?.length ?? 0}</span>
//                       </button>

//                       <button
//                         onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
//                         className="flex items-center gap-1 hover:text-blue-500 transition"
//                       >
//                         <MessageCircle className="w-5 h-5" />
//                         <span>{post.comments?.length ?? 0}</span>
//                       </button>

//                       {/* <button className="flex items-center gap-1 hover:text-gray-700 transition">
//                         <Reply className="w-5 h-5" />
//                       </button>

//                       <button className="flex items-center gap-1 hover:text-gray-700 transition">
//                         <Flag className="w-5 h-5" />
//                       </button> */}
//                     </div>

//                     {/* REPLY FORM */}
//                     {replyingTo === post._id && (
//                       <div className="mt-4 flex gap-3">
//                         <Avatar className="w-9 h-9">
//                           <AvatarFallback>{user?.firstName?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <Textarea
//                             placeholder="Write a reply..."
//                             value={replyContent}
//                             onChange={(e) => setReplyContent(e.target.value)}
//                             rows={2}
//                             className="resize-none border-0 focus:ring-0"
//                           />
//                           <div className="mt-2 flex justify-end gap-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => {
//                                 setReplyingTo(null);
//                                 setReplyContent('');
//                               }}
//                             >
//                               Cancel
//                             </Button>
//                             <Button
//                               size="sm"
//                               onClick={() => handleReply(post._id)}
//                               disabled={!replyContent.trim() || submittingReply}
//                             >
//                               {submittingReply ? (
//                                 <>
//                                   <Loader2 className="w-4 h-4 mr-1 animate-spin" />
//                                   Posting
//                                 </>
//                               ) : (
//                                 'Reply'
//                               )}
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* COMMENTS */}
//                     {post.comments?.length > 0 && (
//                       <div className="mt-4 space-y-3">
//                         {post.comments.map((c) => (
//                           <div key={c._id} className="flex gap-3">
//                             <Avatar className="w-8 h-8">
//                               <AvatarFallback>
//                                 {c.isAnonymous ? 'A' : (c.author?.firstName?.[0] ?? 'U').toUpperCase()}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2">
//                               <div className="flex items-center gap-1 text-xs text-gray-600">
//                                 <span className="font-medium">
//                                   {c.isAnonymous
//                                     ? 'Anonymous Student'
//                                     : `${c.author?.firstName ?? ''} ${c.author?.lastName ?? ''}`}
//                                 </span>
//                                 <span>· {getTimeAgo(c.createdAt)}</span>
//                               </div>
//                               <p className="mt-1 text-sm">{c.content}</p>
//                               <div className="mt-2 flex items-center gap-3 text-gray-500 text-xs">
//                                 <button
//                                   onClick={() => handleLikeComment(post._id, c._id)}
//                                   className={`flex items-center gap-1 hover:text-red-500 transition ${
//                                     isCommentLiked(c) ? 'text-red-500' : ''
//                                   }`}
//                                 >
//                                   <Heart
//                                     className={`w-4 h-4 ${isCommentLiked(c) ? 'fill-current' : ''}`}
//                                   />
//                                   {c.likes?.length ?? 0}
//                                 </button>
//                                 <button className="flex items-center gap-1 hover:text-gray-700">
//                                   <Flag className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ==================== RIGHT – SIDEBAR ==================== */}
//       <div className="hidden lg:block w-80 space-y-6">
//         {/* Trending Topics */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center gap-2 text-base">
//               <TrendingUp className="w-5 h-5" />
//               Trending Topics
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {trendingTopics.length > 0 ? (
//               <div className="space-y-3">
//                 {trendingTopics.map((topic) => (
//                   <div key={topic.tag} className="flex items-center justify-between">
//                     <Badge variant="outline" className="text-xs">
//                       #{topic.tag}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">{topic.count} posts</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No trending topics yet</p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Community Guidelines */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base">Community Guidelines</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3 text-sm">
//             <div className="flex items-start gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
//               <p>Be respectful and supportive</p>
//             </div>
//             <div className="flex items-start gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
//               <p>No giving medical advice</p>
//             </div>
//             <div className="flex items-start gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
//               <p>Maintain anonymity when sharing</p>
//             </div>
//             <div className="flex items-start gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
//               <p>Report concerning content</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ==================== FLOATING + BUTTON ==================== */}
//       <button
//         onClick={() => setShowNewPostForm(true)}
//         className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
//       >
//         <Plus className="w-7 h-7" />
//       </button>
//     </div>
//   );
// };

// export default PeerSupport;









// // PeerSupport.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { Textarea } from '../ui/Textarea';
// import { Badge } from '../ui/Badge';
// import { Alert, AlertDescription } from '../ui/Alert';
// import { Avatar, AvatarFallback } from '../ui/Avatar';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/Select';
// import {
//   Heart,
//   MessageCircle,
//   Reply,
//   Flag,
//   Plus,
//   Search,
//   TrendingUp,
//   Loader2,
//   MoreHorizontal,
//   Verified,
//   Image,
//   Smile,
//   MapPin,
//   Calendar,
//   X,
//   ChevronDown,
//   ChevronUp,
// } from 'lucide-react';
// import { useCommunity } from '../hooks/useCommunity.js';
// import { useAuth } from '../hooks/useAuth.js';

// const PeerSupport = () => {
//   const { user } = useAuth();
//   const {
//     posts,
//     loading,
//     error,
//     trendingTopics,
//     getCommunityPosts,
//     createCommunityPost,
//     addComment,
//     togglePostLike,
//     toggleCommentLike,
//   } = useCommunity();

//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showNewPostForm, setShowNewPostForm] = useState(false);
//   const [newPost, setNewPost] = useState({
//     title: '',
//     content: '',
//     category: '',
//     isAnonymous: true,
//     tags: '',
//   });
//   const [currentPage] = useState(1);
//   const [replyingTo, setReplyingTo] = useState(null); // Now can be post._id or comment._id
//   const [replyContent, setReplyContent] = useState('');
//   const [submittingReply, setSubmittingReply] = useState(false);
//   const [expandedComments, setExpandedComments] = useState({}); // State for per-post comments expansion

//   const categories = [
//     { value: 'all', label: 'All Topics' },
//     { value: 'anxiety', label: 'Anxiety Support' },
//     { value: 'depression', label: 'Depression Support' },
//     { value: 'academic', label: 'Academic Stress' },
//     { value: 'relationships', label: 'Relationships' },
//     { value: 'sleep', label: 'Sleep Issues' },
//     { value: 'general', label: 'General Wellbeing' },
//   ];

//   /* --------------------------------------------------- */
//   /*  LOGIC – EXACTLY YOUR CODE (unchanged)              */
//   /* --------------------------------------------------- */
//   useEffect(() => {
//     getCommunityPosts({
//       page: currentPage,
//       limit: 10,
//       category: selectedCategory === 'all' ? null : selectedCategory,
//       search: searchTerm || null,
//       institutionId: user?.institutionId || null,
//     });
//   }, [currentPage, selectedCategory, searchTerm, user?.institutionId]);

//   const handleCreatePost = async () => {
//     if (!newPost.title || !newPost.content || !newPost.category) return;
//     try {
//       const postData = {
//         title: newPost.title,
//         content: newPost.content,
//         category: newPost.category,
//         isAnonymous: newPost.isAnonymous,
//         tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()) : [],
//         institutionId: user?.institutionId || 'iit-delhi',
//       };
//       await createCommunityPost(postData);
//       setShowNewPostForm(false);
//       setNewPost({ title: '', content: '', category: '', isAnonymous: true, tags: '' });
//     } catch (err) {
//       console.error('Failed to create post:', err);
//     }
//   };

//   const handleReply = async (postId, parentId = null) => {
//     if (!replyContent.trim()) return;
//     setSubmittingReply(true);
//     try {
//       const commentData = { content: replyContent, isAnonymous: true };
//       if (parentId) commentData.parentId = parentId; // Add parentId for sub-comments
//       await addComment(postId, commentData);
//       setReplyContent('');
//       setReplyingTo(null);
//       getCommunityPosts({
//         page: currentPage,
//         limit: 10,
//         category: selectedCategory === 'all' ? null : selectedCategory,
//         search: searchTerm || null,
//         institutionId: user?.institutionId || null,
//       });
//     } catch (err) {
//       console.error('Failed to add reply:', err);
//     } finally {
//       setSubmittingReply(false);
//     }
//   };

//   const handleLikePost = async (postId) => {
//     try {
//       await togglePostLike(postId);
//       getCommunityPosts({
//         page: currentPage,
//         limit: 10,
//         category: selectedCategory === 'all' ? null : selectedCategory,
//         search: searchTerm || null,
//         institutionId: user?.institutionId || null,
//       });
//     } catch (err) {
//       console.error('Failed to toggle like:', err);
//     }
//   };

//   const handleLikeComment = async (postId, commentId) => {
//     try {
//       await toggleCommentLike(postId, commentId);
//       getCommunityPosts({
//         page: currentPage,
//         limit: 10,
//         category: selectedCategory === 'all' ? null : selectedCategory,
//         search: searchTerm || null,
//         institutionId: user?.institutionId || null,
//       });
//     } catch (err) {
//       console.error('Failed to toggle comment like:', err);
//     }
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       anxiety: 'bg-red-100 text-red-800',
//       depression: 'bg-blue-100 text-blue-800',
//       academic: 'bg-green-100 text-green-800',
//       relationships: 'bg-pink-100 text-pink-800',
//       sleep: 'bg-purple-100 text-purple-800',
//       general: 'bg-gray-100 text-gray-800',
//     };
//     return colors[category] || 'bg-gray-100 text-gray-800';
//   };

//   const getTimeAgo = (timestamp) => {
//     const now = new Date();
//     const diffInHours = Math.floor((now.getTime() - new Date(timestamp).getTime()) / (1000 * 60 * 60));
//     if (diffInHours < 1) return 'Less than an hour ago';
//     if (diffInHours === 1) return '1 hour ago';
//     if (diffInHours < 24) return `${diffInHours} hours ago`;
//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays === 1) return '1 day ago';
//     return `${diffInDays} days ago`;
//   };

//   const isPostLiked = (post) => post.likes?.some(like => like === user?._id);
//   const isCommentLiked = (comment) => comment.likes?.some(like => like === user?._id);

//   /* --------------------------------------------------- */
//   /*  NEW: Build Nested Comment Tree from Flat List      */
//   /* --------------------------------------------------- */
//   const buildCommentTree = (comments) => {
//     const commentMap = {};
//     const tree = [];

//     comments.forEach((comment) => {
//       comment.replies = []; // Ensure replies array
//       commentMap[comment._id] = comment;
//     });

//     comments.forEach((comment) => {
//       if (comment.parentId) {
//         const parent = commentMap[comment.parentId];
//         if (parent) parent.replies.push(comment);
//       } else {
//         tree.push(comment);
//       }
//     });

//     return tree;
//   };

//   /* --------------------------------------------------- */
//   /*  NEW: Recursive Comment Component (with Toggle)     */
//   /* --------------------------------------------------- */
//   const Comment = ({ comment, postId, level = 0 }) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [localReplyingTo, setLocalReplyingTo] = useState(null);
//     const [localReplyContent, setLocalReplyContent] = useState('');
//     const [localSubmitting, setLocalSubmitting] = useState(false);

//     const handleLocalReply = async () => {
//       if (!localReplyContent.trim()) return;
//       setLocalSubmitting(true);
//       try {
//         const commentData = { content: localReplyContent, isAnonymous: true, parentId: comment._id };
//         await addComment(postId, commentData);
//         setLocalReplyContent('');
//         setLocalReplyingTo(null);
//         getCommunityPosts({
//           page: currentPage,
//           limit: 10,
//           category: selectedCategory === 'all' ? null : selectedCategory,
//           search: searchTerm || null,
//           institutionId: user?.institutionId || null,
//         });
//       } catch (err) {
//         console.error('Failed to add sub-reply:', err);
//       } finally {
//         setLocalSubmitting(false);
//       }
//     };

//     return (
//       <div style={{ marginLeft: `${level * 20}px` }} className="mt-2">
//         <div className="flex gap-3">
//           <Avatar className="w-8 h-8">
//             <AvatarFallback>
//               {comment.isAnonymous ? 'A' : (comment.author?.firstName?.[0] ?? 'U').toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2">
//             <div className="flex items-center gap-1 text-xs text-gray-600">
//               <span className="font-medium">
//                 {comment.isAnonymous
//                   ? 'Anonymous Student'
//                   : `${comment.author?.firstName ?? ''} ${comment.author?.lastName ?? ''}`}
//               </span>
//               <span>· {getTimeAgo(comment.createdAt)}</span>
//             </div>
//             <p className="mt-1 text-sm">{comment.content}</p>
//             <div className="mt-2 flex items-center gap-3 text-gray-500 text-xs">
//               <button
//                 onClick={() => handleLikeComment(postId, comment._id)}
//                 className={`flex items-center gap-1 hover:text-red-500 transition ${
//                   isCommentLiked(comment) ? 'text-red-500' : ''
//                 }`}
//               >
//                 <Heart className={`w-4 h-4 ${isCommentLiked(comment) ? 'fill-current' : ''}`} />
//                 {comment.likes?.length ?? 0}
//               </button>
//               <button onClick={() => setLocalReplyingTo(comment._id)} className="flex items-center gap-1 hover:text-blue-500 transition">
//                 <Reply className="w-4 h-4" />
//                 Reply
//               </button>
//               <button className="flex items-center gap-1 hover:text-gray-700">
//                 <Flag className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Local Reply Form */}
//         {localReplyingTo === comment._id && (
//           <div className="mt-2 flex gap-3 ml-11">
//             <Avatar className="w-8 h-8">
//               <AvatarFallback>{user?.firstName?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <Textarea
//                 placeholder="Write a reply..."
//                 value={localReplyContent}
//                 onChange={(e) => setLocalReplyContent(e.target.value)}
//                 rows={2}
//                 className="resize-none border-0 focus:ring-0"
//               />
//               <div className="mt-2 flex justify-end gap-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     setLocalReplyingTo(null);
//                     setLocalReplyContent('');
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={handleLocalReply}
//                   disabled={!localReplyContent.trim() || localSubmitting}
//                 >
//                   {localSubmitting ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-1 animate-spin" />
//                       Posting
//                     </>
//                   ) : (
//                     'Reply'
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Toggle for Sub-Comments */}
//         {comment.replies?.length > 0 && (
//           <button
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="mt-2 flex items-center gap-1 text-sm text-blue-500 ml-11"
//           >
//             {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//             {isExpanded ? 'Hide' : 'Show'} {comment.replies.length} repl{comment.replies.length > 1 ? 'ies' : 'y'}
//           </button>
//         )}

//         {/* Recursive Sub-Comments (hidden by default) */}
//         {isExpanded && comment.replies?.map((subComment) => (
//           <Comment key={subComment._id} comment={subComment} postId={post._id} level={level + 1} />
//         ))}
//       </div>
//     );
//   };

//   /* --------------------------------------------------- */
//   /*  UI – X-STYLE (matches your screenshot)             */
//   /* --------------------------------------------------- */
//   return (
//     <div className="max-w-6xl mx-auto flex gap-6 pb-20">
//       {/* ==================== LEFT – FEED ==================== */}
//       <div className="flex-1 max-w-2xl">
//         {/* Sticky Header + Composer */}
//         <div className=" bg-white border-b border-gray-200">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-3">
//             <h1 className="text-xl font-bold">Peer Support</h1>
//             <div className="flex items-center gap-3">
//               <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
//               <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
//             </div>
//           </div>

//           {/* X-STYLE COMPOSER */}
//           <div className="px-4 pb-3">
//             <div className="flex gap-3">
//               <Avatar className="w-12 h-12">
//                 <AvatarFallback>
//                   {user?.firstName?.[0]?.toUpperCase() ?? 'U'}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="flex-1">
//                 <Textarea
//                   placeholder="What's happening?"
//                   value={newPost.content}
//                   onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
//                   rows={3}
//                   className="resize-none border-0 placeholder:text-xl placeholder:text-gray-500 focus:ring-0"
//                 />

//                 {newPost.content && (
//                   <Input
//                     placeholder="Add a title..."
//                     value={newPost.title}
//                     onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
//                     className="mt-2 border-0 placeholder:text-gray-500 focus:ring-0"
//                   />
//                 )}

//                 <div className="mt-2 flex gap-2">
//                   <Select
//                     value={newPost.category}
//                     onValueChange={(v) => setNewPost({ ...newPost, category: v })}
//                   >
//                     <SelectTrigger className="w-48 h-9">
//                       <SelectValue placeholder="Category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.slice(1).map((c) => (
//                         <SelectItem key={c.value} value={c.value}>
//                           {c.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>

//                   <Input
//                     placeholder="Tags (comma-separated)"
//                     value={newPost.tags}
//                     onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
//                     className="flex-1 h-9"
//                   />
//                 </div>

//                 <div className="mt-3 flex items-center justify-between">
//                   <div className="flex gap-4 text-blue-500">
//                     <Image className="w-5 h-5 cursor-pointer" />
//                     <Smile className="w-5 h-5 cursor-pointer" />
//                     <MapPin className="w-5 h-5 cursor-pointer" />
//                     <Calendar className="w-5 h-5 cursor-pointer" />
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <label className="flex items-center gap-2 text-sm">
//                       <input
//                         type="checkbox"
//                         checked={newPost.isAnonymous}
//                         onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
//                         className="rounded"
//                       />
//                       Anonymous
//                     </label>

//                     <Button
//                       size="sm"
//                       onClick={handleCreatePost}
//                       disabled={!newPost.content || !newPost.category}
//                       className="rounded-full"
//                     >
//                       Post
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* SEARCH BAR (inside feed, below composer) */}
//         <div className="px-4 py-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//             <Input
//               placeholder="Search posts..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 bg-gray-100 rounded-full"
//             />
//           </div>
//         </div>

//         {/* POSTS FEED */}
//         {loading ? (
//           <div className="flex justify-center py-8">
//             <Loader2 className="w-6 h-6 animate-spin" />
//           </div>
//         ) : error ? (
//           <Alert variant="destructive" className="mx-4 mt-4">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <MessageCircle className="w-12 h-12 mx-auto mb-3" />
//             <p>No posts yet. Be the first!</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-200">
//             {posts.map((post) => (
//               <div key={post._id} className="px-4 py-3 hover:bg-gray-50 transition">
//                 {/* Post Header */}
//                 <div className="flex gap-3">
//                   <Avatar className="w-10 h-10">
//                     <AvatarFallback>
//                       {post.isAnonymous ? 'A' : (post.author?.firstName?.[0] ?? 'U').toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>

//                   <div className="flex-1">
//                     <div className="flex items-center gap-1 text-sm">
//                       <span className="font-semibold">
//                         {post.isAnonymous
//                           ? 'Anonymous Student'
//                           : `${post.author?.firstName ?? 'User'} ${post.author?.lastName ?? ''}`}
//                       </span>
//                       {post.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
//                       <span className="text-gray-500">· {getTimeAgo(post.createdAt)}</span>
//                     </div>

//                     <h3 className="mt-1 font-medium">{post.title}</h3>
//                     <p className="mt-1 text-gray-700">{post.content}</p>

//                     {post.tags?.length > 0 && (
//                       <div className="mt-2 flex flex-wrap gap-1">
//                         {post.tags.map((t, i) => (
//                           <Badge key={i} variant="secondary" className="text-xs">
//                             #{t}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}

//                     {/* Post Actions */}
//                     <div className="mt-3 flex items-center justify-between text-gray-500 text-sm">
//                       <button
//                         onClick={() => handleLikePost(post._id)}
//                         className={`flex items-center gap-1 hover:text-red-500 transition ${
//                           isPostLiked(post) ? 'text-red-500' : ''
//                         }`}
//                       >
//                         <Heart className={`w-5 h-5 ${isPostLiked(post) ? 'fill-current' : ''}`} />
//                         <span>{post.likes?.length ?? 0}</span>
//                       </button>

//                       <button
//                         onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
//                         className="flex items-center gap-1 hover:text-blue-500 transition"
//                       >
//                         <MessageCircle className="w-5 h-5" />
//                         <span>{post.comments?.length ?? 0}</span>
//                       </button>

//                       <button className="flex items-center gap-1 hover:text-gray-700 transition">
//                         <Reply className="w-5 h-5" />
//                       </button>

//                       <button className="flex items-center gap-1 hover:text-gray-700 transition">
//                         <Flag className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Top-Level Reply Form (for post) */}
//                 {replyingTo === post._id && (
//                   <div className="mt-4 flex gap-3">
//                     <Avatar className="w-9 h-9">
//                       <AvatarFallback>{user?.firstName?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1">
//                       <Textarea
//                         placeholder="Write a reply..."
//                         value={replyContent}
//                         onChange={(e) => setReplyContent(e.target.value)}
//                         rows={2}
//                         className="resize-none border-0 focus:ring-0"
//                       />
//                       <div className="mt-2 flex justify-end gap-2">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => {
//                             setReplyingTo(null);
//                             setReplyContent('');
//                           }}
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           size="sm"
//                           onClick={() => handleReply(post._id)}
//                           disabled={!replyContent.trim() || submittingReply}
//                         >
//                           {submittingReply ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-1 animate-spin" />
//                               Posting
//                             </>
//                           ) : (
//                             'Reply'
//                           )}
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Toggle for Post Comments */}
//                 {post.comments?.length > 0 && (
//                   <button
//                     onClick={() => setExpandedComments({
//                       ...expandedComments,
//                       [post._id]: !expandedComments[post._id],
//                     })}
//                     className="mt-2 flex items-center gap-1 text-sm text-blue-500"
//                   >
//                     {expandedComments[post._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                     {expandedComments[post._id] ? 'Hide' : 'Show'} {post.comments.length} comment{post.comments.length > 1 ? 's' : ''}
//                   </button>
//                 )}

//                 {/* Nested Comments (hidden by default) */}
//                 {expandedComments[post._id] && post.comments?.length > 0 && (
//                   <div className="mt-4 space-y-3">
//                     {buildCommentTree(post.comments).map((topComment) => (
//                       <Comment key={topComment._id} comment={topComment} postId={post._id} />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ==================== RIGHT – SIDEBAR ==================== */}
//       <div className="hidden lg:block w-80 space-y-6">
//         {/* Trending Topics */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center gap-2 text-base">
//               <TrendingUp className="w-5 h-5" />
//               Trending Topics
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {trendingTopics.length > 0 ? (
//               <div className="space-y-3">
//                 {trendingTopics.map((topic) => (
//                   <div key={topic.tag} className="flex items-center justify-between">
//                     <Badge variant="outline" className="text-xs">
//                       #{topic.tag}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">{topic.count} posts</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">No trending topics yet</p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Community Guidelines */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-base">Community Guidelines</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3 text-sm">
//             <div className="flex items-start gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
//               <p>Be respectful and supportive</p>
//             </div>
//             <div className="flex items-start gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
//               <p>No giving medical advice</p>
//             </div>
//             <div className="flex items-start gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
//               <p>Maintain anonymity when sharing</p>
//             </div>
//             <div className="flex items-start gap-2">
//               <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
//               <p>Report concerning content</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ==================== FLOATING + BUTTON ==================== */}
//       <button
//         onClick={() => setShowNewPostForm(true)}
//         className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
//       >
//         <Plus className="w-7 h-7" />
//       </button>
//     </div>
//   );
// };

// export default PeerSupport;












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
import { Textarea } from '../ui/Textarea';
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
      anxiety: 'bg-red-100 text-red-800',
      depression: 'bg-blue-100 text-blue-800',
      academic: 'bg-green-100 text-green-800',
      relationships: 'bg-pink-100 text-pink-800',
      sleep: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(timestamp).getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
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
      <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : 'mt-3'}`}>
        {/* Comment */}
        <div className="flex gap-2">
          <Avatar className="w-7 h-7">
            <AvatarFallback>
              {comment.isAnonymous ? 'A' : comment.author?.firstName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-xs text-gray-600">
              <span className="font-medium">
                {comment.isAnonymous ? 'Anonymous' : `${comment.author?.firstName} ${comment.author?.lastName}`}
              </span>
              <span className="ml-1">· {getTimeAgo(comment.createdAt)}</span>
            </p>
            <p className="text-sm mt-1">{comment.content}</p>

            <div className="flex gap-3 mt-2 text-xs text-gray-500">
              <button
                onClick={() => handleLikeComment(postId, comment._id)}
                className={`flex items-center gap-1 ${isCommentLiked(comment) ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-3.5 h-3.5 ${isCommentLiked(comment) ? 'fill-current' : ''}`} />
                {comment.likes?.length || 0}
              </button>
              <button
                onClick={() => setReplying(!replying)}
                className="flex items-center gap-1 hover:text-blue-500"
              >
                <Reply className="w-3.5 h-3.5" /> Reply
              </button>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replying && (
          <div className="mt-3 flex gap-2 ml-9">
            <Avatar className="w-7 h-7">
              <AvatarFallback>{user?.firstName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="text-sm resize-none"
              />
              <div className="flex justify-end gap-2 mt-1">
                <Button size="sm" variant="ghost" onClick={() => { setReplying(false); setReplyText(''); }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleReply} disabled={submitting || !replyText.trim()}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reply'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Show/Hide Replies */}
        {hasReplies && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="mt-2 ml-9 text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length > 1 ? 'replies' : 'reply'}
          </button>
        )}

        {/* Render Nested Replies */}
        {showReplies && comment.replies.map(reply => (
          <Comment key={reply._id} comment={reply} postId={postId} level={level + 1} />
        ))}
      </div>
    );
  };

  /* ----------------------- RENDER ----------------------- */
  return (
    <div className="max-w-6xl mx-auto flex gap-6 pb-20">
      {/* LEFT – FEED */}
      <div className="flex-1 max-w-2xl">
        {/* Sticky Header + Composer */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold">Peer Support</h1>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
              <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>
          </div>

          {/* Composer */}
          <div className="px-4 pb-3">
            <div className="flex gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback>{user?.firstName?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <Textarea
                  placeholder="What's happening?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={3}
                  className={`resize-none border-0 placeholder:text-xl placeholder:text-gray-500 focus:ring-0 ${errors.content ? 'border-red-500' : ''}`}
                />
                {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}

                {newPost.content && (
                  <>
                    <Input
                      placeholder="Add a title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className={`mt-2 border-0 placeholder:text-gray-500 focus:ring-0 ${errors.title ? 'border-red-500' : ''}`}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                  </>
                )}

                <div className="mt-2 flex gap-2">
                  <div className="relative">
                    <Select
                      value={newPost.category}
                      onValueChange={(v) => setNewPost({ ...newPost, category: v })}
                    >
                      <SelectTrigger className={`w-48 h-9 ${errors.category ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      {/* White dropdown with shadow */}
                      <SelectContent className="bg-white shadow-lg border rounded-md">
                        {categories.slice(1).map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.category}</p>}
                  </div>

                  <Input
                    placeholder="Tags (comma-separated)"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="flex-1 h-9"
                  />
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex gap-4 text-blue-500">
                    <Image className="w-5 h-5 cursor-pointer" />
                    <Smile className="w-5 h-5 cursor-pointer" />
                    <MapPin className="w-5 h-5 cursor-pointer" />
                    <Calendar className="w-5 h-5 cursor-pointer" />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newPost.isAnonymous}
                        onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                        className="rounded"
                      />
                      Anonymous
                    </label>

                    <Button
                      size="sm"
                      onClick={handleCreatePost}
                      disabled={!newPost.content || !newPost.category}
                      className="rounded-full"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-100 rounded-full"
            />
          </div>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mx-4 mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3" />
            <p>No posts yet. Be the first!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post._id} className="px-4 py-3 hover:bg-gray-50 transition">
                {/* Post Header */}
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {post.isAnonymous ? 'A' : (post.author?.firstName?.[0] ?? 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-semibold">
                        {post.isAnonymous
                          ? 'Anonymous Student'
                          : `${post.author?.firstName ?? 'User'} ${post.author?.lastName ?? ''}`}
                      </span>
                      {post.author?.verified && <Verified className="w-4 h-4 text-blue-500" />}
                      <span className="text-gray-500">· {getTimeAgo(post.createdAt)}</span>
                    </div>

                    <h3 className="mt-1 font-medium">{post.title}</h3>
                    <p className="mt-1 text-gray-700">{post.content}</p>

                    {post.tags?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.map((t, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">#{t}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="mt-3 flex items-center justify-evenly text-gray-500 text-sm">
                      <button
                        onClick={() => handleLikePost(post._id)}
                        className={`flex items-center gap-1 hover:text-red-500 transition ${isPostLiked(post) ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`w-5 h-5 ${isPostLiked(post) ? 'fill-current' : ''}`} />
                        <span>{post.likes?.length ?? 0}</span>
                      </button>

                      <button
                        onClick={() => setReplyingToPost(replyingToPost === post._id ? null : post._id)}
                        className="flex items-center gap-1 hover:text-blue-500 transition"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments?.length ?? 0}</span>
                      </button>

                      {/* <button className="flex items-center gap-1 hover:text-gray-700 transition">
                        <Reply className="w-5 h-5" />
                      </button>

                      <button className="flex items-center gap-1 hover:text-gray-700 transition">
                        <Flag className="w-5 h-5" />
                      </button> */}
                    </div>
                  </div>
                </div>

                {/* Top-Level Reply Form */}
                {replyingToPost === post._id && (
                  <div className="mt-4 flex gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback>{user?.firstName?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Write a reply..."
                        value={postReplyText}
                        onChange={(e) => setPostReplyText(e.target.value)}
                        rows={2}
                        className="resize-none border-0 focus:ring-0"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingToPost(null);
                            setPostReplyText('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handlePostReply(post._id)}
                          disabled={!postReplyText.trim() || submittingPostReply}
                        >
                          {submittingPostReply ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Posting
                            </>
                          ) : 'Reply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Toggle Comments */}
                {post.comments?.length > 0 && (
                  <button
                    onClick={() =>
                      setExpandedComments({
                        ...expandedComments,
                        [post._id]: !expandedComments[post._id],
                      })
                    }
                    className="mt-2 flex items-center gap-1 text-sm text-blue-500"
                  >
                    {expandedComments[post._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {expandedComments[post._id] ? 'Hide' : 'Show'} {post.comments.length} comment{post.comments.length > 1 ? 's' : ''}
                  </button>
                )}

                {/* Nested Comments */}
                {expandedComments[post._id] && post.comments?.length > 0 && (
                  <div className="mt-4">
                    {buildCommentTree(post.comments).map((topComment) => (
                      <Comment key={topComment._id} comment={topComment} postId={post._id} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT – SIDEBAR */}
      <div className="hidden lg:block w-80 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendingTopics.length > 0 ? (
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">#{topic.tag}</Badge>
                    <span className="text-xs text-muted-foreground">{topic.count} posts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No trending topics yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <p>Be respectful and supportive</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <p>No giving medical advice</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <p>Maintain anonymity when sharing</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
              <p>Report concerning content</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FLOATING + BUTTON */}
      <button className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition">
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};

export default PeerSupport;