const mongoose = require(`mongoose`)

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Prevents some warning messages in console
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        //If connected console.log
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(err){
        // If error console log err and stop process
        console.log(err);
        process.exit(1)
    }
}

module.exports = connectDB;