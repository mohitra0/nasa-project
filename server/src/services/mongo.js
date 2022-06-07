const mongoose = require('mongoose');

const MONGO_URI =process.env.MONGO_URI;

mongoose.connection.once("open", () => {
    console.log('Connected successfully withv Mongo DataBase');
});
mongoose.connection.on("error", (error) => {
    console.log('Error: ', error);
});


async function mongoConnect() {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
}

async function mongoDisconnect() {
    // await mongoose.disconnect();
}

module.exports={
    mongoConnect,
    mongoDisconnect,
}


