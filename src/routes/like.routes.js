import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers.js";

const router = Router();

router.use(verifyJWT)

router.route('/toggle/v/:videoId').patch(toggleVideoLike)
router.route('/toggle/c/:commentId').patch(toggleCommentLike)
router.route('/toggle/t/:tweetId').patch(toggleTweetLike)
router.route('/videos').get(getLikedVideos)

export default router