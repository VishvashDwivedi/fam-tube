const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(
    "mongodb://localhost:27017/fampay", {
        useUnifiedTopology: true,
    }, err => {
        if(err)
            throw new Error(`DB did not connect successfully, Err=${err}`)
        else
            console.log("DB successfully connected!");
    }
);
