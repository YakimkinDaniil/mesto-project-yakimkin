import '../pages/index.css';
import { initialCards, renderInitialCards, createCard } from '../components/card.js';
import { openModal, closeModal, setupModalCloseListeners } from '../components/modal.js';
import { enableValidation, checkInputValidity } from '../components/validate.js';
import { 
  loadUserData, 
  loadCards, 
  updateProfileOnServer, 
  addNewCardToServer, 
  deleteCardFromServer,
  likeCardOnServer,
  unlikeCardOnServer,
  updateAvatarOnServer
} from './api.js';

import logo from '../images/logo.svg';
import avatar from '../images/avatar.jpg';
document.querySelector('.header__logo').src = logo;
document.querySelector('.profile__image').style.backgroundImage = `url(${avatar})`;

let currentUserId = null;

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
  const submitButton = profileFormElement.querySelector('.popup__button');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateProfileOnServer(nameInput.value, jobInput.value)
    .then(userData => {
      document.querySelector('.profile__title').textContent = userData.name;
      document.querySelector('.profile__description').textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch(err => {
      console.error('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
    });
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
  const submitButton = cardFormElement.querySelector('.popup__button');
  const originalButtonText = submitButton.textContent;
  
  submitButton.textContent = 'Создание...';
  submitButton.disabled = true;

  addNewCardToServer(placeNameInput.value, linkInput.value)
    .then(cardData => {
      const cardElement = createCard(cardData, handleCardClick, currentUserId);
      
      const deleteButton = cardElement.querySelector('.card__delete-button');
      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          deleteCardFromServer(cardData._id)
            .then(() => cardElement.remove())
            .catch(err => console.error('Ошибка:', err));
        });
      }
      
      document.querySelector('.places__list').prepend(cardElement);
      closeModal(cardPopup);
      cardFormElement.reset();
    })
    .catch(err => {
      console.error('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    });
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

// 3.3 Загрузка информации о пользователе с сервера
// 3.4 Загрузка карточек с сервера
// 3.8 Удаление карточки
// 3.9 Постановка и снятие лайка
Promise.all([loadUserData(), loadCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    
    document.querySelector('.profile__title').textContent = userData.name;
    document.querySelector('.profile__description').textContent = userData.about;
    document.querySelector('.profile__image').style.backgroundImage = `url(${userData.avatar})`;
    
    const placesList = document.querySelector('.places__list');
    placesList.innerHTML = '';
    
    cards.forEach(card => {
      const cardElement = createCard(card, handleCardClick, currentUserId);
      placesList.appendChild(cardElement);
    });
  })
  .catch(err => {
    console.error('Ошибка при загрузке данных:', err);
    renderInitialCards(handleCardClick, null);
  });

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});


// 3.10 Обновление аватара пользователя
const avatarPopup = document.querySelector('.popup_type_avatar');
const profileImage = document.querySelector('.profile__image');

// Добавляем иконку редактирования при наведении на аватар
profileImage.addEventListener('mouseenter', () => {
  const editIcon = document.createElement('div');
  editIcon.className = 'profile__image-edit';
  profileImage.appendChild(editIcon);
});

profileImage.addEventListener('mouseleave', () => {
  const editIcon = profileImage.querySelector('.profile__image-edit');
  if (editIcon) {
    editIcon.remove();
  }
});

// Открываем попап редактирования аватара при клике
profileImage.addEventListener('click', () => {
  const form = avatarPopup.querySelector('.popup__form');
  form.reset();
  openModal(avatarPopup);
});

// Обработка формы обновления аватара
const avatarFormElement = avatarPopup.querySelector('.popup__form');
avatarFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const avatarUrlInput = avatarFormElement.querySelector('.popup__input_type_url');
  const submitButton = avatarFormElement.querySelector('.popup__button');
  const originalButtonText = submitButton.textContent;
  
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  updateAvatarOnServer(avatarUrlInput.value)
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarPopup);
    })
    .catch(err => {
      console.error('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    });
});

// 1. Шесть карточек «из коробки»
renderInitialCards(handleCardClick, null);