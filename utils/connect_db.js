const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(
    "mongodb://mongo:27017/fam-mongo", {
        useUnifiedTopology: true,
    }, err => {
        if(err)
            throw new Error(`DB did not connect successfully, Err=${err}`)
        else
            console.log("DB successfully connected!");
    }
);
