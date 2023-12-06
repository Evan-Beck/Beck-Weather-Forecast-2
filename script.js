// Function to convert temperature from Kelvin to Fahrenheit.
function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9/5 + 32;
}

// Function to save search history to local storage
function saveSearchHistory(searchHistory) {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Function to retrieve search history from local storage
function getSearchHistory() {
    const savedSearchHistory = localStorage.getItem('searchHistory');
    return JSON.parse(savedSearchHistory) || [];
}

// Function to fetch and display the weather data.
function fetchWeatherData(cityName) {
    const apiKey = '8cbc36a25efeb4b9e5921e0a757cfbf9';
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            // Updates the forecast section with the retrieved data.
            updateForecast(data);
            document.getElementById('cityForecastHeading').textContent = `5-Day Forecast for ${cityName}`;

            // Get existing search history from local storage
            const searchHistory = getSearchHistory();

            // Add the current city to the search history
            searchHistory.push(cityName);

            // Save the updated search history to local storage
            saveSearchHistory(searchHistory);

            // Display the updated search history on the page
            displaySearchHistory(searchHistory);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
            // Catch error will display a message if true.
        });
}

// Function to update the forecast section.
function updateForecast(data) {
    const forecastElement = document.getElementById('forecastBoxes');

    // Clears previous forecast data.
    forecastElement.innerHTML = '';

    // Loop through the 5-day forecast.
    for (let i = 0; i < data.list.length; i += 8) {
        const forecastItem = data.list[i];
        const date = new Date(forecastItem.dt * 1000);
        
        // Convert temperature from Kelvin to Fahrenheit
        const temperatureFahrenheit = kelvinToFahrenheit(forecastItem.main.temp);

        const forecastHtml = `
            <div class="forecast-item">
                <p>Date: ${date.toDateString()}</p>
                <img src="https://openweathermap.org/img/wn/${forecastItem.weather[0].icon}@2x.png" alt="Weather Icon">
                <p>Temperature: ${temperatureFahrenheit.toFixed(2)} °F</p>
                <p>Wind Speed: ${forecastItem.wind.speed} m/s</p>
                <p>Humidity: ${forecastItem.main.humidity}%</p>
            </div>
        `;

        forecastElement.innerHTML += forecastHtml;
    }
}

// Function to display search history on the page
function displaySearchHistory(searchHistory) {
    const searchHistoryElement = document.getElementById('searchHistory');

    // Clear previous search history
    searchHistoryElement.innerHTML = '';

    // Loop through the search history and display each item
    searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('search-history-item');
        historyItem.textContent = city;
        historyItem.addEventListener('click', function() {
            fetchWeatherData(city);
        });
        searchHistoryElement.appendChild(historyItem);
    });
}

// Function to generate city buttons for predefined US cities
function generateCityButtons() {
    const usCities = [
        'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', "San Antonio", 'San Diego'
    ];
    const cityButtonsElement = document.getElementById('cityButtons');

    usCities.forEach(city => {
        const button = document.createElement('button');
        button.classList.add('city-button');
        button.textContent = city;
        button.addEventListener('click', function() {
            fetchWeatherData(city);
        });
        cityButtonsElement.appendChild(button);
    });
}

// Call the function to generate city buttons on page load
generateCityButtons();

// Get and display the search history when the page loads
const searchHistory = getSearchHistory();
displaySearchHistory(searchHistory);

// Event listener for the city input form
document.getElementById('cityForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const cityName = document.getElementById('cityInput').value;
    
    // Fetch weather data for the entered city
    fetchWeatherData(cityName);
});
