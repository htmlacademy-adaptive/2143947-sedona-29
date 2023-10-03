const pageBody = document.querySelector('.page__body');
const navigation = document.querySelector('.main-navigation');
const navigationToggle = navigation.querySelector('.main-navigation__toggle');

pageBody.classList.remove('page__body--no-js');

navigationToggle.addEventListener('click', (evt) => {
  if (navigation.classList.contains('main-navigation--closed')) {
    evt.preventDefault();
    navigation.classList.remove('main-navigation--closed');
  }
  else {
    evt.preventDefault();
    navigation.classList.add('main-navigation--closed');
  }
});
