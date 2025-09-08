import Post from "../models/post.js";

export async function newPost(req, res) {
  const { title, description } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "لا يوجد ملف لتحميله" });
    }
    await Post.create({
      title,
      img_url: `/public/images/${req.file.filename}`,
      description,
      creator: req.currentUser.id,
    });

    res.status(200).json({ message: "تم إضافة منشور جديد" });
  }
  catch (e) {
    res.status(500).json(e);
  }
}

export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().populate("creator").lean();
    return res.status(200).json(posts);
  }
  catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      message: "Failed to fetch posts",
    });
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

// export async function getAllMyPosts(req, res) {
//   try {
//     const myPosts = await models.Post.findAll({
//       where: { UserId: req.currentUser.id },
//       include: [
//         {
//           model: models.Post_Image,
//         },
//       ],
//     });
//     res.status(200).json(myPosts);
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

// export async function updateMyPost(req, res) {
//   const { title, contents, steps } = req.body;
//   try {
//     await models.Post.update(
//       {
//         title,
//         contents,
//         steps,
//       },
//       {
//         where: {
//           id: req.params.postId,
//           UserId: req.currentUser.id,
//         },
//       },
//     );
//     res.status(200).json({
//       message: "تم التعديل على بيانات المنشور",
//     });
//   }
//   catch (e) {
//     res.status(500).json(e);
//   }
// }

// export async function deleteMyPost(req, res) {
//   const { postId } = req.body;
//   try {
//     const images = await models.Post_Image.findAll({ where: { PostId: postId } });
//     await Promise.all(
//       images.map(img => fs.unlink(`.${img.img_uri}`)),
//     );

//     // await models.Post_Image.findAll({
//     //   where: { PostId: postId },
//     // }).then((res) => {
//     //   res.forEach((img) => {
//     //     fs.unlink(`.${img.img_uri}`, (err) => {
//     //       if (err)
//     //         throw err;
//     //     });
//     //   });
//     // });
//     await models.Post_Image.destroy({
//       where: { PostId: postId },
//     });
//     await models.Comment.destroy({
//       where: { PostId: postId },
//     });
//     await models.Like.destroy({
//       where: { PostId: postId },
//     });
//     await models.Post.destroy({
//       where: { id: postId, UserId: req.currentUser.id },
//     });
//     res.status(200).json({ message: "تم حذف منشورك" });
//   }
//   catch (e) {
//     console.warn(e);
//     res.status(500).json(e);
//   }
// }
