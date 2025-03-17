export async function fetchJsonFile(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) {
            throw new Error("Veri yükleme hatası!");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${hours} sa ${minutes} dk`;
}

export const AgeRatings = Object.freeze({
    "+7": "img/7_plus_age.webp",
    "+13": "img/13_plus_age.webp",
    "+18": "img/18_plus_age.webp",
    "G": "img/general_age.webp",
    "doNot": "img/do_not.webp"
});

export const notAvailableImage = "img/not_available.webp";

export function handleImageError(imgElement, height) {
    imgElement.onerror = null;
    imgElement.src = notAvailableImage;
    imgElement.style.height = height;  
}