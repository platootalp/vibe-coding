import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { socialAPI } from '../services/api';

// Define types
interface FeedPost {
  id: number;
  userId: number;
  content: string;
  mediaUrls?: string[];
  likesCount: number;
  commentsCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface FeedComment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface Achievement {
  id: number;
  userId: number;
  name: string;
  description: string;
  iconUrl?: string;
  achievedAt: string;
  createdAt: string;
}

interface LeaderboardUser {
  id: number;
  name: string;
  email: string;
  postsCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalPosts: number;
}

interface FeedPostsResponse {
  posts: FeedPost[];
  pagination: Pagination;
}

interface PostCommentsResponse {
  postId: string;
  comments: FeedComment[];
}

interface SocialState {
  feedPosts: FeedPost[];
  userPosts: FeedPost[];
  achievements: Achievement[];
  leaderboard: LeaderboardUser[];
  currentPostComments: FeedComment[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalPosts: number;
  };
}

// Initial state
const initialState: SocialState = {
  feedPosts: [],
  userPosts: [],
  achievements: [],
  leaderboard: [],
  currentPostComments: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalPosts: 0,
  },
};

// Async thunks
export const fetchFeedPosts = createAsyncThunk(
  'social/fetchFeedPosts',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await socialAPI.getFeedPosts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feed posts');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'social/fetchUserPosts',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await socialAPI.getUserPosts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'social/createPost',
  async (postData: Partial<FeedPost>, { rejectWithValue }) => {
    try {
      const response = await socialAPI.createPost(postData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'social/updatePost',
  async ({ id, postData }: { id: string; postData: Partial<FeedPost> }, { rejectWithValue }) => {
    try {
      const response = await socialAPI.updatePost(id, postData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'social/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await socialAPI.deletePost(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const fetchPostComments = createAsyncThunk(
  'social/fetchPostComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await socialAPI.getPostComments(postId);
      return { postId, comments: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'social/addComment',
  async ({ postId, content }: { postId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await socialAPI.addComment(postId, { content });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const fetchUserAchievements = createAsyncThunk(
  'social/fetchUserAchievements',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await socialAPI.getUserAchievements();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch achievements');
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'social/fetchLeaderboard',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await socialAPI.getLeaderboard();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

const socialSlice = createSlice({
  name: '@@app/social',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPostComments: (state) => {
      state.currentPostComments = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch feed posts
    builder
      .addCase(fetchFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.feedPosts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFeedPosts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userPosts.unshift(action.payload);
        state.feedPosts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const index = state.userPosts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.userPosts[index] = action.payload;
        }
        
        const feedIndex = state.feedPosts.findIndex(post => post.id === action.payload.id);
        if (feedIndex !== -1) {
          state.feedPosts[feedIndex] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userPosts = state.userPosts.filter(post => post.id.toString() !== action.payload);
        state.feedPosts = state.feedPosts.filter(post => post.id.toString() !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch post comments
      .addCase(fetchPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentPostComments = action.payload.comments;
      })
      .addCase(fetchPostComments.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentPostComments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user achievements
      .addCase(fetchUserAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchUserAchievements.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPostComments } = socialSlice.actions;
export default socialSlice.reducer;