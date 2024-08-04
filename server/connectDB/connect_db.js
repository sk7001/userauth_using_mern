const mongoose = require("mongoose")

const connect_db = () => {
    return mongoose.connect(process.env.db_url).then(() => {
        console.log("connected to database")
    }).catch((err) => {
        console.log(err);
    })
}
module.exports = connect_db