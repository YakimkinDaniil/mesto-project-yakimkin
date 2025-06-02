// Открывает модальное окно и добавляет обработчик события для клавиши Escape
export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscapeKey);
}

// Закрывает модальное окно и удаляет обработчик события для клавиши Escape
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscapeKey);
}

// Обрабатывает нажатие клавиши Escape для закрытия открытого модального окна
function handleEscapeKey(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Устанавливает слушатели событий для закрытия модальных окон
export function setupModalCloseListeners() {
  const allPopups = document.querySelectorAll('.popup');
  allPopups.forEach(popup => {
    popup.addEventListener('mousedown', (evt) => {
      if (evt.target === evt.currentTarget) {
        closeModal(popup);
      }
    });

    const closeButton = popup.querySelector('.popup__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => closeModal(popup));
    }

    popup.classList.add('popup_is-animated');
  });
}
