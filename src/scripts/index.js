import '../pages/index.css';
import { initialCards, renderInitialCards, createCard } from '../components/card.js';
import { openModal, closeModal, setupModalCloseListeners } from '../components/modal.js';
import { enableValidation, checkInputValidity } from '../components/validate.js';

import logo from '../images/logo.svg';
import avatar from '../images/avatar.jpg';
document.querySelector('.header__logo').src = logo;
document.querySelector('.profile__image').style.backgroundImage = `url(${avatar})`;

// 2. Работа модальных окон
setupModalCloseListeners();

const imagePopup = document.querySelector('.popup_type_image');
function handleCardClick(cardData) {
  const imagePopupImage = imagePopup.querySelector('.popup__image');
  const imagePopupCaption = imagePopup.querySelector('.popup__caption');

  imagePopupImage.src = cardData.link;
  imagePopupImage.alt = cardData.name;
  imagePopupCaption.textContent = cardData.name;

  openModal(imagePopup);
}

// 2.1. Форма редактирования профиля пользователя
const profilePopup = document.querySelector('.popup_type_edit');
const editButton = document.querySelector('.profile__edit-button');

function openProfilePopup() {
  const profileTitle = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  const nameInput = profilePopup.querySelector('.popup__input_type_name');
  const jobInput = profilePopup.querySelector('.popup__input_type_description');

  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  const formElement = profilePopup.querySelector('.popup__form');
  const inputList = Array.from(formElement.querySelectorAll(validationSettings.inputSelector));
  inputList.forEach((inputElement) => {
    checkInputValidity(formElement, inputElement, validationSettings);
  });

  openModal(profilePopup);
}

editButton.addEventListener('click', openProfilePopup);

const profileFormElement = profilePopup.querySelector('.popup__form');
profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const nameInput = profilePopup.querySelector('.popup__input_type_name');
  const jobInput = profilePopup.querySelector('.popup__input_type_description');

  document.querySelector('.profile__title').textContent = nameInput.value;
  document.querySelector('.profile__description').textContent = jobInput.value;

  closeModal(profilePopup);
});

// 2.2. Форма добавления карточки
const cardPopup = document.querySelector('.popup_type_new-card');
const addButton = document.querySelector('.profile__add-button');

function openCardPopup() {
  const form = cardPopup.querySelector('.popup__form');
  form.reset();
  openModal(cardPopup);
}

addButton.addEventListener('click', openCardPopup);

const cardFormElement = cardPopup.querySelector('.popup__form');
cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const placeNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
  const linkInput = cardFormElement.querySelector('.popup__input_type_url');

  const cardData = {
    name: placeNameInput.value,
    link: linkInput.value
  };

  const placesList = document.querySelector('.places__list');
  placesList.prepend(createCard(cardData, handleCardClick));

  closeModal(cardPopup);
});

// Валидация форм
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationSettings);

// 1. Шесть карточек «из коробки»
renderInitialCards(handleCardClick);