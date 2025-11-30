import Resource from "../models/resourceModel.js";
import UserResource from "../models/userResourceModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Create a new resource (Admin only)
export const createResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.create(req.body);
  
  

  res.status(201).json({
    status: "success",
    data: resource
  });
});

// Get all resources with filtering, searching, and pagination
export const getAllResources = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = { isActive: true };
  
  if (req.query.category && req.query.category !== 'all') {
    filter.category = req.query.category;
  }
  
  if (req.query.type && req.query.type !== 'all') {
    filter.type = req.query.type;
  }
  
  if (req.query.resourceLanguage && req.query.resourceLanguage !== 'all') {
    filter.resourceLanguage = req.query.resourceLanguage;
  }
  
  if (req.query.difficulty && req.query.difficulty !== 'all') {
    filter.difficulty = req.query.difficulty;
  }

  if (req.query.expertise && req.query.expertise !== 'all') {
    filter.expertise = req.query.expertise;
  }

  // Build search query
  let searchQuery = {};
  if (req.query.search) {
    searchQuery = {
      $or: [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ]
    };
  }

  // Combine filters and search
  const finalFilter = { ...filter, ...searchQuery };

  // Execute query
  const resources = await Resource.find(finalFilter)
    .sort({ isFeatured: -1, publishDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('ratings.userId', 'firstName lastName');

  // Get total count for pagination
  const total = await Resource.countDocuments(finalFilter);

  // Calculate pagination info
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    status: "success",
    results: resources.length,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      hasNextPage,
      hasPrevPage,
      limit
    },
    data: resources
  });
});

// Get featured resources
export const getFeaturedResources = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const featuredResources = await Resource.find({ 
    isFeatured: true, 
    isActive: true 
  })
  .sort({ publishDate: -1 })
  .limit(limit)
  .populate('ratings.userId', 'firstName lastName');

  res.status(200).json({
    status: "success",
    results: featuredResources.length,
    data: featuredResources
  });
});

// Get resource by ID
export const getResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id)
    .populate('ratings.userId', 'firstName lastName');

  if (!resource) {
    return next(new AppError("Resource not found", 404));
  }

  // Increment view count
  await resource.incrementViews();


  res.status(200).json({
    status: "success",
    data: resource
  });
});

// Update resource (Admin only)
export const updateResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!resource) {
    return next(new AppError("Resource not found", 404));
  }

  
  res.status(200).json({
    status: "success",
    data: resource
  });
});

// Delete resource (Admin only)
export const deleteResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);

  if (!resource) {
    return next(new AppError("Resource not found", 404));
  }

  

  res.status(200).json({
    status: "success",
    message: "Resource deleted successfully",
    data: null
  });
});

// Rate a resource
export const rateResource = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  // Check profile completion status
  const profileStatus = req.profileStatus;
  if (!profileStatus?.isComplete) {
    return next(new AppError('Please complete your profile to rate resources', 403, 'PROFILE_INCOMPLETE'));
  }

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  // Check if resource exists
  const resource = await Resource.findById(id);
  if (!resource) {
    return next(new AppError('Resource not found', 404));
  }

  // Check if user has already rated this resource
  const existingRating = resource.ratings.find(r => r.userId.toString() === userId.toString());
  
  if (existingRating) {
    // Update existing rating
    existingRating.rating = rating;
    existingRating.comment = comment || existingRating.comment;
    existingRating.updatedAt = new Date();
  } else {
    // Add new rating
    resource.ratings.push({
      userId,
      rating,
      comment,
      createdAt: new Date()
    });
  }

  // Recalculate average rating
  const totalRating = resource.ratings.reduce((sum, r) => sum + r.rating, 0);
  resource.averageRating = totalRating / resource.ratings.length;
  resource.totalRatings = resource.ratings.length;

  await resource.save();



  res.status(200).json({
    status: "success",
    message: "Resource rated successfully",
    data: {
      resource
    }
  });
});

// Save resource to user library
export const saveResource = catchAsync(async (req, res, next) => {
  const { resourceId } = req.body;
  const userId = req.user._id;

  // Check profile completion status
  const profileStatus = req.profileStatus;
  if (!profileStatus?.isComplete) {
    return next(new AppError('Please complete your profile to save resources to your library', 403, 'PROFILE_INCOMPLETE'));
  }

  // Check if resource exists
  const resource = await Resource.findById(resourceId);
  if (!resource) {
    return next(new AppError('Resource not found', 404));
  }

  // Check if already saved
  const existingSave = await UserResource.findOne({ user: userId, resource: resourceId });
  if (existingSave) {
    return next(new AppError('Resource already saved to your library', 400));
  }

  // Save to library
  const userResource = await UserResource.create({
    user: userId,
    resource: resourceId,
    savedAt: new Date()
  });
  
  res.status(201).json({
    status: "success",
    message: "Resource saved to library successfully",
    data: {
      userResource
    }
  });
});

// Get user's library
export const getUserLibrary = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Check profile completion status
  const profileStatus = req.profileStatus;
  if (!profileStatus?.isComplete) {
    return next(new AppError('Please complete your profile to access your resource library', 403, 'PROFILE_INCOMPLETE'));
  }

  const userResources = await UserResource.find({ user: userId })
    .populate({
      path: 'resource',
      populate: {
        path: 'ratings.userId',
        select: 'firstName lastName'
      }
    })
    .sort({ savedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await UserResource.countDocuments({ user: userId });
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: "success",
    results: userResources.length,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    },
    data: userResources
  });
});

// Remove resource from library
export const removeFromLibrary = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Check profile completion status
  const profileStatus = req.profileStatus;
  if (!profileStatus?.isComplete) {
    return next(new AppError('Please complete your profile to manage your resource library', 403, 'PROFILE_INCOMPLETE'));
  }

  const userResource = await UserResource.findOneAndDelete({
    user: userId,
    resource: req.params.resourceId
  });

  if (!userResource) {
    return next(new AppError("Resource not found in your library", 404));
  }

 
  res.status(200).json({
    status: "success",
    message: "Resource removed from library successfully"
  });
});

// Update user resource (progress, notes, etc.)
export const updateUserResource = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Check profile completion status
  const profileStatus = req.profileStatus;
  if (!profileStatus?.isComplete) {
    return next(new AppError('Please complete your profile to manage your resource library', 403, 'PROFILE_INCOMPLETE'));
  }

  const userResource = await UserResource.findOneAndUpdate(
    {
      user: userId,
      resource: req.params.resourceId
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!userResource) {
    return next(new AppError("Resource not found in your library", 404));
  }

  res.status(200).json({
    status: "success",
    data: userResource
  });
});

// Mark resource as downloaded
export const markAsDownloaded = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Check profile completion status
  const profileStatus = req.profileStatus;
  if (!profileStatus?.isComplete) {
    return next(new AppError('Please complete your profile to download resources', 403, 'PROFILE_INCOMPLETE'));
  }

  const userResource = await UserResource.findOne({
    user: userId,
    resource: req.params.resourceId
  });

  if (!userResource) {
    return next(new AppError("Resource not found in your library", 404));
  }

  await userResource.markAsDownloaded();

  // Also increment download count on the resource
  const resource = await Resource.findById(req.params.resourceId);
  if (resource) {
    await resource.incrementDownloads();
  }


  res.status(200).json({
    status: "success",
    message: "Resource marked as downloaded"
  });
});

// Get resource statistics
export const getResourceStats = catchAsync(async (req, res, next) => {
  const [
    totalResources,
    totalCategories,
    totalLanguages,
    categoryStats,
    languageStats,
    typeStats
  ] = await Promise.all([
    Resource.countDocuments({ isActive: true }),
    Resource.distinct('category'),
    Resource.distinct('resourceLanguage'),
    Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$resourceLanguage", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ]);

  res.status(200).json({
    status: "success",
    data: {
      totalResources,
      totalCategories: totalCategories.length,
      totalLanguages: totalLanguages.length,
      categories: categoryStats,
      languages: languageStats,
      types: typeStats
    }
  });
});
