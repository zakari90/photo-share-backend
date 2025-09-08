import express from "express";
import { likeCount, setLikeState } from "../controllers/like-controller";
import { getAllPosts, newPost } from "../controllers/post-controller";
import { login, register } from "../controllers/user-controller";
import { isLoggedIn, upload } from "../middlewares";

const router = express.Router();

router.post("/account/login", login);
router.post("/account/register", register);

router.post("/posts/create", upload.single("postImg"), isLoggedIn, newPost);
router.get("/posts", getAllPosts);

router.put("/posts/:postId/like", isLoggedIn, setLikeState);
router.get("/posts/:postId/like-count", isLoggedIn, likeCount);

export default router;
