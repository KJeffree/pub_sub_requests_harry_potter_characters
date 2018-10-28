const Character = require('./models/character.js')
const CharacterListView = require('./views/character_list_view.js')
const SelectCharacterView = require('./views/select_character_view.js')
const SelectCharacterSpeciesView = require('./views/select_character_species_view.js')

document.addEventListener('DOMContentLoaded', () => {
  console.log('JavaScript Loaded');

  const characterListContainer = document.querySelector('#characters-section')
  const characterListView = new CharacterListView(characterListContainer);
  characterListView.bindEvents();

  const selectElement = document.querySelector('#filter-staff-student');
  const elementInfo = new SelectCharacterView(selectElement);
  elementInfo.bindEvents();

  const selectElementSpecies = document.querySelector('#filter-species');
  const elementInfoSpecies = new SelectCharacterSpeciesView(selectElementSpecies);
  elementInfoSpecies.bindEvents();

  const characters = new Character();
  characters.getData();
  characters.bindEvents();
})
