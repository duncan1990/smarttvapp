export function fetchJsonFile(jsonFile) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", jsonFile, true);
        xhr.responseType = "json";
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.onerror = function() {
            reject("Fetch error!");
        };
        xhr.send();
    });
}

export function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);

    return `${hours} sa ${minutes} dk`;
}

export var AgeRatings = {
    "+7": "img/7_plus_age.webp",
    "+13": "img/13_plus_age.webp",
    "+18": "img/18_plus_age.webp",
    "G": "img/general_age.webp",
    "doNot": "img/do_not.webp"
};

export var notAvailableImage = "img/not_available.webp";
export var imgErrorHeight = "114px"; // the height of error imgage in index.html

export function handleImageError(imgElement, height) {
    imgElement.style.opacity = 0.7;
    imgElement.onerror = null;
    imgElement.src = notAvailableImage;
    imgElement.style.height = height;
}