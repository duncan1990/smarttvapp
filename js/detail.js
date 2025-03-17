import * as utils from "./utils.js";

document.addEventListener("DOMContentLoaded", () => { 

    const detailData = JSON.parse(localStorage.getItem("detailData"));
    console.log(detailData);

    if (detailData) {
        document.getElementById("title").textContent = detailData.title || "N/A";
        document.getElementById("image").src = detailData.image || "";
        document.getElementById("image").alt = detailData.title || "N/A";
        document.getElementById("image").onerror = function() {
            utils.handleImageError(document.getElementById("image"));
        };
        document.getElementById("genre").textContent = detailData.genre || "N/A";
        document.getElementById("duration").textContent = utils.formatTime(detailData.duration || 0);
        document.getElementById("imdbRating").textContent =`IMDB ${detailData.imdbRating || "N/A"}`;
        document.getElementById("imgMaturityRating").src = utils.AgeRatings[detailData.maturityRating];
        document.getElementById("imgMaturityRating").alt = detailData.maturityRating  || "N/A";
        document.getElementById("imgDoNot").src = utils.AgeRatings["doNot"];
        document.getElementById("imgDoNot").alt = "DoNot";
        document.getElementById("year").textContent = detailData.year || "N/A";
        document.getElementById("description").textContent = detailData.description || "N/A";
    } else {
        document.body.innerHTML = "<h2>Detay bilgisi bulunamadı!</h2>";
    }

});