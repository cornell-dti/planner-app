import { cacheAppUser, getAppUser } from './auth-util';

it('Can cache and get app user', () => {
  const appUser = { uid: '', displayName: '', email: '', token: '' };
  cacheAppUser(appUser);
  expect(getAppUser()).toBe(appUser);
});
