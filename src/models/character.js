const RequestHelper = require('../helpers/request_helper.js')
const PubSub = require('../helpers/pub_sub.js')

const Character = function() {
  this.data = {};
  this.speciesData = {};
  this.currentSpecies = "All";
  this.currentCharacterDetail = "All";
};

Character.prototype.getData = function () {
  const url = "http://hp-api.herokuapp.com/api/characters";
  const requestHelper = new RequestHelper(url);
  requestHelper.get()
    .then((data) => {
      this.handleDataReady(data);
      PubSub.publish("Character:characters-ready", this.data);
      this.speciesData = this.handleDataReadySpecies(data);
      PubSub.publish("Character:characters-species-ready", this.speciesData)
    }).catch((error) => {
      PubSub.publish("Characters:error", error);
    });
};

Character.prototype.bindEvents = function () {
  PubSub.subscribe('SelectCharacterView:change', (event) => {
    const selectedCategory = event.detail;
    this.currentCharacterDetail = selectedCategory;
    this.publishCharacterInfo(selectedCategory);
  })
  PubSub.subscribe('SelectCharacterSpeciesView:change', (event) => {
    const selectedSpecies = event.detail;
    this.currentSpecies = selectedSpecies;
    this.publishSpeciesInfo(selectedSpecies);
  })
};

Character.prototype.publishCharacterInfo = function(selectedCategory) {
  const selectedCharacters = this.findCharacters(selectedCategory)
  PubSub.publish('Character:selected-characters-ready', selectedCharacters)
}

Character.prototype.publishSpeciesInfo = function (selectedSpecies) {
  const characters = this.findSpecies(selectedSpecies);
  console.log(characters);
  PubSub.publish('Character:selected-species-characters-ready', characters)
};

Character.prototype.findSpecies = function (selectedSpecies) {
  console.log("CharacterDetails", this.currentCharacterDetail);
  speciesChosen = selectedSpecies
  if (this.currentCharacterDetail == "All") {
    if (speciesChosen === "All") {
      characters = this.data
    } else {
      characters = this.data.filter((character) => {
        return character.details.species === speciesChosen
      })
    }
  } else if (this.currentCharacterDetail == "Neither") {
    if (speciesChosen === "All") {
      characters = this.data.filter((character) => {
        return character.filters.staff === false && character.filters.student === false;
      })
    } else {
      characters = this.data.filter((character) => {
        return character.details.species === speciesChosen && character.filters.staff === false && character.filters.student === false;
      })
    }
  } else {
    if (speciesChosen === "All") {
      characters = this.data.filter((character) => {
        return character.filters[this.currentCharacterDetail] == true;
      })
    } else {
      characters = this.data.filter((character) => {
        return character.details.species === speciesChosen && character.filters[this.currentCharacterDetail] == true;
      })
    }
  }
  console.log("speciesChosen", speciesChosen)
  console.log("characters", characters)
  return characters
};

Character.prototype.findCharacters = function (selectedCategory) {
  category = selectedCategory
  if (this.currentSpecies == "All") {
    if (category === "Neither") {
      console.log("Working");
      characters = this.data.filter((character) => {
        return character.filters.staff === false && character.filters.student === false;
      })
    } else if (category === "All") {
      characters = this.data
    } else {
      characters = this.data.filter((character) => {
        return character.filters[category] == true;
      })
    }
  } else {
    if (category === "Neither") {
      characters = this.data.filter((character) => {
        return character.filters.staff === false && character.filters.student === false && character.details.species === this.currentSpecies;
      })
    } else if (category === "All") {
      characters = this.data.filter((character) => {
        return character.details.species === this.currentSpecies
      })
    } else {
      characters = this.data.filter((character) => {
        return character.filters[category] == true && character.details.species === this.currentSpecies;
      })
    }
  }
  return characters
};

Character.prototype.handleDataReadySpecies = function (characters) {
  return characters.map(character => character.species)
  .filter((species, index, speciesArray) => speciesArray.indexOf(species) === index);
};

Character.prototype.handleDataReady = function (characters) {
  this.modelDetails(characters)
};

Character.prototype.modelDetails = function (characters) {
  this.data = characters.map((character) => {
    return {
      name: character.name,
      details: {
        species: character.species,
        ancestry: character.ancestry,
        house: character.house,
        patronus: character.patronus
      },
      image: character.image,
      filters: {
        student: character.hogwartsStudent,
        staff: character.hogwartsStaff
      }
    }
  })
};

module.exports = Character;
