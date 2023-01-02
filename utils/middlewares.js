const { MAX_PAGE_SIZE } = require("../constants");
const { sendResponse } = require("./helpers");

const validatePageAndPageSize = (req, res, next) => {
    let page = req.query.page;
    let page_size = req.query.page_size;

    // If page exists but is not an integer or is less than 0
    if(page && ((!parseInt(page)) || parseInt(page) <= 0))
        return res.status(400).json(
            sendResponse("Invalid page, must be an integer greater than 1!")
        );
    else
        req.query.page = (page ? parseInt(page)-1: 0);

    // If page_size exists but is not an integer or is less than 0
    if(page_size && ((!parseInt(page_size)) || parseInt(page_size) <= 0))
        return res.status(400).json(
            sendResponse("Invalid page_size, must be an integer greater than 1!")
        );
    else
        req.query.page_size = (
            page_size ? Math.min(parseInt(page_size), MAX_PAGE_SIZE) : MAX_PAGE_SIZE
        );
    next();
}

const validateTitleAndDesc = (req, res, next) => {
    let title = req.query.title || "";
    let description = req.query.description || "";
    if(!(title || description))
        return res.status(400).json(
            sendResponse("At least one of title and description should be true")
        );
    if(title)
        req.query.title = title.trim();
    if(description)
        req.query.description = description.trim();
    next();
}

module.exports = {
    validatePageAndPageSize,
    validateTitleAndDesc
}