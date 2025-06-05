const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/apf-cohort-202',
  headers: {
    authorization: '0c89496d-348e-4050-90bb-acfa00ac9fec',
    'Content-Type': 'application/json'
  }
};

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`HTTP error! status: ${res.status}, message: ${res.statusText}`));
}

// 3.3 Загрузка информации о пользователе с сервера
export function loadUserData() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
  .then(checkResponse)
  .catch(err => {
    console.error('Ошибка загрузки данных пользователя:', err);
    throw err;
  });
}

// 3.4 Загрузка карточек с сервера
export function loadCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then(checkResponse)
  .catch(err => {
    console.error('Ошибка загрузки карточек:', err);
    throw err;
  });
}

// 3.5 Редактирование профиля
export function updateProfileOnServer(name, about) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  })
  .then(checkResponse)
  .catch(err => {
    console.error('Ошибка обновления профиля:', err);
    throw err;
  });
}

// 3.6 Добавление новой карточки
export function addNewCardToServer(name, link) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link
    })
  })
  .then(checkResponse)
  .catch(err => {
    console.error('Ошибка добавления карточки:', err);
    throw err;
  });
}

// 3.8 Удаление карточки
export function deleteCardFromServer(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(checkResponse)
  .catch(err => {
    console.error('Ошибка удаления карточки:', err);
    throw err;
  });
}

// 3.9 Постановка и снятие лайка
export function likeCardOnServer(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  })
  .then(checkResponse)
  .catch(err => {
    console.error('Ошибка добавления лайка:', err);
    throw err;
  });
}

export function unlikeCardOnServer(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then(checkResponse)
  .catch(err => {
    console.error('Ошибка снятия лайка:', err);
    throw err;
  });
}

// 3.10 Обновление аватара пользователя
export function updateAvatarOnServer(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl
    })
  })
  .then(checkResponse)
  .catch(err => {
    console.error('Ошибка обновления аватара:', err);
    throw err;
  });
}