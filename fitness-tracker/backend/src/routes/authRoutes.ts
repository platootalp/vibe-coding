import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { googleOAuth, appleOAuth, wechatOAuth } from '../controllers/oauthController';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/oauth/google').post(googleOAuth);
router.route('/oauth/apple').post(appleOAuth);
router.route('/oauth/wechat').post(wechatOAuth);

export default router;