TYPE="video"
MAX_RESULTS=30
// reference for topic_id: https://youtubemarketingtools.com/youtube-topic-ids-what-are-they-and-why-do-they-matter/
TOPIC_ID="/m/06ntj"     // genre: sports
PART_VALUE="snippet"
RELEVENT_LANG="en"
ORDER="date"
API_CALL_INTERVAL_TIME=30 // in seconds
RETRIES=4
MAX_PAGE_SIZE=30

THUMBNAIL_QUALITY = {
    HIGH: "high",
    DEFAULT: "default",
    MEDIUM: "medium",
    ALL_QUALITIES: ["high", "default", "medium"]
}

module.exports = {
    TYPE,
    MAX_RESULTS,
    TOPIC_ID,
    PART_VALUE,
    RELEVENT_LANG,
    ORDER,
    API_CALL_INTERVAL_TIME,
    RETRIES,
    THUMBNAIL_QUALITY,
    MAX_PAGE_SIZE
}