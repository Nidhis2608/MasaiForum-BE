const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, maxlength: 100 },
    category: { type: String, enum: ['Development', 'Design', 'Innovation', 'Tutorial', 'Business'], required: true },
    content: { type: String, required: true },
    media: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        created_at: { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now }
});

const PostModel = mongoose.model('Post', postSchema);
module.exports = {
    PostModel
};
