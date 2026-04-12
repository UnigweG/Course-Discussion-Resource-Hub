import fetchClient from './fetchClient';

export const apiRegister = (payload) => {
  // Build FormData so we can include the avatar image file alongside the text fields
  const formData = new FormData();
  formData.append('username', payload.username);
  formData.append('email', payload.email);
  formData.append('password', payload.password);
  if (payload.avatar) {
    formData.append('avatar', payload.avatar);
  }
  return fetchClient('/auth/register', { method: 'POST', body: formData });
};

export const apiLogin = (payload) =>
  fetchClient('/auth/login', { method: 'POST', body: payload });

export const apiLogout = () =>
  fetchClient('/auth/logout', { method: 'POST' });

export const apiGetCurrentUser = () =>
  fetchClient('/auth/me');
