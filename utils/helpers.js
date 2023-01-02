// Helper functions
const validator = require("validator");

const getFormattedThumbnails = (data) => {
    let thumbnails = [];
    for(let [quality, url_obj] of Object.entries(data)) {
        thumbnails.push({
            "url": url_obj.url,
            "quality": quality
        });
    }
    return thumbnails;
}

const validateRequiredFields = (data) => {
    for(let [key, value] of Object.entries(data))
        if(!value)
            throw new Error(`${key} not found`)
}

const validateDateTimeFields = (data) => {
    for(let [key, value] of Object.entries(data))
        if(!value)
            throw new Error(`${key} not found`)        
}

const sendResponse = (message, data) => {
    return {
        response_string: message,
        response_data: data || []
    };
}

module.exports = {
    getFormattedThumbnails,
    validateRequiredFields,
    validateDateTimeFields,
    sendResponse
}