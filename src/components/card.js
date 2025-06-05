import { 
  likeCardOnServer, 
  unlikeCardOnServer,
  deleteCardFromServer
} from '../scripts/api.js';

// 1. Шесть карточек «из коробки»
export function createCard(cardData, handleCardClick, currentUserId = null) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');

  // Заполняем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // Устанавливаем количество лайков
  if (likeCountElement) {
    likeCountElement.textContent = cardData.likes ? cardData.likes.length : 0;
  }

  // Проверяем, лайкнул ли текущий пользователь карточку
  const isLiked = cardData.likes && cardData.likes.some(like => like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // 3.9 Постановка и снятие лайка
  likeButton.addEventListener('click', () => {
    const likeAction = likeButton.classList.contains('card__like-button_is-active')
      ? unlikeCardOnServer(cardData._id)
      : likeCardOnServer(cardData._id);

    likeAction
      .then(updatedCard => {
        likeButton.classList.toggle('card__like-button_is-active');
        if (likeCountElement) {
          likeCountElement.textContent = updatedCard.likes.length;
        }
      })
      .catch(err => {
        console.error('Ошибка при обработке лайка:', err);
      });
  });

  // 3.8 Удаление карточки
  if (deleteButton) {
    if (currentUserId && cardData.owner && cardData.owner._id === currentUserId) {
      deleteButton.addEventListener('click', () => {
        deleteCardFromServer(cardData._id)
          .then(() => cardElement.remove())
          .catch(err => {
            console.error('Ошибка при удалении карточки:', err);
          });
      });
    } else {
      deleteButton.remove();
    }
  }

  // 5. Открытие и закрытие поп-апа с картинкой
  cardImage.addEventListener('click', () => handleCardClick(cardData));

  return cardElement;
}

export const initialCards = [
  {
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
  }
];

// Отображает начальные карточки на странице
export function renderInitialCards(handleCardClick, currentUserId = null) {
  const placesList = document.querySelector('.places__list');
  initialCards.forEach(cardData => {
    const cardWithLikes = {
      ...cardData,
      likes: cardData.likes || []
    };
    const cardElement = createCard(cardWithLikes, handleCardClick, currentUserId);
    placesList.appendChild(cardElement);
  });
}