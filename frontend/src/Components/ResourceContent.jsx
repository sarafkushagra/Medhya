import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import {
    BookOpen, Brain, Heart, MessageCircle, TrendingUp, Users, Target,
    ExternalLink, Clock, Eye, Play, Headphones, Star, ChevronLeft, ChevronRight,
    AlertTriangle, RefreshCw, Globe, Loader2
} from 'lucide-react';
import { useResources } from '../hooks/useResources.js';

const ResourceContent = () => {
    const [currentResourceIndex, setCurrentResourceIndex] = useState(0);
    const [iframeError, setIframeError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef(null);

    const { resources, loading, error, getResources } = useResources();

    useEffect(() => {
        const fetchResources = async () => {
            try {
                console.log('🔧 ResourceContent: Starting to fetch all resources...');
                const result = await getResources({}, 1, 12); // Get all resources, page 1, limit 12
                console.log('✅ ResourceContent: Fetched resources:', result);
            } catch (err) {
                console.error('❌ ResourceContent: Error fetching resources:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []); // Empty dependency array to prevent infinite re-renders

    const currentResource = resources[currentResourceIndex];

    const navigateToPrevious = () => {
        setCurrentResourceIndex((prevIndex) =>
            prevIndex === 0 ? resources.length - 1 : prevIndex - 1
        );
        setIframeError(false);
        setIsLoading(true);
    };

    const navigateToNext = () => {
        setCurrentResourceIndex((prevIndex) =>
            prevIndex === resources.length - 1 ? 0 : prevIndex + 1
        );
        setIframeError(false);
        setIsLoading(true);
    };

    const handleIframeLoad = () => {
        setIsLoading(false);
        setIframeError(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setIframeError(true);
    };

    const openInNewTab = () => {
        window.open(currentResource.url.replace('/embed/', '/watch?v='), '_blank');
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <Play className="w-4 h-4" />;
            case 'audio': return <Headphones className="w-4 h-4" />;
            case 'article': return <BookOpen className="w-4 h-4" />;
            default: return <ExternalLink className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            anxiety: 'bg-red-100 text-red-700 border-red-200',
            depression: 'bg-purple-100 text-purple-700 border-purple-200',
            stress: 'bg-orange-100 text-orange-700 border-orange-200',
            sleep: 'bg-green-100 text-green-700 border-green-200',
            relationships: 'bg-pink-100 text-pink-700 border-pink-200',
            academic: 'bg-blue-100 text-blue-700 border-blue-200',
            mindfulness: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            'self-care': 'bg-teal-100 text-teal-700 border-teal-200',
            crisis: 'bg-red-100 text-red-700 border-red-200',
            general: 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Show loading state while fetching resources
    if (loading && resources.length === 0) {
        return (
            <div className="space-y-6">
                <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-indigo-800">
                                    Mental Health Resources
                                </CardTitle>
                                <CardDescription className="text-indigo-700">
                                    Loading resources...
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card className="border-2 border-gray-200">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                                <p className="text-lg text-gray-600">Loading mental health resources...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show error state if fetching failed
    if (error && resources.length === 0) {
        return (
            <div className="space-y-6">
                <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-indigo-800">
                                    Mental Health Resources
                                </CardTitle>
                                <CardDescription className="text-indigo-700">
                                    Unable to load resources
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card className="border-2 border-red-200">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="text-center">
                                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Error Loading Resources
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {error}
                                </p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show message if no resources available
    if (resources.length === 0) {
        return (
            <div className="space-y-6">
                <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                            <div>
                                <CardTitle className="text-2xl font-bold text-indigo-800">
                                    Mental Health Resources
                                </CardTitle>
                                <CardDescription className="text-indigo-700">
                                    No resources available
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card className="border-2 border-gray-200">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="text-center">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    No Resources Available
                                </h3>
                                <p className="text-gray-600">
                                    There are currently no featured resources available. Please check back later.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">


            {/* Resource Content Display */}
            <Card className="border-2 border-gray-200">
                <CardContent className="p-0">
                    {/* Resource Info Bar */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                {getTypeIcon(currentResource?.type)}
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                    {currentResource?.type}
                                </span>
                            </div>
                            <Badge className={`text-xs font-semibold px-2 py-1 border ${getCategoryColor(currentResource?.category)}`}>
                                {currentResource?.title}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={navigateToPrevious}
                                disabled={resources.length <= 1}
                                className="flex items-center gap-2 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700 rounded-2xl transition-all duration-300 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-indigo-200">
                                <span className="text-sm font-medium text-indigo-700">
                                    {currentResourceIndex + 1} / {resources.length}
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={navigateToNext}
                                disabled={resources.length <= 1}
                                className="flex items-center gap-2 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700 rounded-2xl transition-all duration-300 disabled:opacity-50"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Embedded Content */}
                    <div className="relative">
                        {iframeError ? (
                            /* Error Fallback UI */
                            <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                                <div className="text-center p-8 max-w-md">
                                    <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Content Unavailable
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        This resource cannot be displayed directly due to security restrictions from the source website.
                                    </p>
                                    <div className="space-y-3">
                                        <Button
                                            onClick={openInNewTab}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Open in New Tab
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIframeError(false);
                                                setIsLoading(true);
                                                // Force reload by changing key
                                                if (iframeRef.current) {
                                                    iframeRef.current.src = iframeRef.current.src;
                                                }
                                            }}
                                            className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                                        <div className="text-center">
                                            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Loading content...</p>
                                        </div>
                                    </div>
                                )}

                                {currentResource?.type === 'video' ? (
                                    <div className="w-full h-[600px]">
                                        <iframe
                                            ref={iframeRef}
                                            src={currentResource?.url}
                                            className="w-full h-full border-0"
                                            title={currentResource?.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            onLoad={handleIframeLoad}
                                            onError={handleIframeError}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-[600px]">
                                        <iframe
                                            ref={iframeRef}
                                            src={currentResource?.url}
                                            className="w-full h-full border-0"
                                            title={currentResource?.title}
                                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                                            onLoad={handleIframeLoad}
                                            onError={handleIframeError}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            
        </div>
    );
};

export default ResourceContent;
