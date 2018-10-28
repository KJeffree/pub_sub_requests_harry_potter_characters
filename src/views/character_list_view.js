const PubSub = require('../helpers/pub_sub.js');
const CharacterView = require('../views/character_view.js');

const CharacterListView = function(container) {
  this.container = container;
}

CharacterListView.prototype.bindEvents = function () {
  PubSub.subscribe("Character:characters-ready", (event) => {;
    this.characters = event.detail;
    console.log(this.characters);
    this.render();
  });
};

CharacterListView.prototype.render = function() {
  this.characters.forEach((character) => {
    const characterView = new CharacterView(this.container, character);
    characterView.render();
  })
}

module.exports = CharacterListView;
