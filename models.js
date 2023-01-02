require("./utils/connect_db");
const mongoose = require("mongoose");
var validator = require("validator");
const { THUMBNAIL_QUALITY } = require("./constants");

const VideoDetailsSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        minLength: 3,
        maxLength: 120,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    published_date_time: {
        type: Date,
        index: true,
        required: true,
    },
    thumbnails: [{
        url: {
            type: String,
            required: true,
            default: "https://drive.google.com/file/d/1FQtizIj1W174N4msRzm0uKca8ro6Y0Ci/view?usp=share_link",
            validate: {
                validator: val => validator.isURL(val),
                message: "Not a valid URL"
            }    
        },
        quality: {
            type: String,
            required: true,
            enum: THUMBNAIL_QUALITY.ALL_QUALITIES
        }
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

VideoDetailsSchema.pre("save", next => {
    const obj = this;
    obj.updated_at = Date.now();
    next();
});

VideoDetailsSchema.index({ title:1, description: 1 });

const VideoDetails = mongoose.model("VideoDetails", VideoDetailsSchema);

// VideoDetails.create(
//     {
//         "title": "fjrf",
//         "description": "gkjehgker",
//         "published_date_time": Date.now(),
//         "videoId": "eivfjiej",
//         "thumbnails": [{
//             "url": "https://youtb.com",
//             "quality": "high"
//         }]
//     }
// );

module.exports = VideoDetails;