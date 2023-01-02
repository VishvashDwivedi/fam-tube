const constants = require("../constants");
const axios = require("axios");
const { getFormattedThumbnails, validateRequiredFields } = require("./helpers");
const { VideoDetails } = require("../models");
const { getApiKey, setNextApiKey } = require("./helpers");

const addDataToDB = async (publishedBeforeTime, publishedAfterTime, retries, pageToken) => {
    console.log(publishedBeforeTime, " ", publishedAfterTime, " ", pageToken);
    let api_key = await getApiKey();
    let params = {
        key: api_key,
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
        console.log("Items fetched: ", items.length);
        for(let item of items) {
            let id_obj = item.id || {};
            let value_obj = item.snippet || {};
            validateRequiredFields({
                videoId: id_obj.videoId, 
                title: value_obj.title, 
                published_date_time: value_obj.publishTime
            });

            bulkCreateList.push({
                videoId: id_obj.videoId,
                title: value_obj.title,
                description: value_obj.description,
                published_date_time: new Date(value_obj.publishTime),
                thumbnails: getFormattedThumbnails(value_obj.thumbnails)
            });
        }
        /* 
        Ordered true will ensure that all the non-duplicate records are inserted 
        correctly. Even if an error occurs, non erroneous records will get
        inserted.
        */
        await VideoDetails.insertMany(bulkCreateList, {ordered: false});
        if(pageToken)
            addDataToDB(publishedBeforeTime, publishedAfterTime, constants.RETRIES, pageToken);

    } catch(e) {
        // Use next key if key is expired
        if(e.response && e.response.status === 403) {
            console.log("Authorization error or maximum quota exceeded for API_KEY");
            await setNextApiKey();
            retries += 1;
        }
        else {
            console.log(`Error message: ${String(e)}`);
            console.log(`Stack Trace: ${e}`);
        }
        // Retry if the request failed and attempts are left
        if(retries > 0)
            addDataToDB(publishedBeforeTime, publishedAfterTime, retries - 1, pageToken);
    }
};

module.exports = addDataToDB;