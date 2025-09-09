import express from "express";
import { likeCount, setLikeState } from "../controllers/like-controller.js";
import { createNewPost, deleteMyPost, getAllMyPosts, getAllPosts, updateMyPost } from "../controllers/post-controller.js";
import { login, register } from "../controllers/user-controller.js";
import isLoggedIn from "../middlewares/authentication.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/account/login", login);
router.post("/account/register", register);

router.post("/posts/create", isLoggedIn, upload.single("image"), createNewPost);
router.get("/posts", getAllPosts);

router.get("/my-posts", isLoggedIn, getAllMyPosts);
router.delete("/posts/:postId/delete", isLoggedIn, deleteMyPost);
router.put("/posts/:postId/update", isLoggedIn, updateMyPost);

router.put("/posts/:postId/like", isLoggedIn, setLikeState);
router.get("/posts/:postId/like-count", isLoggedIn, likeCount);

export default router;
