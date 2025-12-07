import express from 'express';
import {
  getFeedPosts,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  getPostComments,
  addComment,
  getUserAchievements,
  getLeaderboard
} from '../controllers/socialController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Feed posts
router.route('/feed')
  .get(protect, getFeedPosts);

// User posts
router.route('/posts')
  .get(protect, getUserPosts)
  .post(protect, createPost);

router.route('/posts/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Post comments
router.route('/posts/:id/comments')
  .get(getPostComments)
  .post(protect, addComment);

// User achievements
router.route('/achievements')
  .get(protect, getUserAchievements);

// Leaderboard
router.route('/leaderboard')
  .get(protect, getLeaderboard);

export default router;