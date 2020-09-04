var cityInputEl = $('.form-control');
var searchBtnEl = $('#search');
var cityListEl = $('.list-group');
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
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=edff0907543754128427ea37fa1d4a2d';

    // make requset to the url
    return $.get(apiUrl)
        .then(function (data) {
            // populate current weather

            // make call to forecast API and populate forecast
        });
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