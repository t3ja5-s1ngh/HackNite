const mongoose =require('mongoose');

const DataSchema = new mongoose.Schema({
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
        unique: true
    },
    source: {
        type: String,
        required: true,
        enum: ['reddit', '4chan', 'twitter', 'other']
    },
    keyword: {
        type: String,
        required: true
    },
    scrapedAt: {
        type: Date,
        default: Date.now
    },
    filter: {
	    type: String,
	    required:true,
	    enum: ['media','official']
    }

});

module.exports = mongoose.model('data' , DataSchema);

