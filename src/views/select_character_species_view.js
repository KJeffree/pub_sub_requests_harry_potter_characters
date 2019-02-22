const PubSub = require('../helpers/pub_sub.js')

const SelectCharacterSpeciesView = function(element) {
  this.element = element;
}

SelectCharacterSpeciesView.prototype.bindEvents = function () {
  PubSub.subscribe('Character:characters-species-ready', (event) => {
    const allSpecies = event.detail;
    this.populate(allSpecies)
  })

  this.element.addEventListener('change', (event) => {
    const selectedSpecies = event.target.value;
    PubSub.publish('SelectCharacterSpeciesView:change', selectedSpecies)
  })
};

SelectCharacterSpeciesView.prototype.populate = function (speciesData) {
  const optionAll = document.createElement('option');
  optionAll.textContent = "All"
  optionAll.value = "All"
  optionAll.selected = "selected"
  this.element.appendChild(optionAll);

  speciesData.forEach((species) => {
    const option = document.createElement('option');
    option.textContent = species;
    option.value = species;
    this.element.appendChild(option)
  })

};

module.exports = SelectCharacterSpeciesView;
