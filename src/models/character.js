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
      console.log(this.data);
      PubSub.publish("Character:characters-ready", this.data);
    }).catch((error) => {
      PubSub.publish("Characters:error", error);
    });
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
