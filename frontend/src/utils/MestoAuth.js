// export const BASE_URL = 'https://auth.nomoreparties.co';
export const BASE_URL = 'http://localhost:3001';

const checkResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(res.status)
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // credentials: 'include',
    body: JSON.stringify({email, password})
  })
  .then(checkResponse)
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // credentials: 'include',
    body: JSON.stringify({email, password})
  })
  .then(checkResponse)
};

// export const getContent = (token) => {
//   console.log('getContent', token);
//   return fetch(`${BASE_URL}/users/me`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     }
//   })
//   .then(checkResponse)
// }