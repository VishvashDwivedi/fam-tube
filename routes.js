const express = require("express");
const router = express.Router();
const VideoDetails = require("./models");
const { sendResponse } = require("./utils/helpers");
const { validatePageAndPageSize, validateTitleAndDesc } = require("./utils/middlewares");

router.get("/fam-tube/get-videos/", validatePageAndPageSize, async (req, res) => {
    let page = req.query.page;
    let page_size = req.query.page_size;
    let results = await VideoDetails.find({})
        .select(["-_id", "-created_at", "-updated_at", "-__v"])
        .skip(page*page_size)
        .limit(page_size)
        .sort("-published_date_time")

    return res.json(
        sendResponse("Sucess!", results)
    );
});

router.get("/fam-tube/search/", validateTitleAndDesc, async (req, res) => {
    const searchList = {};
    if(req.query.title)
        searchList.title = req.query.title;
    if(req.query.description)
        searchList.description = req.query.description;
    let results = await VideoDetails.find(searchList);

    return res.json(
        sendResponse("Success!", results)
    );
});


module.exports = router;