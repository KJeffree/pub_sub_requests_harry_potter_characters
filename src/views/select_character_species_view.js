const PubSub = require('../helpers/pub_sub.js')

const SelectCharacterSpeciesView = function(element) {
  this.element = element;
}

SelectCharacterSpeciesView.prototype.bindEvents = function () {
  PubSub.subscribe('Character:characters-ready', (event) -> {
    const allCharacters = event.detail;
    this.populate(allCharacters)
  })

  this.element.addEventListener('change', (event) => {
    const selectedSpecies = event.target.value;
    PubSub.publish('SelectCharacterSpeciesView:change', selectedSpecies)
  })
};

SelectCharacterSpeciesView.prototype.populate = function (characterData) {
  const optionAll = document.createElement('option');
  optionAll.textContent = "All"
  optionAll.value = "All"
  this.element.appendChild(optionAll);

  
};
