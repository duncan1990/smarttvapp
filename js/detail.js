import * as utils from "./utils.js";

document.addEventListener("DOMContentLoaded", () => { 

    const detailData = JSON.parse(localStorage.getItem("detailData"));

    if (detailData) {
        document.getElementById("title").textContent = detailData.title;
        document.getElementById("image").src = detailData.image;
        document.getElementById("image").alt = detailData.title;
        document.getElementById("image").onerror = utils.handleImageError(document.getElementById("image"));
        document.getElementById("genre").textContent = detailData.genre;
        document.getElementById("duration").textContent = utils.formatTime(detailData.duration);
        document.getElementById("imdbRating").textContent =`IMDB ${detailData.imdbRating}`;
        document.getElementById("imgMaturityRating").src = utils.AgeRatings[detailData.maturityRating];
        document.getElementById("imgMaturityRating").alt = detailData.maturityRating;
        document.getElementById("imgDoNot").src = utils.AgeRatings["doNot"];;
        document.getElementById("imgDoNot").alt = "DoNot";
        document.getElementById("year").textContent = detailData.year;
        document.getElementById("description").textContent = detailData.description;
    } else {
        document.body.innerHTML = "<h2>Detay bilgisi bulunamadı!</h2>";
    }

});