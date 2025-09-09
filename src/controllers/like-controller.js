import Like from "../models/like.js";

export async function setLikeState(req, res) {
  try {
    const { id: userId } = req.currentUser;
    const { postId } = req.params;

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await Like.deleteOne({ user: userId, post: postId });
      return res.status(200).json({ message: "Like removed" });
    }
    else {
      await Like.create({ user: userId, post: postId });
      return res.status(200).json({ message: "Like added" });
    }
  }
  catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function likeCount(req, res) {
  try {
    const { id: userId } = req.currentUser;
    const { postId } = req.params;

    const [likes, userLiked] = await Promise.all([
      Like.countDocuments({ post: postId }),
      Like.exists({ user: userId, post: postId }),
    ]);

    return res.status(200).json({
      likes,
      userLiked: Boolean(userLiked),
    });
  }
  catch (error) {
    console.error("Error getting like count:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
