const RequestHelper = require('../helpers/request_helper.js')
const PubSub = require('../helpers/pub_sub.js')

const Character = function() {
  this.data = {};
  this.speciesData = {};
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
    this.publishCharacterInfo(selectedCategory);
  })
  PubSub.subscribe('SelectCharacterSpeciesView:change', (event) => {
    const selectedSpecies = event.detail;
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
  speciesChosen = selectedSpecies
  if (speciesChosen === "All") {
    characters = this.data
  } else {
    characters = this.data.filter((character) => {
      return character.details.species === speciesChosen
    })
  }
  console.log(characters);
  return characters
};

Character.prototype.findCharacters = function (selectedCategory) {
  category = selectedCategory
  if (category === "Neither") {
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
        house: character.house
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
