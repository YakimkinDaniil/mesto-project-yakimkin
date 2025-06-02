// Включает валидацию для всех форм на странице
export function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
}

// Устанавливает обработчики событий для полей ввода и кнопки отправки формы
function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });

    checkInputValidity(formElement, inputElement, settings);
  });
}

// Проверяет валидность поля ввода и отображает или скрывает сообщение об ошибке
export function checkInputValidity(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`.popup__error_type_${inputElement.name}`);
  if (!errorElement) return;

  if (!inputElement.validity.valid) {
    showInputError(inputElement, errorElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(inputElement, errorElement, settings);
  }
}

// Отображает сообщение об ошибке для поля ввода
function showInputError(inputElement, errorElement, errorMessage, settings) {
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

// Скрывает сообщение об ошибке для поля ввода
function hideInputError(inputElement, errorElement, settings) {
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = '';
}

// Переключает состояние кнопки отправки формы
function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
}

// Проверяет, есть ли невалидные поля ввода в списке
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}
