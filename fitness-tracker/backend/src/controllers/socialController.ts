import { Request, Response } from 'express';
import FeedPost from '../models/FeedPost';
import FeedComment from '../models/FeedComment';
import Achievement from '../models/Achievement';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get feed posts
// @route   GET /api/social/feed
// @access  Private
export const getFeedPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const posts = await FeedPost.findAndCountAll({
      where: {
        isPublic: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      posts: posts.rows,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(posts.count / limit),
        totalPosts: posts.count
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's own posts
// @route   GET /api/social/posts
// @access  Private
export const getUserPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await FeedPost.findAll({
      where: {
        userId: req.user?.id
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new post
// @route   POST /api/social/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, mediaUrls, isPublic } = req.body;

    const post = await FeedPost.create({
      userId: req.user?.id,
      content,
      mediaUrls,
      isPublic
    });

    // Include user information
    const postWithUser = await FeedPost.findByPk(post.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json(postWithUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a post
// @route   PUT /api/social/posts/:id
// @access  Private
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, mediaUrls, isPublic } = req.body;

    const post = await FeedPost.findByPk(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if post belongs to logged in user
    if (post.userId !== req.user?.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    post.content = content || post.content;
    post.mediaUrls = mediaUrls !== undefined ? mediaUrls : post.mediaUrls;
    post.isPublic = isPublic !== undefined ? isPublic : post.isPublic;

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/social/posts/:id
// @access  Private
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await FeedPost.findByPk(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if post belongs to logged in user
    if (post.userId !== req.user?.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await post.destroy();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get comments for a post
// @route   GET /api/social/posts/:id/comments
// @access  Public
export const getPostComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comments = await FeedComment.findAll({
      where: {
        postId: req.params.id
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/social/posts/:id/comments
// @access  Private
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;

    // Check if post exists
    const post = await FeedPost.findByPk(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const comment = await FeedComment.create({
      userId: req.user?.id,
      postId: parseInt(req.params.id),
      content
    });

    // Increment comments count on the post
    await post.increment('commentsCount');

    // Include user information
    const commentWithUser = await FeedComment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user achievements
// @route   GET /api/social/achievements
// @access  Private
export const getUserAchievements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const achievements = await Achievement.findAll({
      where: {
        userId: req.user?.id
      },
      order: [['achievedAt', 'DESC']]
    });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get leaderboard
// @route   GET /api/social/leaderboard
// @access  Private
export const getLeaderboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get users with their total workout counts
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: FeedPost,
          as: 'feedPosts',
          attributes: [],
          where: {
            isPublic: true
          },
          required: false
        }
      ],
      group: ['User.id'],
      order: [[FeedPost, 'createdAt', 'DESC']]
    });

    // Format the response
    const leaderboard = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      postsCount: user.feedPosts?.length || 0
    })).sort((a: any, b: any) => b.postsCount - a.postsCount);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};