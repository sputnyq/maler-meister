const EXPIRES_IN = 'EXPIRES_IN';
const TOKEN = 'TOKEN';
const USER = 'USER';

export function getLoginData() {
  const now = Date.now();

  const expiresIn = localStorage.getItem(EXPIRES_IN);
  const userString = localStorage.getItem(USER);

  if (Number(expiresIn || 1) < now) {
    destroyLoginData();
    return null;
  }

  if (userString !== null) {
    return {
      user: JSON.parse(userString) as User,
      jwt: localStorage.getItem(TOKEN) as string,
    };
  }

  return null;
}

export function destroyLoginData() {
  localStorage.removeItem(EXPIRES_IN);
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER);
}

export function setLoginData(param: { jwt: string; user: User }) {
  const { jwt, user } = param;
  localStorage.setItem(TOKEN, jwt);
  localStorage.setItem(USER, JSON.stringify(user));

  const expiresIn = Date.now() + Math.pow(10, 9); // ca 10 days

  localStorage.setItem(EXPIRES_IN, String(expiresIn));
}
