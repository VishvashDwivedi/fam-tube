const constants = require("../constants");
const axios = require("axios");
const { getFormattedThumbnails, validateRequiredFields, validateDateTimeFields  } = require("./helpers");
const VideoDetails = require("../models");

const addDataToDB = async (publishedBeforeTime, publishedAfterTime, retries, pageToken) => {
    console.log(publishedBeforeTime, " ", publishedAfterTime, " ", pageToken);
    let params = {
        key: process.env.API_KEY,
        type: constants.TYPE,
        maxResults: constants.MAX_RESULTS,
        publishedAfter: publishedAfterTime.toISOString(),
        topicId: constants.TOPIC_ID,
        part: constants.PART_VALUE,
        relevanceLanguage: constants.RELEVENT_LANG,
        order: constants.ORDER,
    }
    if(pageToken)
        params.pageToken = pageToken;
    if(publishedBeforeTime)
        params.publishedBefore = publishedBeforeTime.toISOString();
    try {
        const response = await axios.get(process.env.YOUTUBE_DATA_BASE_URL, {
            params: params
        });
        const data = response.data;
        pageToken = data.nextPageToken;
        let items = data.items, bulkCreateList = [];
        console.log(" ", items.length, "\n");
        for(let item of items) {
            let id_obj = item.id || {};
            let value_obj = item.snippet || {};
            validateRequiredFields({
                videoId: id_obj.videoId, 
                title: value_obj.title, 
                published_date_time: value_obj.publishTime
            });
            validateDateTimeFields({
                published_date_time: value_obj.publishTime
            })

            bulkCreateList.push({
                videoId: id_obj.videoId,
                title: value_obj.title,
                description: value_obj.description,
                published_date_time: new Date(value_obj.publishTime),
                thumbnails: getFormattedThumbnails(value_obj.thumbnails)
            });
        }
        await VideoDetails.insertMany(bulkCreateList, {ordered: false});
        if(pageToken)
            addDataToDB(publishedBeforeTime, publishedAfterTime, constants.RETRIES, pageToken);

    } catch(e) {
        console.log(e);
        console.log(`Error message: ${String(e)}`);
        console.log(`Stack Trace: ${e}`);
        if(retries > 0)
            addDataToDB(publishedBeforeTime, publishedAfterTime, retries - 1, pageToken);
    }
};

module.exports = addDataToDB;