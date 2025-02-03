const express = require("express");
const axios = require("axios");
const app = express();

require("dotenv").config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
    const url =
        "https://api.hubspot.com/crm/v3/objects/mountains?properties=name,country,height,description";

    // https://api.hubapi.com/crm/v3/objects/mountains?properties=name,country,height,description

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    };

    const params = {
        properties: ["name", "country", "height", "description"],
    };

    try {
        const response = await axios.get(url, { headers, params });
        console.log("API Response:", JSON.stringify(response.data, null, 2));
        const data = response.data.results;
        console.log("Data:", JSON.stringify(data, null, 2));
        res.render("homepage", { data });
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
    try {
        res.render("updates", {
            pageTitle:
                "Update Custom Object Form | Integrating With HubSpot I Practicum",
        });
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
    const url = "https://api.hubspot.com/crm/v3/objects/mountains";
    // https://api.hubapi.com/crm/v3/objects/mountains

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    };

    const data = {
        properties: {
            name: req.body.name,
            country: req.body.country,
            height: req.body.height,
            description: req.body.description,
        },
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log("API Response:", JSON.stringify(response.data, null, 2));
        res.redirect("/");
    } catch (error) {
        console.error(error);
    }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
