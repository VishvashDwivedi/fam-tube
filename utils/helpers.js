// Helper functions
const validator = require("validator");
const { Constants } = require("../models");

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

const getApiKey = async () => {
    let all_api_keys = JSON.parse(process.env.API_KEYS);
    let api_key_index = await Constants.findOne({ name: "api_key_index" });
    let total_api_keys = await Constants.findOne({ name: "total_api_keys" });
    if(api_key_index.value < total_api_keys.value)
        return all_api_keys[api_key_index.value];
    return "";
}

const setNextApiKey = async () => {
    let api_key_index = await Constants.findOne({ name: "api_key_index" });
    let total_api_keys = await Constants.findOne({ name: "total_api_keys" });
    if(api_key_index.value < total_api_keys.value) {
        api_key_index.value += 1;
        await api_key_index.save();
    }
}

module.exports = {
    getFormattedThumbnails,
    validateRequiredFields,
    validateDateTimeFields,
    sendResponse,
    getApiKey,
    setNextApiKey
}