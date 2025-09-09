import fs from "node:fs/promises";
import path from "node:path";
import Like from "../models/like.js";
import Post from "../models/post.js";

export async function deleteMyPost(req, res) {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({ _id: postId, creator: req.currentUser.id });

    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    const imgPath = path.join(process.cwd(), "uploads", post.imageUrl);
    try {
      await fs.unlink(imgPath);
    }
    catch (err) {
      console.warn("Image file not found or already deleted:", err.message);
    }

    await Like.deleteMany({ postId });

    await Post.deleteOne({ _id: postId });

    res.status(200).json({ message: "Post deleted" });
  }
  catch (e) {
    console.error("Error deleting post:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
}

export async function createNewPost(req, res) {
  console.log("***************************************************");
  console.log("Request Body:", req.body);
  console.log("Request File:", req.file);
  console.log("Current User:", req.currentUser);
  console.log("***************************************************");

  const { title, description } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    await Post.create({
      title,
      imageUrl: `/public/images/${req.file.filename}`,
      description,
      creator: req.currentUser.id,
    });

    return res.status(200).json({ message: "Post created successfully." });
  }
  catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate("creator").lean();
    return res.status(200).json(posts);
  }
  catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Failed to fetch posts." });
  }
}

// export async function getPost(req, res) {
//   try {
//     const posts = await Post.findOne().populate("creator").lean();
//     return res.status(200).json(posts);
//   }
//   catch (e) {
//     res.status(500).json(e);
//   }
// }
// export async function getMyPost(req, res) {
//   try {
//     const myPost = await models.Post.findOne({
//       where: {
//         UserId: req.currentUser.id,
//         id: req.params.postId,
//       },
//     });
//     res.status(200).json(myPost);
//   }
//   catch (e) {
//     res.status(500).json(e);
//   }
// }
export async function getAllMyPosts(req, res) {
  try {
    const myPosts = await Post.find({ creator: req.currentUser.id }).sort({ createdAt: -1 });

    res.status(200).json(myPosts);
  }
  catch (e) {
    console.error("Error fetching posts:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
}

export async function updateMyPost(req, res) {
  const { title, description } = req.body;

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId, creator: req.currentUser.id },
      { title, description },
      { new: true }, // Return updated doc
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    res.status(200).json({ message: "تم التعديل على بيانات المنشور", post: updatedPost });
  }
  catch (e) {
    console.error("Error updating post:", e);
    res.status(500).json({ message: "Server error", error: e.message });
  }
}
