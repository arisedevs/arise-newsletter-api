const express = require("express");
const env = require("dotenv");
const axios = require("axios")
const cors = require("cors");

env.config();

const app = express();
app.use(cors());

app.use(express.json());

// const allowedOrigin = "https://ariseweather.vercel.app";

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (origin === allowedOrigin || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

app.post("/api/subscribe", async (req, res) => {

    try {
      const { firstName, lastName, email } = req.body;
      const apiKey = process.env.MAILCHIMP_API_KEY;
      const audienceID = process.env.MAILCHIMP_AUDIENCE_ID;
      const dc = process.env.MAILCHIMP_DC;

      const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      };

      const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceID}/members/`;

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `apikey ${apiKey}`,
        },
      });

      res.status(200).json(response.data);

    } catch (error) {
        console.error('Error in posting data:', error.response ? error.response.data : error.message);

        if (error.response && error.response.status === 400) {
        res.status(400).json(error.response.data);
        } else {
        res.status(500).send('Error in posting data.');
        }
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

module.exports = app;