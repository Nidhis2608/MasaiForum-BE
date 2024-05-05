const { auth, isPostOwner } = require("../middleware/auth.middleware");
const {PostModel} = require("../model/post.model");
const express = require('express')



const postRoute=express.Router();


//Get all post
postRoute.get('/posts',async(req,res)=>{
    try {
        const posts = await PostModel.find().populate('user_id', 'username avatar');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//Create a new post
postRoute.post("/posts",auth,async(req,res)=>{
    const { title, content, category, media } = req.body;
    try {
        const newPost = new PostModel({
            user_id: req.user._id,
            title,
            content,
            category,
            media
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


//Update a post
postRoute.patch('/:post_id',auth,isPostOwner,async(req,res)=>{
    try {
        const post = await PostModel.findOneAndUpdate(
            { _id: req.params.post_id, user_id: req.user._id },
            req.body,
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: "No post found or you're not the owner" });
        }
        res.status(204).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//Delete a post
postRoute.delete('/:post_id',auth,isPostOwner,async(req,res)=>{
    try {
        const post = await PostModel.findOneAndDelete({ _id: req.params.post_id, user_id: req.user._id });
        if (!post) {
            return res.status(404).json({ message: "No post found or you're not the owner" });
        }
        res.status(202).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//Like a post
// postRoute.post('/:post_id/like', auth,async(req,res)=>{
//     try {
//         const post = await PostModel.findById(req.params.post_id);
//         if (!post.likes.includes(req.user._id)) {
//             post.likes.push(req.user._id);
//             await post.save();
//             res.status(201).json({ message: 'You liked the post' });
//         } else {
//             res.status(400).json({ message: 'You already liked this post' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// })

postRoute.post('/api/posts/:post_id/like', auth, async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.post_id);
      const userId = req.user._id;
      const index = post.likes.indexOf(userId);
  
      if (index === -1) {
        post.likes.push(userId);
        await post.save();
        res.json({ liked: true, message: 'Post liked!' });
      } else {
        post.likes.splice(index, 1);
        await post.save();
        res.json({ liked: false, message: 'Like removed!' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

//Comment on a post
// postRoute.post('/:post_id/comment',auth,async(req,res)=>{
//     const { comment } = req.body;
//     try {
//         const post = await PostModel.findById(req.params.post_id);
//         post.comments.push({ user_id: req.user._id, comment });
//         await post.save();
//         res.status(201).json({ message: 'Comment added' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// })

// In post.routes.js
postRoute.post('/:post_id/comment', auth, async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.post_id);
        const { comment } = req.body;
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.comments.push({ user_id: req.user._id, comment });
        await post.save();
        res.status(201).json({ message: 'Comment added', commentCount: post.comments.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





module.exports = {
    postRoute
}