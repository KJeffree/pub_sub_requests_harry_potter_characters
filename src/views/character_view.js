const CharacterView = function(container, character) {
  this.container = container;
  this.character = character;
}

CharacterView.prototype.render = function () {
  const characterContainer = document.createElement('div');
  characterContainer.classList.add('character');

  const name = this.createCharacterHeading();
  characterContainer.appendChild(name);

  const image = this.createImage();
  characterContainer.appendChild(image);

  const detailsList = this.createDetailslist();
  characterContainer.appendChild(detailsList);

  this.container.appendChild(characterContainer);
};

CharacterView.prototype.createCharacterHeading = function () {
  const name = document.createElement('h2');
  name.textContent = this.character.name
  return name
};

CharacterView.prototype.createDetailslist = function () {
  const detailsList = document.createElement('ul');
  detailsList.classList.add('details');
  this.populateList(detailsList);
  return detailsList;
};

CharacterView.prototype.populateList = function (list) {
  Object.entries(this.character.details).forEach(
    ([key, value]) => {
      const detailsItem = document.createElement('li');
      detailsItem.classList.add('detailsItem');
      detailsItem.textContent = `${ key }: ${ value } `
      list.appendChild(detailsItem);
    })
};

CharacterView.prototype.createImage = function () {
  const image = document.createElement('IMG');
  image.src = this.character.image
  return image
};

module.exports = CharacterView;
