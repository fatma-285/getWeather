const key = "7c63ca692fd84c56a3403131252606";

const search = document.getElementById("search");

search.addEventListener("input", function (e) {
  console.log(e.target.value);
  const city = e.target.value;
  if (city.length >= 3) {
    getWeather(city);
  }
});

(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoords(lat, lon);
    },
    (error) => {
      console.error("Location access denied:", error);
    }
  );
})();
async function getWeather(city) {
  try {
    const responce = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=3`
    );
    const data = await responce.json();
    console.log(data);
    console.log(data.current);
    console.log(data.forecast);
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;
    displayWeatherCards(current, location, forecast);
  } catch (error) {
    console.log("error");
  }
}
async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${lat},${lon}&days=3`
    );
    const data = await response.json();
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;
    displayWeatherCards(current, location, forecast);
  } catch (error) {
    console.log("error");
  }
}

function displayWeatherCards(current, location, forecast) {
  let blackBox = "";
  const todayDate = new Date(location.localtime);
  const dayName = todayDate.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = todayDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
  blackBox += `
               <div class="col-md-4 weather-card text-white s-d px-0 " id="current">
                    <div class="card-header d-flex justify-content-between s-d px-3 py-2 gray-h " id="today">
                        <p id="day" class="mb-0">${dayName}</p>
                        <span id="date">${dateStr}</span>
                    </div>
                    <div class="card-content p-3 gray-b h-100">
                        <p id="city">${location.name}</p>
                        <div class="degree d-flex justify-content-between flex-wrap">
                            <p class="num fw-bold">${
                              current.temp_c
                            }<sup>o</sup>C</p>
                            <img src="${
                              current.condition.icon
                            }" alt="" width="90" class="object-fit-contain">
                        </div>
                        <p id="" class="custom-color">${
                          current.condition.text
                        }</p>
                        <div class="weather-details d-flex gap-3">
                            <span><img src="images/icon-umberella@2x.png" alt=""> ${
                              current.humidity
                            }</span>
                            <span><img src="images/icon-wind.png" alt=""> ${Math.round(
                              current.wind_kph
                            )}km/h</span>
                            <span><img src="images/icon-compass@2x.png" alt=""> ${
                              current.wind_dir
                            }</span>
                        </div>
                    </div>
               </div>
           `;
  for (let i = 1; i <= 2; i++) {
    const date = new Date(forecast[i].date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    blackBox += `
               <div class="col-md-4 weather-card text-white s-d px-0 text-center">
                    <div class="card-header d-flex justify-content-between s-d px-3 py-2 gray-b" id="today">
                        <p id="day" class="mb-0 d-inline mx-auto">${dayName}</p>
                    </div>
                    <div class="card-content p-3 gray-h h-100">
                        <img src="https:${forecast[i].day.condition.icon}" alt="" width="90" class="object-fit-contain">
                        <div class="degree ">
                            <p class="num fw-bold fs-3">${forecast[i].day.maxtemp_c}<sup>o</sup>C</p>
                            <span class=" ">${forecast[i].day.mintemp_c}<sup>o</sup></span>
                        </div>
                        <p id="" class="custom-color">${forecast[i].day.condition.text}</p>
                    </div>
                </div>
               `;
  }
  document.getElementById("weather-cards").innerHTML = blackBox;
}

