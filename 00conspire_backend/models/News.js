const mongoose =require('mongoose');

const NewsSchema = new mongoose.Schema({
	title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true // This is the MVP's "Anti-Duplicate" shield
    },
    source: {
        type: String,
        required: true,
        enum: ['reddit', '4chan', 'twitter', 'other'] // Limits to these options
    },
    keyword: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'unconfirmed',
        enum: ['unconfirmed', 'confirmed', 'rumor']
    },
    scrapedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('News' , NewsSchema);

