import fetchClient from './fetchClient';

export const apiRegister = (payload) =>
  fetchClient('/auth/register', { method: 'POST', body: payload });

export const apiLogin = (payload) =>
  fetchClient('/auth/login', { method: 'POST', body: payload });

export const apiLogout = () =>
  fetchClient('/auth/logout', { method: 'POST' });

export const apiGetCurrentUser = () =>
  fetchClient('/auth/me');
