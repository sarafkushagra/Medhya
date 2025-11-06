
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { Badge } from '../ui/Badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
// import { BookOpen, Play, Headphones, Bookmark, Search, Filter, Star, Clock, Eye, Loader2, X, ExternalLink, BookmarkCheck, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useResources } from '../hooks/useResources';
// import { useUserLibrary } from '../hooks/useUserLibrary';

// const ResourceHub = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedLanguage, setSelectedLanguage] = useState('all');
//   const [selectedType, setSelectedType] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedResourceUrl, setSelectedResourceUrl] = useState(null);
//   const [selectedResource, setSelectedResource] = useState(null);
//   const [showUrlPopup, setShowUrlPopup] = useState(false);
//   const [currentResourceIndex, setCurrentResourceIndex] = useState(0);

//   // API hooks
//   const { 
//     resources, 
//     loading: resourcesLoading, 
//     error: resourcesError, 
//     pagination: resourcesPagination,
//     getResources, 
//     getFeaturedResources 
//   } = useResources();

//   const { 
//     userResources, 
//     loading: libraryLoading, 
//     error: libraryError, 
//     pagination: libraryPagination,
//     getUserLibrary, 
//     saveResource,
//     removeFromLibrary
//   } = useUserLibrary();

//   // Fetch data on component mount
//   useEffect(() => {
//     getResources({}, currentPage, 12);
//     getFeaturedResources(6);
//     getUserLibrary(1, 12);
//   }, []);

//   // Keyboard navigation for resource popup
//   useEffect(() => {
//     const handleKeyPress = (event) => {
//       if (!showUrlPopup) return;
      
//       if (event.key === 'ArrowLeft') {
//         event.preventDefault();
//         navigateToPrevious();
//       } else if (event.key === 'ArrowRight') {
//         event.preventDefault();
//         navigateToNext();
//       } else if (event.key === 'Escape') {
//         event.preventDefault();
//         setShowUrlPopup(false);
//         setSelectedResourceUrl(null);
//         setSelectedResource(null);
//       }
//     };

//     if (showUrlPopup) {
//       document.addEventListener('keydown', handleKeyPress);
//     }

//     return () => {
//       document.removeEventListener('keydown', handleKeyPress);
//     };
//   }, [showUrlPopup, currentResourceIndex, resources]);
//   useEffect(() => {
//     const filters = {
//       search: searchTerm || undefined,
//       category: selectedCategory !== 'all' ? selectedCategory : undefined,
//       resourceLanguage: selectedLanguage !== 'all' ? selectedLanguage : undefined,
//       type: selectedType !== 'all' ? selectedType : undefined
//     };
    
//     // Remove undefined values
//     Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
//     getResources(filters, currentPage, 12);
//   }, [searchTerm, selectedCategory, selectedLanguage, selectedType, currentPage]);

//   const categories = [
//     { value: 'all', label: 'All Categories' },
//     { value: 'anxiety', label: 'Anxiety & Panic' },
//     { value: 'depression', label: 'Depression' },
//     { value: 'stress', label: 'Stress Management' },
//     { value: 'sleep', label: 'Sleep & Rest' },
//     { value: 'relationships', label: 'Relationships' },
//     { value: 'academic', label: 'Academic Pressure' },
//     { value: 'mindfulness', label: 'Mindfulness' }
//   ];

//   const languages = [
//     { value: 'all', label: 'All Languages' },
//     { value: 'english', label: 'English' },
//     { value: 'hindi', label: 'Hindi' },
//     { value: 'regional', label: 'Regional Languages' }
//   ];

//   const types = [
//     { value: 'all', label: 'All Types' },
//     { value: 'video', label: 'Videos' },
//     { value: 'audio', label: 'Audio' },
//     { value: 'article', label: 'Articles' },
//     { value: 'guide', label: 'Guides' },
//     { value: 'worksheet', label: 'Worksheets' }
//   ];

//   const getTypeIcon = (type) => {
//     if (!type) return <BookOpen className="w-5 h-5 text-slate-500" />;
//     switch (type) {
//       case 'video': return <Play className="w-5 h-5 text-sky-500" />;
//       case 'audio': return <Headphones className="w-5 h-5 text-lavender-500" />;
//       case 'article': return <BookOpen className="w-5 h-5 text-mint-500" />;
//       case 'guide': return <BookOpen className="w-5 h-5 text-sky-500" />;
//       case 'worksheet': return <Bookmark className="w-5 h-5 text-peach-500" />;
//       default: return <BookOpen className="w-5 h-5 text-slate-500" />;
//     }
//   };

//   const getCategoryColor = (category) => {
//     if (!category) return 'bg-slate-100 text-slate-800 border-slate-200';
//     const colors = {
//       anxiety: 'bg-sky-50 text-sky-700 border-sky-200',
//       depression: 'bg-mint-50 text-mint-700 border-mint-200',
//       stress: 'bg-peach-50 text-peach-700 border-peach-200',
//       sleep: 'bg-lavender-50 text-lavender-700 border-lavender-200',
//       relationships: 'bg-sky-50 text-sky-700 border-sky-200',
//       academic: 'bg-mint-50 text-mint-700 border-mint-200',
//       mindfulness: 'bg-lavender-50 text-lavender-700 border-lavender-200'
//     };
//     return colors[category] || 'bg-slate-50 text-slate-700 border-slate-200';
//   };

//   const handleSaveResource = async (resourceId) => {
//     try {
//       await saveResource(resourceId);
//       // Refresh user library
//       getUserLibrary(1, 12);
//     } catch (error) {
//       console.error('Error saving resource:', error);
//     }
//   };

//   const handleRemoveFromLibrary = async (resourceId) => {
//     try {
//       await removeFromLibrary(resourceId);
//       // Refresh user library
//       getUserLibrary(1, 12);
//     } catch (error) {
//       console.error('Error removing resource:', error);
//     }
//   };

//   const LoadingSpinner = () => (
//     <div className="flex items-center justify-center py-12">
//       <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
//       <span className="ml-4 text-lg text-slate-600 font-medium">Loading resources...</span>
//     </div>
//   );

//   const ErrorMessage = ({ error }) => (
//     <Card className="shadow-lg rounded-2xl border border-slate-200">
//       <CardContent className="py-12 text-center">
//         <BookOpen className="w-16 h-16 mx-auto text-slate-400 mb-4" />
//         <h3 className="text-xl font-semibold mb-2 text-slate-800">Error loading resources</h3>
//         <p className="text-md text-slate-600 mb-6 font-medium">
//           {error || 'Something went wrong. Please try again later.'}
//         </p>
//         <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-sky-500 to-mint-500 hover:from-sky-600 hover:to-mint-600 text-white shadow-md rounded-2xl transition-all duration-300">
//           Retry
//         </Button>
//       </CardContent>
//     </Card>
//   );

//   // URL Popup Component
//   const UrlPopup = ({ url, resource, onClose, onPrevious, onNext, currentIndex, totalResources }) => {
//     if (!url) return null;

//     const isVideo = resource?.type === 'video';
//     const isAudio = resource?.type === 'audio';

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//         <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
//           <div className="flex items-center justify-between p-6 border-b border-slate-200">
//             <div className="flex items-center gap-3">
//               {/* Navigation Buttons */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onPrevious}
//                 disabled={!totalResources || totalResources <= 1}
//                 className="flex items-center gap-2 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Previous Resource (←)"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </Button>
              
//               <div className="text-sm text-slate-600 font-medium px-2">
//                 {totalResources ? `${currentIndex + 1} of ${totalResources}` : ''}
//               </div>
              
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onNext}
//                 disabled={!totalResources || totalResources <= 1}
//                 className="flex items-center gap-2 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Next Resource (→)"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </Button>
//             </div>
            
//             <h3 className="font-bold text-xl text-slate-800 flex-1 text-center mx-4">{resource?.title || 'Resource Viewer'}</h3>
            
//             <div className="flex items-center gap-3">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => window.open(url, '_blank')}
//                 className="flex items-center gap-2 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded-2xl transition-all duration-300"
//               >
//                 <ExternalLink className="w-4 h-4" />
//                 Open in New Tab
//               </Button>
//               <div className="text-xs text-slate-500 hidden sm:block">
//                 Use ← → keys to navigate
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={onClose}
//                 className="hover:bg-red-50 text-slate-700 rounded-2xl transition-all duration-300"
//                 title="Close (Esc)"
//               >
//                 <X className="w-5 h-5 text-slate-500" />
//               </Button>
//             </div>
//           </div>
//           <div className="flex-1 p-6">
//             {(isVideo || isAudio) ? (
//               <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner">
//                 <iframe
//                   src={url}
//                   className="w-full h-full border-0"
//                   title={resource?.title || "Resource Content"}
//                   allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
//                 />
//               </div>
//             ) : (
//               <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
//                 <div className="text-center max-w-md">
//                   <BookOpen className="w-20 h-20 mx-auto text-slate-400 mb-6" />
//                   <h3 className="font-semibold text-2xl mb-2 text-slate-800">External Resource</h3>
//                   <p className="text-md text-slate-600 mb-8 font-medium">
//                     This resource is hosted externally and cannot be previewed here. 
//                     Click the button below to open it in a new tab.
//                   </p>
//                   <div className="space-y-4">
//                     <Button
//                       onClick={() => window.open(url, '_blank')}
//                       className="w-full bg-gradient-to-r from-sky-500 to-mint-500 hover:from-sky-600 hover:to-mint-600 text-white shadow-md rounded-2xl transition-all duration-300"
//                     >
//                       <ExternalLink className="w-4 h-4 mr-2" />
//                       Open Resource
//                     </Button>
//                     <Button
//                       variant="outline"
//                       onClick={onClose}
//                       className="w-full border-2 border-slate-200 hover:bg-slate-50 rounded-2xl transition-all duration-300"
//                     >
//                       Close Preview
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Handle resource access
//   const handleAccessResource = (resource, index = null) => {
//     if (resource.url) {
//       setSelectedResourceUrl(resource.url);
//       setSelectedResource(resource);
      
//       // Set the current index for navigation
//       if (index !== null) {
//         setCurrentResourceIndex(index);
//       } else {
//         // Find the index in the current resources array
//         const resourceIndex = resources?.findIndex(r => r._id === resource._id) || 0;
//         setCurrentResourceIndex(resourceIndex);
//       }
      
//       setShowUrlPopup(true);
//     } else {
//       // Fallback for resources without URLs
//       alert('This resource is not available online. Please contact support for access.');
//     }
//   };

//   // Navigate to previous resource
//   const navigateToPrevious = () => {
//     if (!resources || resources.length === 0) return;
    
//     const newIndex = currentResourceIndex > 0 ? currentResourceIndex - 1 : resources.length - 1;
//     const prevResource = resources[newIndex];
//     handleAccessResource(prevResource, newIndex);
//   };

//   // Navigate to next resource
//   const navigateToNext = () => {
//     if (!resources || resources.length === 0) return;
    
//     const newIndex = currentResourceIndex < resources.length - 1 ? currentResourceIndex + 1 : 0;
//     const nextResource = resources[newIndex];
//     handleAccessResource(nextResource, newIndex);
//   };

//   // Handle save/remove from library
//   const handleToggleSave = async (resourceId) => {
//     try {
//       const isInLibrary = userResources?.some(ur => ur.resource._id === resourceId);
      
//       if (isInLibrary) {
//         await removeFromLibrary(resourceId);
//         // Show success message
//         console.log('Resource removed from library');
//       } else {
//         await saveResource(resourceId);
//         // Show success message
//         console.log('Resource added to library');
//       }
      
//       // Refresh user library
//       getUserLibrary(1, 12);
//     } catch (error) {
//       console.error('Error toggling save:', error);
//       // Show error message
//       alert('Failed to update library. Please try again.');
//     }
//   };

//   // Check if resource is in user's library
//   const isResourceInLibrary = (resourceId) => {
//     return userResources?.some(ur => ur.resource._id === resourceId) || false;
//   };

//   return (
    
//       <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-sky-50 via-white to-lavender-50 text-slate-800 transition-colors duration-500 font-['Poppins',sans-serif]">
      
//       <Card className="shadow-lg rounded-2xl mb-8 transform transition-transform duration-500 hover:scale-[1.005] border border-slate-200">
//         <CardHeader className="p-8">
//           <CardTitle className="flex items-center gap-4 text-4xl font-bold bg-sky-600 via-mint-600 to-lavender-600 bg-clip-text text-transparent">
//             <BookOpen className="w-10 h-10 text-sky-500" />
//             Psychoeducational Resource Hub
//           </CardTitle>
//           <CardDescription className="text-xl text-slate-600 mt-3 font-medium">
//             Access curated mental health resources, guides, and educational content in multiple languages
//           </CardDescription>
//         </CardHeader>
//       </Card>

//       <Tabs defaultValue="browse" className="space-y-8">
//         <TabsList className="grid h-12 w-full grid-cols-3 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
//           <TabsTrigger value="featured" className="data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-sky-200 rounded-xl transition-all duration-300 font-medium">Featured</TabsTrigger>
//           <TabsTrigger value="browse" className="data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-sky-200 rounded-xl transition-all duration-300 font-medium">Browse All</TabsTrigger>
//           <TabsTrigger value="my-library" className="data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-sky-200 rounded-xl transition-all duration-300 font-medium">My Library</TabsTrigger>
//         </TabsList>

//         <TabsContent value="featured" className="space-y-6">
//           <Card className="shadow-lg rounded-2xl bg-white border border-slate-200">
//             <CardHeader className="p-6">
//               <CardTitle className="text-2xl font-bold text-slate-800">Featured Resources</CardTitle>
//               <CardDescription className="text-md text-slate-600 font-medium">Hand-picked resources recommended by our mental health professionals</CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               {resourcesLoading ? (
//                 <LoadingSpinner />
//               ) : resourcesError ? (
//                 <ErrorMessage error={resourcesError} />
//               ) : (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   {resources?.filter(resource => resource.isFeatured).map((resource) => (
//                     <Card key={resource._id} className="shadow-sm rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg bg-white border border-slate-200">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center gap-2">
//                           <div className="p-2 bg-slate-50 rounded-2xl">{getTypeIcon(resource.type)}</div>
//                           <Badge className={`text-xs font-semibold px-3 py-1 border rounded-2xl ${getCategoryColor(resource.category)}`}>
//                             {resource.category}
//                           </Badge>
//                         </div>
//                         <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 bg-yellow-50 border-yellow-200 rounded-2xl">
//                           <Star className="w-3 h-3 fill-current" />
//                           {resource.averageRating?.toFixed(1) || 'N/A'}
//                         </Badge>
//                       </div>
                      
//                       <h3 className="font-bold text-xl mb-2 text-slate-800">{resource.title}</h3>
//                       <p className="text-sm text-slate-600 mb-4 line-clamp-3 font-medium">{resource.description}</p>
                      
//                       <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
//                         <div className="flex items-center gap-1">
//                           <Clock className="w-3 h-3" />
//                           <span>{resource.duration}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Eye className="w-3 h-3" />
//                           <span>{resource.views} views</span>
//                         </div>
//                       </div>
                      
//                       <div className="flex gap-3">
//                         <Button 
//                           size="sm" 
//                           className="flex-1 bg-gradient-to-r from-sky-500 to-mint-500 hover:from-sky-600 hover:to-mint-600 text-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 rounded-2xl font-semibold"
//                           onClick={() => handleAccessResource(resource)}
//                         >
//                           {resource.type === 'video' ? 'Watch' : 
//                             resource.type === 'audio' ? 'Listen' : 'Read'}
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm"
//                           onClick={() => handleToggleSave(resource._id)}
//                           className={`
//                             border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300 rounded-2xl
//                             ${isResourceInLibrary(resource._id) ? 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100' : ''}
//                           `}
//                           title={isResourceInLibrary(resource._id) ? 'Remove from library' : 'Add to library'}
//                         >
//                           {isResourceInLibrary(resource._id) ? (
//                             <BookmarkCheck className="w-4 h-4" />
//                           ) : (
//                             <Bookmark className="w-4 h-4" />
//                           )}
//                         </Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="browse" className="space-y-6">
//           <Card className="shadow-lg rounded-2xl bg-white border border-slate-200">
//             <CardHeader className="p-6">
//               <CardTitle className="text-2xl font-bold text-slate-800">Search & Filter Resources</CardTitle>
//               <CardDescription className="text-md text-slate-600 font-medium">Find specific resources based on your needs and preferences</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6 p-6">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//                   <Input
//                     placeholder="Search resources..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-12 py-6 rounded-2xl border-2 border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all duration-300"
//                   />
//                 </div>
//                 <Button variant="outline" className="flex items-center gap-2 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5">
//                   <Filter className="w-5 h-5" />
//                   Filters
//                 </Button>
//               </div>

//               <div className="grid gap-4 md:grid-cols-3">
//                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                   <SelectTrigger className="border-2 border-sky-200 bg-white text-slate-700 focus-visible:ring-sky-500 rounded-2xl py-3 px-6 transition-colors hover:bg-sky-50">
//                     <SelectValue placeholder="Category" className="text-slate-700" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-2xl">
//                     {categories.map((category) => (
//                       <SelectItem key={category.value} value={category.value}>
//                         {category.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
//                   <SelectTrigger className="border-2 border-mint-200 bg-white text-slate-700 focus-visible:ring-mint-500 rounded-2xl py-3 px-6 transition-colors hover:bg-mint-50">
//                     <SelectValue placeholder="Language" className="text-slate-700" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-2xl">
//                     {languages.map((language) => (
//                       <SelectItem key={language.value} value={language.value}>
//                         {language.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={selectedType} onValueChange={setSelectedType}>
//                   <SelectTrigger className="border-2 border-lavender-200 bg-white text-slate-700 focus-visible:ring-lavender-500 rounded-2xl py-3 px-6 transition-colors hover:bg-lavender-50">
//                     <SelectValue placeholder="Type" className="text-slate-700" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-2xl">
//                     {types.map((type) => (
//                       <SelectItem key={type.value} value={type.value}>
//                         {type.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {resourcesLoading ? (
//             <LoadingSpinner />
//           ) : resourcesError ? (
//             <ErrorMessage error={resourcesError} />
//           ) : (
//             <>
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {resources?.map((resource) => (
//                   <Card key={resource._id} className="shadow-sm rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg bg-white border border-slate-200">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         <div className="p-2 bg-slate-50 rounded-2xl">{getTypeIcon(resource.type)}</div>
//                         <Badge className={`text-xs font-semibold px-3 py-1 border rounded-2xl ${getCategoryColor(resource.category)}`}>
//                           {resource.category}
//                         </Badge>
//                       </div>
//                       <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 bg-yellow-50 border-yellow-200 rounded-2xl">
//                         <Star className="w-3 h-3 fill-current" />
//                         {resource.averageRating?.toFixed(1) || 'N/A'}
//                       </Badge>
//                     </div>
                    
//                     <h3 className="font-bold text-xl mb-2 text-slate-800">{resource.title}</h3>
//                     <p className="text-sm text-slate-600 mb-4 line-clamp-3 font-medium">{resource.description}</p>
                    
//                     <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
//                       <div className="flex items-center gap-1">
//                         <Clock className="w-3 h-3" />
//                         <span>{resource.duration}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Eye className="w-3 h-3" />
//                         <span>{resource.views} views</span>
//                       </div>
//                     </div>
                    
//                     <div className="flex gap-3">
//                       <Button 
//                         size="sm" 
//                         className="flex-1 bg-sky-500 hover:from-sky-600 hover:to-mint-600 text-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 rounded-2xl font-semibold"
//                         onClick={() => handleAccessResource(resource)}
//                       >
//                         Access Resource
//                       </Button>
//                       <Button 
//                         variant="outline" 
//                         size="sm"
//                         onClick={() => handleToggleSave(resource._id)}
//                         className={`
//                           border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300 rounded-2xl
//                           ${isResourceInLibrary(resource._id) ? 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100' : ''}
//                         `}
//                         title={isResourceInLibrary(resource._id) ? 'Remove from library' : 'Add to library'}
//                       >
//                         {isResourceInLibrary(resource._id) ? (
//                           <BookmarkCheck className="w-4 h-4" />
//                         ) : (
//                           <Bookmark className="w-4 h-4" />
//                         )}
//                       </Button>
//                     </div>
//                   </Card>
//                 ))}
//               </div>

//               {resources && resources.length === 0 && (
//                 <Card className="shadow-lg rounded-2xl bg-white border border-slate-200">
//                   <CardContent className="py-12 text-center">
//                     <BookOpen className="w-16 h-16 mx-auto text-slate-400 mb-4" />
//                     <h3 className="text-xl font-semibold mb-2 text-slate-800">No resources found</h3>
//                     <p className="text-md text-slate-600 font-medium">
//                       Try adjusting your search terms or filters to find what you're looking for.
//                     </p>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Pagination */}
//               {resourcesPagination && resourcesPagination.totalPages > 1 && (
//                 <div className="flex justify-center gap-4 mt-8">
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage(currentPage - 1)}
//                     className="border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-6 rounded-2xl transition-all duration-300"
//                   >
//                     Previous
//                   </Button>
//                   <span className="flex items-center px-4 text-md font-semibold text-slate-700">
//                     Page {currentPage} of {resourcesPagination.totalPages}
//                   </span>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     disabled={currentPage === resourcesPagination.totalPages}
//                     onClick={() => setCurrentPage(currentPage + 1)}
//                     className="border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-6 rounded-2xl transition-all duration-300"
//                   >
//                     Next
//                   </Button>
//                 </div>
//               )}
//             </>
//           )}
//         </TabsContent>

//         <TabsContent value="my-library" className="space-y-6">
//           <Card className="shadow-lg rounded-2xl bg-white border border-slate-200">
//             <CardHeader className="p-6">
//               <CardTitle className="text-2xl font-bold text-slate-800">My Saved Resources</CardTitle>
//               <CardDescription className="text-md text-slate-600 font-medium">Resources you've bookmarked for easy access</CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               {libraryLoading ? (
//                 <LoadingSpinner />
//               ) : libraryError ? (
//                 <ErrorMessage error={libraryError} />
//               ) : userResources && userResources.length > 0 ? (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   {userResources?.map((userResource) => (
//                     <Card key={userResource._id} className="shadow-sm rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg bg-white border border-slate-200">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center gap-2">
//                           <div className="p-2 bg-slate-50 rounded-2xl">{getTypeIcon(userResource.resource.type)}</div>
//                           <Badge className={`text-xs font-semibold px-3 py-1 border rounded-2xl ${getCategoryColor(userResource.resource.category)}`}>
//                             {userResource.resource.category}
//                           </Badge>
//                         </div>
//                         <Badge variant="outline" className="flex items-center gap-1 text-yellow-700 bg-yellow-50 border-yellow-200 rounded-2xl">
//                           <Star className="w-3 h-3 fill-current" />
//                           {userResource.resource.averageRating?.toFixed(1) || 'N/A'}
//                         </Badge>
//                       </div>
                      
//                       <h3 className="font-bold text-xl mb-2 text-slate-800">{userResource.resource.title}</h3>
//                       <p className="text-sm text-slate-600 mb-4 line-clamp-3 font-medium">{userResource.resource.description}</p>
                      
//                       <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
//                         <div className="flex items-center gap-1">
//                           <Clock className="w-3 h-3" />
//                           <span>{userResource.resource.duration}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Eye className="w-3 h-3" />
//                           <span>{userResource.resource.views} views</span>
//                         </div>
//                       </div>
                      
//                       <div className="flex gap-3">
//                         <Button 
//                           size="sm" 
//                           className="flex-1 bg-gradient-to-r from-sky-500 to-mint-500 hover:from-sky-600 hover:to-mint-600 text-white shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 rounded-2xl font-semibold"
//                           onClick={() => handleAccessResource(userResource.resource)}
//                         >
//                           Access Resource
//                         </Button>
//                         <Button 
//                           variant="outline" 
//                           size="sm"
//                           onClick={() => handleRemoveFromLibrary(userResource.resource._id)}
//                           className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 rounded-2xl"
//                         >
//                           Remove
//                         </Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <BookOpen className="w-16 h-16 mx-auto text-slate-400 mb-4" />
//                   <h3 className="text-xl font-semibold mb-2 text-slate-800">No saved resources yet</h3>
//                   <p className="text-md text-slate-600 mb-6 font-medium">
//                     Start building your personal library by bookmarking resources that are helpful to you.
//                   </p>
//                   <Button 
//                     onClick={() => document.querySelector('[value="browse"]')?.click()}
//                     className="bg-gradient-to-r from-sky-500 to-mint-500 hover:from-sky-600 hover:to-mint-600 text-white shadow-md rounded-2xl transition-all duration-300"
//                   >
//                     Browse Resources
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <Card className="shadow-lg rounded-2xl bg-white border border-slate-200">
//         <CardHeader className="p-6">
//           <CardTitle className="text-2xl font-bold text-slate-800">Language Support</CardTitle>
//           <CardDescription className="text-md text-slate-600 font-medium">Resources available in multiple languages for cultural accessibility</CardDescription>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="text-center p-6 border-2 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-white border-sky-200 hover:border-sky-300">
//               <h4 className="font-semibold text-lg text-slate-800 mb-2">English</h4>
//               <p className="text-sm text-slate-600 font-medium">45+ resources</p>
//             </div>
//             <div className="text-center p-6 border-2 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-white border-mint-200 hover:border-mint-300">
//               <h4 className="font-semibold text-lg text-slate-800 mb-2">Hindi</h4>
//               <p className="text-sm text-slate-600 font-medium">32+ resources</p>
//             </div>
//             <div className="text-center p-6 border-2 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] bg-white border-lavender-200 hover:border-lavender-300">
//               <h4 className="font-semibold text-lg text-slate-800 mb-2">Regional Languages</h4>
//               <p className="text-sm text-slate-600 font-medium">18+ resources</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//     {showUrlPopup && (
//       <UrlPopup 
//         url={selectedResourceUrl} 
//         resource={selectedResource}
//         onClose={() => {
//           setShowUrlPopup(false);
//           setSelectedResourceUrl(null);
//           setSelectedResource(null);
//         }}
//         onPrevious={navigateToPrevious}
//         onNext={navigateToNext}
//         currentIndex={currentResourceIndex}
//         totalResources={resources?.length || 0}
//       />
//     )}
//     </div>
//   );
// };

// export default ResourceHub;
