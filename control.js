const BASELINE_POINTS = 25;
const POINTS_PER_VOTE = 5;
const STORAGE_KEY = "organelleIslandScores";
const ORGANELLES = ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"];

const islanderRankingButton = document.getElementById("islanderRanking");
const backToMainButton = document.getElementById("backToMain");
const voteButtons = document.querySelectorAll(".voteButton");
const profileButtons = document.querySelectorAll(".profileButton");
const profileSections = document.querySelectorAll(".organelleProfile");
const islanderDescription = document.getElementById("islanderDescription");
const closeButtons = document.querySelectorAll(".closeProfile");

let scores = loadScores();

function loadScores() {
    const storedScores = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const newScores = {};

    ORGANELLES.forEach(function(organelle) {
        const savedValue = Number(storedScores[organelle]);
        newScores[organelle] = Number.isFinite(savedValue) && savedValue >= BASELINE_POINTS
            ? savedValue
            : BASELINE_POINTS;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
    return newScores;
}

function saveScores() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

function updateScoreDisplays() {
    document.querySelectorAll(".organelle").forEach(function(card) {
        const voteButton = card.querySelector(".voteButton");
        const organelle = voteButton ? voteButton.getAttribute("data-organelle") : card.id;
        let scoreElement = card.querySelector(".scoreValue");

        if (!scoreElement) {
            scoreElement = document.createElement("p");
            scoreElement.className = "scoreValue";
            card.appendChild(scoreElement);
        }

        scoreElement.textContent = `${scores[organelle] || BASELINE_POINTS} points`;
    });
}

if (islanderRankingButton) {
    islanderRankingButton.addEventListener("click", function() {
        window.location.href = "ranking.html";
    });
}

if (backToMainButton) {
    backToMainButton.addEventListener("click", function() {
        window.location.href = "main.html";
    });
}

voteButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const organelle = button.getAttribute("data-organelle");
        scores[organelle] = (scores[organelle] || BASELINE_POINTS) + POINTS_PER_VOTE;
        saveScores();
        updateScoreDisplays();
        alert(`You voted for ${organelle}! ${organelle} now has ${scores[organelle]} points.`);
    });
});

profileButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const organelle = button.getAttribute("data-organelle");
        const profileId = `${organelle.toLowerCase()}Profile`;
        const selectedSection = document.getElementById(profileId);

        if (islanderDescription) {
            islanderDescription.hidden = false;
        }

        profileSections.forEach(function(section) {
            section.style.display = section.id === profileId ? "block" : "none";
        });

        if (selectedSection) {
            selectedSection.style.display = "block";
        }
    });
});

closeButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        if (islanderDescription) {
            islanderDescription.hidden = true;
        }
    });
});

updateScoreDisplays();
