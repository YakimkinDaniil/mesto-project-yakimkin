// 1. Шесть карточек «из коробки»
function createCard (cardData) {
    const cardTemplate = document.querySelector('#card-template').content
    const cardElement = cardTemplate.cloneNode(true)

    const cardImage = cardElement.querySelector('.card__image')
    const cardTitle = cardElement.querySelector('.card__title')
    const cardLikeButton = cardElement.querySelector('.card__like-button')
    const cardDeleteButton = cardElement.querySelector('.card__delete-button')

    cardImage.src = cardData.link
    cardImage.alt = cardData.name
    cardTitle.textContent = cardData.name

    //3. «Лайк» карточки
    cardLikeButton.addEventListener('click', () => {
        cardLikeButton.classList.toggle('card__like-button_is-active')
    })

    //4. Удаление карточки
    cardDeleteButton.addEventListener('click', () => {
        const card = cardDeleteButton.closest('.card')
        if (card) {
            card.remove()
        }
    })

    //5. Открытие и закрытие поп-апа с картинкой
    cardImage.addEventListener('click', () => {
        const imagePopupImage = imagePopup.querySelector('.popup__image')
        const imagePopupCaption = imagePopup.querySelector('.popup__caption')

        imagePopupImage.src = cardData.link
        imagePopupImage.alt = cardData.name
        imagePopupCaption.textContent = cardData.name

        openModal(imagePopup)
    })

    return cardElement
}

// 2. Работа модальных окон
const profilePopup = document.querySelector('.popup_type_edit')
const cardPopup = document.querySelector('.popup_type_new-card')
const imagePopup = document.querySelector('.popup_type_image')

function openModal(popup) {      
    popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
    popup.classList.remove('popup_is-opened')
}

const allPopups = document.querySelectorAll('.popup')
allPopups.forEach(popup => {
    popup.classList.add('popup_is-animated')
})

imagePopup.querySelector('.popup__close').addEventListener('click', () => closeModal(imagePopup))

function renderinitialCards () {
    const placesList = document.querySelector('.places__list')
    initialCards.forEach(cardData => {
        const cardElement = createCard(cardData)
        placesList.appendChild(cardElement)
    })
}

renderinitialCards()

// 2.1. Форма редактирования профиля пользователя
const editButton = document.querySelector('.profile__edit-button')
const closeButton = profilePopup.querySelector('.popup__close')

function openProfilePopup () {
    const profileTitle = document.querySelector('.profile__title')
    const profileDescription = document.querySelector('.profile__description')

    const nameInput = profilePopup.querySelector('.popup__input_type_name')
    const jobInput = profilePopup.querySelector('.popup__input_type_description')

    nameInput.value = profileTitle.textContent
    jobInput.value = profileDescription.textContent

    openModal(profilePopup)
}

editButton.addEventListener('click', openProfilePopup)
closeButton.addEventListener('click', () => closeModal(profilePopup))

const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]')

const nameInput = profilePopup.querySelector('.popup__input_type_name')
const jobInput = profilePopup.querySelector('.popup__input_type_description')

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    const newName = nameInput.value
    const newJob = jobInput.value

    const profileTitle = document.querySelector('.profile__title')
    const profileDescription = document.querySelector('.profile__description')

    profileTitle.textContent = newName
    profileDescription.textContent = newJob

    closeModal(profilePopup)
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

//2.2. Форма добавления карточки
const addButton = document.querySelector('.profile__add-button')
const closeCardButton = cardPopup.querySelector('.popup__close')

function openCardPopup () {
    const placeNameInput = cardPopup.querySelector('.popup__input_type_card-name')
    const linkInput = cardPopup.querySelector('.popup__input_type_url')

    placeNameInput.value = ''
    linkInput.value = ''

    openModal(cardPopup)
}

addButton.addEventListener('click', openCardPopup)
closeCardButton.addEventListener('click', () => closeModal(cardPopup))

const cardFormElement = document.querySelector('.popup__form[name="new-place"]')

function handleCardFormSubmit(evt) {
    evt.preventDefault();

    const placeNameInput = cardFormElement.querySelector('.popup__input_type_card-name')
    const linkInput = cardFormElement.querySelector('.popup__input_type_url')

    const cardData = {
        name : placeNameInput.value,
        link : linkInput.value
    }

    const newCardElement = createCard(cardData)
    const placesList = document.querySelector('.places__list')
    placesList.prepend(newCardElement)

    closeModal(cardPopup)
}

cardFormElement.addEventListener('submit', handleCardFormSubmit);
