const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get('/',(req, res)=> {
	res.send("News scrapper Api is running ...");
});

app.listen(PORT, ()=> {
	console.log(`🚀 Server started on http://localhost:${PORT}`);
});
