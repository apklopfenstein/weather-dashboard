var cityInputEl = $('.form-control');
var searchBtnEl = $('#search');
var cityListEl = $('.list-group');
var weatherContainerEl = $('#weather');
var cities = JSON.parse(localStorage.getItem('cities')) || [];
var iconUrl = 'http://openweathermap.org/img/wn/';

var search = function (event) {
    event.preventDefault();

    var city = cityInputEl.val().trim();
    cityInputEl.val('');

    if (!city) {
        return;
    }

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
    var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?&units=imperial&appid=' + appId;

    return $.get(currentWeatherUrl)
        .then(function (data) {
            $.get(oneCallUrl + '&lat=' + data.coord.lat + '&lon=' + data.coord.lon)
                .then(function (ocData) {
                    weatherContainerEl.empty();
                    createCurrentWeather(data, ocData);
                    createFiveDayForecast(ocData);
                });
        });
};

var createCurrentWeather = function (data, ocData) {
    var cityInfoEl = $('<div class="city-info">');
    weatherContainerEl.append(cityInfoEl);

    var cityNameEl = $('<h3>');
    cityNameEl.text(data.name + ' (' + moment().format('L') + ') ');
    var cityWeatherIconEl = $('<img src="' + iconUrl + data.weather[0].icon + '.png">');
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
    var uvIndex = ocData.current.uvi;
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

var createFiveDayForecast = function (ocData) {
    var forecastEl = $('<div class="forecast">');
    weatherContainerEl.append(forecastEl);

    var forecastHeaderEl = $('<h3>');
    forecastHeaderEl.text('5 Day Forecast:');
    forecastEl.append(forecastHeaderEl);

    var forecastContainerEl = $('<div class="container">');
    forecastEl.append(forecastContainerEl);

    var forecastRowEl = $('<div class="flex cards row justify-content-between">');
    forecastContainerEl.append(forecastRowEl);

    for (i = 1; i < 6; i++) {
        var day = ocData.daily[i];

        var cardEl = $('<div class="card col-lg-2">');
        forecastRowEl.append(cardEl);

        var dateCardEl = $('<h5>');
        dateCardEl.text(moment.unix(day.dt).format('L'));
        cardEl.append(dateCardEl);

        var cardIcon = $('<img src="' + iconUrl + day.weather[0].icon + '.png" class="card-img">');
        cardEl.append(cardIcon);

        var tempCardEl = $('<p>');
        tempCardEl.html('Temp: ' + day.temp.max + ' &deg;F');
        cardEl.append(tempCardEl);

        var humidityCardEl = $('<p>');
        humidityCardEl.text('Humidity: ' + day.humidity);
        cardEl.append(humidityCardEl);
    }
};

var createListItem = function (name) {
    var cityEl = $('<li class="list-group-item">');
    cityEl.text(name);
    cityEl.on('click', getWeather.bind(this, name));

    cityListEl.prepend(cityEl);
};

searchBtnEl.on('submit', search);

$.each(cities, function (i, city) {
    createListItem(city);
});