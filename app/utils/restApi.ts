import Config from 'react-native-config';
import {useTokensStore} from '../stores/tokens';

async function request(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: object | null = null,
): Promise<{ status: number; json: object | null; error: string | null }> {
  console.log("getWebApi", url);

  const { accessToken, refreshToken, setAccessToken } = useTokensStore.getState();

  try {
    // Send the request
    let response = await fetch(Config.API_URL + url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': accessToken,
      },
      body: body ? JSON.stringify(body) : null,
    });

    // If the token expired, refresh and retry
    if (response.status === 401) {
      console.log("Token expired, refreshing ...");
      const refreshResponse = await fetch(
        Config.API_URL + '/auth/refreshtoken',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: `{ "refreshToken": "${refreshToken}" }`,
        }
      );
      const refreshJson = await refreshResponse.json();
      if (refreshResponse.status === 200) {
        console.log("Refreshed token");
        setAccessToken(refreshJson.accessToken);

        // Retry the original request
        response = await fetch(Config.API_URL + url, {
          method: method,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': refreshJson.accessToken,
          },
          body: body ? JSON.stringify(body) : null,
        });
      } else {
        console.error("Failed to refresh token: " + refreshJson.message);
        return {
          status: refreshResponse.status,
          json: null,
          error: refreshJson.message,
        };
      }
    }

    // Handle non-2xx HTTP statuses
    if (!response.ok) {
      const responseJson = await response.json();
      const errorText = `HTTP error ${response.status}: ${responseJson.message}`;
      console.log(errorText);
      return {
        status: response.status,
        json: null,
        error: errorText,
      };
    }

    // Attempt to parse JSON
    let json = null;
    try {
      json = await response.json();
    } catch (err) {
      // @ts-ignore
      const errorText = "Failed to parse JSON: " + err.message;
      return {
        status: response.status,
        json: null,
        error: errorText,
      };
    }

    return {
      status: response.status,
      json,
      error: null,
    };
  } catch (error) {
    const errorText = "Network or fetch error: " + (error instanceof Error ? error.message : error);
    return {
      status: 0, // Use 0 to indicate a network error (no HTTP status available)
      json: null,
      error: errorText,
    };
  }
}

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
  return request('/test/incentivetypes');
}

export async function getPurposes() {
  return request('/test/organizations');
}

export async function getUser(userId: string) {
  return request('/test/user/' + userId);
}

export async function putUser(form: object) {
  return request('/test/user/' + form._id, 'PUT', form);
}

export async function getConsumers() {
  return request('/test/consumer', 'GET');
}
