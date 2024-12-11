import Config from 'react-native-config';

export async function postLogin(username: string, password: string) {
  const response = await fetch(
    Config.API_URL + '/auth/signin',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );
  const json = await response.json();
  return {
    status: response.status,
    json,
  }
}

export async function getIncentives() {
  const response = await fetch(
    Config.API_URL + '/test/incentivetypes',
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const json = await response.json();
  return {
    status: response.status,
    json,
  }
}

export async function getPurposes() {
  const response = await fetch(
    Config.API_URL + '/test/organizations',
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const json = await response.json();
  return {
    status: response.status,
    json,
  }
}
