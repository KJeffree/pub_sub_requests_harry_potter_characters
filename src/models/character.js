const RequestHelper = require('../helpers/request_helper.js')
const PubSub = require('../helpers/pub_sub.js')

const Character = function() {
  this.data = {};
};

Character.prototype.getData = function () {
  const url = "http://hp-api.herokuapp.com/api/characters";
  const requestHelper = new RequestHelper(url);
  requestHelper.get()
    .then((data) => {
      this.handleDataReady(data);
      PubSub.publish("Character:characters-ready", this.data);
      this.handleDataReadySpecies(data);
    }).catch((error) => {
      PubSub.publish("Characters:error", error);
    });
};

Character.prototype.bindEvents = function () {
  PubSub.subscribe('SelectCharacterView:change', (event) => {
    const selectedCategory = event.detail;
    this.publishCharacterInfo(selectedCategory);
  })
};

Character.prototype.publishCharacterInfo = function(selectedCategory) {
  const selectedCharacters = this.findCharacters(selectedCategory)
  PubSub.publish('Character:selected-characters-ready', selectedCharacters)
}

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
