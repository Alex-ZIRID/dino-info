// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
}

// Create Dino Objects
let dinos = [];
async function loadDinos() {
    const response = await fetch('./dino.json');
    const data = await response.json();
    dinos = data.Dinos.map(dino => new Dino(
        dino.species, dino.weight, dino.height, dino.diet, dino.where, dino.when, dino.fact
    ));
}

// Create Human Object
function Human(name, weight, height, diet, unitType) {
    this.name = name;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.unitType = unitType;
}

// Use IIFE to get human data from form
function getHumanData() {
    const name = document.getElementById('name').value;
    const diet = document.getElementById('diet').value;

    const isMetric = document.getElementById('metric').checked;
    let weight, height;

    if (isMetric) {
        weight = parseFloat(document.getElementById('metric-weight').value) || 0; 
        height = parseFloat(document.getElementById('metric-height').value) || 0; 
    } else {
        const feet = parseInt(document.getElementById('feet').value) || 0;
        const inches = parseInt(document.getElementById('inches').value) || 0;
        weight = parseFloat(document.getElementById('imperial-weight').value) || 0; 
        height = feet * 12 + inches; // Convert to inches
    }

    return new Human(name, weight, height, diet, isMetric ? "metric" : "imperial");
}

// Dino Compare Methods
Dino.prototype.compareWeight = function (humanWeight, unitType) {
    let dinoWeight = this.weight;
    let weightDifference;
    let unit;

    if (unitType === "metric") {
        dinoWeight = Math.round(this.weight * 0.454);
        weightDifference = Math.abs(dinoWeight - humanWeight);
        unit = "kgs";
    } else {
        weightDifference = Math.abs(this.weight - humanWeight);
        unit = "lbs";
    }

    return dinoWeight > humanWeight
        ? `The ${this.species} weighs ${weightDifference} ${unit} more than you!`
        : `The ${this.species} weighs ${weightDifference} ${unit} less than you!`;
};

Dino.prototype.compareHeight = function (humanHeight, unitType) {
    let dinoHeight = this.height;
    let heightDifference;
    let unit;

    if (unitType === "metric") {
        dinoHeight = Math.round(this.height * 2.54);
        heightDifference = Math.abs(dinoHeight - humanHeight);
        unit = "cms";
    } else {
        heightDifference = Math.abs(this.height - humanHeight);
        unit = "inches";
    }

    return dinoHeight > humanHeight
        ? `The ${this.species} is ${heightDifference} ${unit} taller than you!`
        : `The ${this.species} is ${heightDifference} ${unit} shorter than you!`;
};

Dino.prototype.compareDiet = function (humanDiet) {
    return this.diet.toLowerCase() === humanDiet.toLowerCase()
        ? `Both you and the ${this.species} are ${this.diet}s!`
        : `Unlike you, the ${this.species} is a ${this.diet}.`;
};

// Helper Function: Generate a random fact
function getRandomFact(dino, human, factTypes) {
    if (dino.species === "Pigeon") {
        return "All birds are dinosaurs.";
    } else if (factTypes.pop() === "comparison") {
        const comparisonOptions = [
            dino.compareWeight(human.weight, human.unitType),
            dino.compareHeight(human.height, human.unitType),
            dino.compareDiet(human.diet),
        ];
        return comparisonOptions[Math.floor(Math.random() * comparisonOptions.length)];
    } else {
        return dino.fact;
    }
}

// Helper Function: Create HTML for a tile
function createTileHTML(title, imagePath, fact = "") {
    return `
        <div class="grid-item">
            <h3>${title}</h3>
            <img src="${imagePath}" alt="${title}">
            ${fact ? `<p>${fact}</p>` : ""}
        </div>
    `;
}

// Generate Tiles for Each Dino and Human
function generateTiles(human) {
    const factTypes = ["comparison", "comparison", "comparison", "comparison", "comparison", "static", "static"];
    factTypes.sort(() => Math.random() - 0.5);

    // Generate tiles for dinosaurs
    const tiles = dinos.map((dino) => {
        const fact = getRandomFact(dino, human, factTypes);
        return createTileHTML(dino.species, `images/${dino.species.toLowerCase()}.png`, fact);
    });

    // Add the human tile in the center
    const humanTile = createTileHTML(human.name, "images/human.png");
    tiles.splice(4, 0, humanTile);

    return tiles;
}

// Adding Tiles to DOM
function addTilesToDOM(tiles) {
    const grid = document.getElementById('grid');
    grid.innerHTML = tiles.join('');
}

// Removing Form from Screen
function removeForm() {
    document.getElementById('dino-compare').style.display = 'none';
}

// Prepare and Display Infographic
document.getElementById('btn').addEventListener('click', async () => {
    await loadDinos();
    const human = getHumanData();
    const tiles = generateTiles(human);
    addTilesToDOM(tiles);
    removeForm();
});