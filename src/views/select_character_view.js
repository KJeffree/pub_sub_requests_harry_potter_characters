const PubSub = require('../helpers/pub_sub.js');

const SelectCharacterView = function(element) {
  this.element = element;
}

SelectCharacterView.prototype.bindEvents = function () {
  PubSub.subscribe('Character:characters-ready', (event) => {
    const allCharacters = event.detail;
    this.populate(allCharacters)
  })

  this.element.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    PubSub.publish('SelectCharacterView:change', selectedCategory)
  })
};

SelectCharacterView.prototype.populate = function (characterData) {
  const optionAll = document.createElement('option');
  optionAll.textContent = "All"
  optionAll.value = "All"
  this.element.appendChild(optionAll);

  Object.entries(characterData[0].filters).forEach(
    ([key, value]) => {
      const option = document.createElement('option');
      option.textContent = key;
      option.value = key;
      this.element.appendChild(option);
    }
  )
  const option = document.createElement('option');
  option.textContent = "Neither"
  option.value = "Neither"
  this.element.appendChild(option);
};

module.exports = SelectCharacterView;
