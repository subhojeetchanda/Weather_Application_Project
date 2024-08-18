import express from "express";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";


dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;


app.set('view engine', 'ejs');
app.use(express.static('public'));


// To render main webpage
app.get('/', (req, res) => {
    res.render('index.ejs', { temp: '', feelsLike: '', humidity: '', pressure: '', cityName: '', visibility: '', weather: '' });
});

// Fetch weather data and render it on the page
app.get("/weather", async (req, res) => {
    const city = req.query.city;
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        const temp = data.main.temp;
        const feelsLike = data.main.feels_like;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const cityName = data.name;
        const visibility = data.visibility;
        const weather = data.weather[0].main; // e.g., 'Clear', 'Clouds', 'Rain'

        //console.log(response);
        res.render("index.ejs", { temp, feelsLike, humidity, pressure, cityName, visibility, weather });
    } catch (error){
        console.error('Error fetching weather data:', error);
        res.render('index.ejs', { temp: '', feelsLike: '', humidity: '', pressure: '', cityName: '', visibility: '',error: 'Error fetching weaather data' });
        res.status(500).json({ message: "Error fetching posts" })
    }
});

app.listen(port, () => {
    console.log(`Weather app listening at http://localhost:${port}`);
});
