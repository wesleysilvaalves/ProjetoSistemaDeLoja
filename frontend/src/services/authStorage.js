export function getUserFromStorage() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function setUserToStorage(user, token) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

export function removeUserFromStorage() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
} 