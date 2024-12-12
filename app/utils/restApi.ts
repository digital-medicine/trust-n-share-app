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

export async function getUser(userId: string, accessToken: string) {
  const response = await fetch(
    Config.API_URL + '/test/user/' + userId,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
      },
    }
  );
  const json = await response.json();
  return {
    status: response.status,
    json,
  }
}

export async function putUser(form: object, accessToken: string) {
  console.log("putUser", form, accessToken);
  const response = await fetch(
    Config.API_URL + '/test/user/' + form._id,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
      },
      body: JSON.stringify(form),
    }
  );
  const json = await response.json();
  return {
    status: response.status,
    json,
  }
}
