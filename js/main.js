import { fetchJsonFile } from "./utils.js";
import { handleImageError } from "./utils.js";
import { imgErrorHeight } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    var filmTab = document.getElementById("filmTab");
    var diziTab = document.getElementById("diziTab");
    var content = document.getElementById("content");
    var activeTab = "film"; // Aktif sekme
    var focusedTab = "film"; // Hangi sekme üzerinde focus var
    var focusedItemIndex = 0; // Hangi itemde olduğumuzu tutuyoruz
    var activeCategoryIndex = 0; // Hangi kategoride olduğumuzu tutuyoruz
    var itemsArray = [];
    var data = [];
    var savedActiveTab = sessionStorage.getItem("sessionActiveTab");
    var savedFocusedTab = sessionStorage.getItem("sessionFocusedTab");
    var savedActiveCategoryIndex = sessionStorage.getItem("sessionActiveCategoryIndex");
    var savedFocusedItemIndex = sessionStorage.getItem("sessionFocusedItemIndex");
    console.log("savedActiveTab = ", savedActiveTab);
    console.log("savedFocusedTab = ", savedFocusedTab);
    console.log("savedActiveCategoryIndex = ", savedActiveCategoryIndex);
    console.log("savedFocusedItemIndex = ", savedFocusedItemIndex);

    setSavedSessionData();
    setFocusedTab();
    loadContent(activeTab);

    document.addEventListener("keydown", (event) => {
        var focusedElement = document.activeElement;
        var isTabFocused = (focusedElement === filmTab || focusedElement === diziTab);
        var isItemFocused = focusedElement.classList.contains("item");

        handleKeyPress(event.key, isTabFocused, isItemFocused);
    });

    function loadContent(type) {
        filmTab.classList.toggle("active", type === "film");
        diziTab.classList.toggle("active", type === "dizi");

        var jsonFile = type === "film" ? "film.json" : "dizi.json";
        fetchJsonFile(jsonFile).then(jsonData => {
            if (!jsonData) return;

            data = jsonData;
            loadData();
        })

    }

    function loadData() {
        content.innerHTML = "";
        setIfHasSesionFocusedItemIndex();
        data.forEach((category, nthCatIndex) => {
            var categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category");
            categoryDiv.innerHTML = `<h6>${category.name}</h6>`;
            var itemsDiv = document.createElement("div");
            itemsDiv.classList.add("items");

            itemsArray.push([]);
            category.contents.forEach((item, index) => {
                var itemDiv = document.createElement("div");
                itemDiv.classList.add("item");
                itemDiv.setAttribute("tabindex", index);
                itemDiv.innerHTML = `<img src="${item.posters}" alt="${item.metadata.title}">`;
                var imgElement = itemDiv.querySelector("img");
                imgElement.onerror = function () {
                    handleImageError(this, imgErrorHeight);
                };
                itemsDiv.appendChild(itemDiv);
                itemsArray[nthCatIndex].push(itemDiv);
            });

            categoryDiv.appendChild(itemsDiv);
            content.appendChild(categoryDiv);
        });

        console.log(typeof sessionStorage !== "undefined" ? "sessionStorage çalışıyor" : "sessionStorage desteklenmiyor");
        sessionStorage.setItem("testKey", "testValue");
        console.log(sessionStorage.getItem("testKey")); // "testValue" yazmalı
        

        if (checkIfHasSavedData()) {
            console.log("geliyor buraya", focusedItemIndex);
            console.log("itemsArray = ", itemsArray);
            itemsArray[activeCategoryIndex][focusedItemIndex].focus();
        } else {
            console.log("savedActiveTab = ", savedActiveTab);
            console.log("savedFocusedTab = ", savedFocusedTab);
            console.log("savedActiveCategoryIndex = ", savedActiveCategoryIndex);
            console.log("savedFocusedItemIndex = ", savedFocusedItemIndex);
            console.log("else düştü activeCategoryIndex = ", activeCategoryIndex);
            console.log("else düştü focusedItemIndex = ", focusedItemIndex);
        }

    }

    function handleKeyPress(key, isTabFocused, isItemFocused) {
        switch (key) {
            case "ArrowRight":
                handleRightArrow(isTabFocused);
                break;
            case "ArrowLeft":
                handleLeftArrow(isTabFocused);
                break;
            case "ArrowDown":
                handleDownArrow(isTabFocused);
                break;
            case "ArrowUp":
                handleUpArrow(isItemFocused);
                break;
            case "Enter":
                handleEnterKey(isTabFocused, isItemFocused);
                break;
        }
    }

    function handleRightArrow(isTabFocused) {
        if (isTabFocused) {
            focusedTab = (focusedTab === "film") ? "dizi" : "film";
            (focusedTab === "film" ? filmTab : diziTab).focus();
        } else if (focusedItemIndex + 1 < itemsArray[activeCategoryIndex].length) {
            focusedItemIndex++;
            itemsArray[activeCategoryIndex][focusedItemIndex].focus();
        }
    }

    function handleLeftArrow(isTabFocused) {
        if (isTabFocused) {
            focusedTab = (focusedTab === "dizi") ? "film" : "dizi";
            (focusedTab === "film" ? filmTab : diziTab).focus();
        } else if (focusedItemIndex != 0) {
            focusedItemIndex--;
            itemsArray[activeCategoryIndex][focusedItemIndex].focus();
        }
    }

    function handleDownArrow(isTabFocused) {
        if (isTabFocused) {
            if (itemsArray.length > 0) {
                itemsArray[activeCategoryIndex][focusedItemIndex].focus();
            }
        } else {
            if (activeCategoryIndex + 1 < itemsArray.length) {
                activeCategoryIndex++;
                if (focusedItemIndex < itemsArray[activeCategoryIndex].length) {
                    itemsArray[activeCategoryIndex][focusedItemIndex].focus();
                } else {
                    focusedItemIndex = 0;
                    itemsArray[activeCategoryIndex][focusedItemIndex].focus();
                }
            }
        }
    }

    function handleUpArrow(isItemFocused) {
        if (isItemFocused) {
            if (activeCategoryIndex > 0) {
                activeCategoryIndex--;
                if (focusedItemIndex < itemsArray[activeCategoryIndex].length) {
                    itemsArray[activeCategoryIndex][focusedItemIndex].focus();
                }
                else {
                    focusedItemIndex = 0;
                    itemsArray[activeCategoryIndex][focusedItemIndex].focus();
                }
            } else {
                (activeTab === "film" ? filmTab : diziTab).focus();
            }
        }
    }

    function handleEnterKey(isTabFocused, isItemFocused) {
        if (isTabFocused && focusedTab !== activeTab) {
            activeTab = focusedTab;
            changeActiveTab(activeTab);
            loadContent(activeTab);
        } else if (isItemFocused) {
            var selectedCategory = data[activeCategoryIndex]; // JSON içindeki kategori
            var selectedItem = selectedCategory.contents[focusedItemIndex]; // İçindeki item
            openDetailPage(selectedItem);
        }
    }

    function setFocusedTab() {
        if (focusedTab == "dizi") {
            diziTab.focus();
        } else {
            filmTab.focus();
        }
    }

    function checkIfHasSavedData() {
        if (savedFocusedItemIndex && savedFocusedTab && savedActiveCategoryIndex && savedActiveTab !== null && savedFocusedItemIndex !== "" && savedFocusedTab !== "" && savedActiveCategoryIndex !== "" && savedActiveTab !== "") {
            if (!isNaN(savedActiveCategoryIndex) && !isNaN(savedFocusedItemIndex)) {
                return true;
            }
        } else {
            console.log("savedActiveTab = ", savedActiveTab);
            console.log("savedFocusedTab = ", savedFocusedTab);
            console.log("savedActiveCategoryIndex = ", savedActiveCategoryIndex);
            console.log("savedFocusedItemIndex = ", savedFocusedItemIndex);
            return false;
        }
    }

    function setSavedSessionData() {
        if (checkIfHasSavedData()) {
            activeTab = savedActiveTab;
            focusedTab = savedFocusedTab;
            activeCategoryIndex = parseInt(savedActiveCategoryIndex);
            focusedItemIndex = parseInt(savedFocusedItemIndex);
        }
    }

    function setIfHasSesionFocusedItemIndex() {
        if (checkIfHasSavedData()) {
            focusedItemIndex = parseInt(savedFocusedItemIndex);
        } else {
            focusedItemIndex = 0;
        }
    }

    function saveDataToStorage() {
        sessionStorage.setItem("sessionFocusedItemIndex", focusedItemIndex);
        sessionStorage.setItem("sessionFocusedTab", focusedTab);
        sessionStorage.setItem("sessionActiveCategoryIndex", activeCategoryIndex);
        sessionStorage.setItem("sessionActiveTab", activeTab);
    }

    function clearSavedSessionData() {
        sessionStorage.clear();
        resetSavedValues();
    }

    function resetSavedValues() {
        savedActiveTab = sessionStorage.getItem("sessionActiveTab");
        savedFocusedTab = sessionStorage.getItem("sessionFocusedTab");
        savedActiveCategoryIndex = sessionStorage.getItem("sessionActiveCategoryIndex");
        savedFocusedItemIndex = sessionStorage.getItem("sessionFocusedItemIndex");
    }

    function changeActiveTab(tabType) {
        activeTab = tabType;
        focusedTab = tabType;
        focusedItemIndex = 0;
        activeCategoryIndex = 0;
        itemsArray = [];
        clearSavedSessionData();
    }

    function openDetailPage(item) {
        var detailData = {
            title: item.metadata.title,
            genre: item.metadata.genre,
            image: item.posters,
            year: item.metadata.year,
            duration: item.metadata.duration,
            description: item.metadata.summaryLong,
            maturityRating: item.metadata.maturityRating.age,
            imdbRating: item.metadata.imdbRating
        };
        saveDataToStorage();
        sessionStorage.setItem("detailData", JSON.stringify(detailData));
        window.location.href = "detail.html";
    }

});

