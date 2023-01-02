require("dotenv").config();
const express = require("express");
const app = express();
require("./utils/connect_db");
const addDataToDB = require("./utils/async_tasks");
const allRoutes = require("./routes");
const constants = require("./constants");
const { VideoDetails } = require("./models");

setInterval(() => {
    const published_after = new Date();
    published_after.setHours(published_after.getHours() - 24);
    const published_before = new Date(published_after);
    published_before.setSeconds(published_before.getSeconds() + constants.API_CALL_INTERVAL_TIME);
    addDataToDB(published_before, published_after, constants.RETRIES);
}, constants.API_CALL_INTERVAL_TIME*1000);

try {
    app.use(allRoutes);
} catch(e) {
    console.log(e);
}

app.listen(process.env.PORT, () => {
    console.log("Server is running!");
});