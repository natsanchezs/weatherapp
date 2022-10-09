//Require application dependencies
//These are express, body-parser, and request

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

//Configure dotenv package

require("dotenv").config();

//Set up your OpenWeatherMap API_KEY

const apiKey = `${process.env.API_KEY}`;

//Setup your express app and body-parser configurations
//Setup your javascript template view engine
//we will serve our static pages from the public directory, it will act as my root directory

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Setup your default display on launch
app.get("/", function (req, res) {
    //It will not fetch and display any data in the index page
    res.render("index", { weather: null, error: null });
});


//On a post request, the app shall data from OpenWeatherMap using the given arguments
app.post("/", function (req, res) {
    //Get city name passed in the form
    let city = req.body.city;
    //Use that city name to fetch data
    //Use the API_KEY in the '.env'file
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    //Request for data using the URL
    request(url, function (err, response, body) {
        //On return, check the json data fetched
        if (err) {
            res.render("index", { weather: null, error: "Error, please try again" });
        } else {
            let weather = JSON.parse(body);
            //you shall output it in the console just to make sure that the data being displayed is what you want
            console.log(weather);
            if (weather.main == undefined) {
                res.render("index", { weather: null, error: "Error, please try again" });
            } else {
                //we shall use the data got to set up your output
                let place = `${weather.name}, ${weather.sys.country}`,
                    /*you shall calculate the current timezone using the data fetched*/
                    weatherTimezone = `${new Date(
                        weather.dt * 1000 - weather.timezone * 1000
                    )}`;
                let weatherTemp = `${weather.main.temp}`,

                    /*you will fetch the weather icon and its size using the icon data*/
                    weahterIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    weatherDescription = `${weather.weather[0].description}`,
                    main = `${weather.weather[0].main}`;
                //render the data to index.ejs before dsiplaying it out
                res.render("index", {
                    weather: weather,
                    place: place,
                    temp: weatherTemp,
                    icon: weahterIcon,
                    timezone: weatherTimezone,
                    main: main,
                    error: null,
                });
            }

        }
    });
});

// you will set up your port configurations. You will also start the server and add a message to display when running.
app.listen(5000, function () {
    console.log("Weather app listening on port 5000!");
});