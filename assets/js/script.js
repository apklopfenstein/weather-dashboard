var cityInputEl = $('.form-control');
var searchBtnEl = $('#search');
var cityListEl = $('.list-group');
var weatherContainerEl = $('#weather');
var cities = JSON.parse(localStorage.getItem('cities')) || [];

var searchClicked = function (event) {
    event.preventDefault();

    // get value from search input
    var city = cityInputEl.val().trim();

    getWeather(city)
        .then(function () {
            cities.unshift(city);
            localStorage.setItem('cities', JSON.stringify(cities));

            createListItem(city);
        }, function () {
            alert('Could not find city');
        });
};

var getWeather = function (city) {
    var appId = 'edff0907543754128427ea37fa1d4a2d';
    var currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + appId;
    var currentUvUrl = 'http://api.openweathermap.org/data/2.5/uvi?appid=' + appId;

    // make requset to the url
    return $.get(currentWeatherUrl)
        .then(function (data) {
            $.get(currentUvUrl + '&lat=' + data.coord.lat + '&lon=' + data.coord.lon)
                .then(function (uvData) {
                    weatherContainerEl.empty();
                    console.log(uvData);
                    // populate current weather
                    createCurrentWeather(data, uvData);
                })

            // make call to forecast API and populate forecast
        });
};

var createCurrentWeather = function (data, uvData) {
    var cityInfoEl = $('<div class="city-info">');
    weatherContainerEl.append(cityInfoEl);

    var iconUrl = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png';
    var cityNameEl = $('<h3>');
    cityNameEl.text(data.name + ' (' + moment().format('L') + ') ');
    var cityWeatherIconEl = $('<img src="' + iconUrl + '">');
    cityNameEl.append(cityWeatherIconEl);
    cityInfoEl.append(cityNameEl);

    var tempEl = $('<p>');
    tempEl.html('Temperature: ' + (Math.round(data.main.temp * 10) / 10) + ' &deg;F');
    cityInfoEl.append(tempEl);

    var humidityEl = $('<p>');
    humidityEl.text('Humidity: ' + (data.main.humidity) + '%');
    cityInfoEl.append(humidityEl);

    var windSpeedEl = $('<p>');
    windSpeedEl.text('Wind Speed: ' + (data.wind.speed) + ' MPH');
    cityInfoEl.append(windSpeedEl);

    var uvIndexEl = $('<p>');
    var uvIndex = uvData.value;
    uvIndexEl.text('UV Index: ');
    var uvIndexValueEl = $('<span>');
    uvIndexValueEl.text(uvIndex);
    uvIndexEl.append(uvIndexValueEl);
    cityInfoEl.append(uvIndexEl);

    if (uvIndex <= 3) {
        uvIndexValueEl.addClass('uv-low');
    } else if (uvIndex <= 6) {
        uvIndexValueEl.addClass('uv-med');
    } else if (uvIndex <= 8) {
        uvIndexValueEl.addClass('uv-med-high');
    } else {
        uvIndexValueEl.addClass('uv-high');
    }
};

var createListItem = function (name) {
    var cityEl = $('<li class="list-group-item">');
    cityEl.text(name);
    cityEl.on('click', getWeather.bind(this, name));

    cityListEl.prepend(cityEl);
};

searchBtnEl.on('click', searchClicked);

$.each(cities, function (i, city) {
    createListItem(city);
});