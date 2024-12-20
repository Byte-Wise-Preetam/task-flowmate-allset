require('dotenv').config();

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const routes = require("./routes/index");

const app = express();
// const PORT = 4000;
const PORT = process.env.PORT || 4000;

// CORS configuration with credentials
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("Hello from Localhost");
})

if (process.env.NODE_ENV !== 'production'){
    const startServer = async function(){
        await connectDB();

        app.listen(PORT, function(){
            console.log(`Server running at http://localhost:${PORT}/`);
        })
    }

    startServer();
}

