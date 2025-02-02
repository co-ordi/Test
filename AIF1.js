const axios = require("axios")
const url = 
"https://api.open-meteo.com/v1/forecast?latitude=51.5087601&longitude=0.0549426&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"

fetch(url)
.then((response) => response.json())
.then((data) => console.log(data.current))
.catch((error) => console.error(error))