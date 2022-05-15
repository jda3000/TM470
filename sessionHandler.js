import React from "react";
import jwt_decode from "jwt-decode";
import { http, loginHttp } from "./services";
import { store } from "./redux/store";
import { setTokensAction, setAuthenticatedAction, logoutAction, setCurrentUserAction } from "./redux/reducer";
import * as Keychain from "react-native-keychain";

export default class Session {
  static login(data) {
    return loginHttp.post("api/token/", data).then(
      async response => {
        await this._setTokens(response.data);
        await this._getCurrentUser();
        return { success: true };
      },
    ).catch(
      error => {
        return { success: false, errors: error.response.data };
      },
    );
  }

  static register(data) {
    return loginHttp.post("api/register/", data).then(
      async response => {
        await this._setTokens(response.data);
        return { success: true };
      },
    ).catch(
      error => {
        return { success: false, errors: error.response.data };
      },
    );

  }

  static logout() {
    // clear store
    store.dispatch(logoutAction());
    // clear http headers
  }

  static async _setTokens(data) {
    // set tokens in ios keychain
    Keychain.setGenericPassword('jwtTokens', JSON.stringify(data))

    // set token in local storage: note.. insecure
    // store.dispatch(setTokensAction(data));

    // set others
    store.dispatch(setAuthenticatedAction(true));
    return await this._setHttpHeaders(data);
  }

  static async _getCurrentUser() {
    let currentUser = store.getState().currentUser;
    if (currentUser) return;

    http.get("user/api/current_user").then(
      response => {
        store.dispatch(setCurrentUserAction(response.data));
      },
    ).catch(
      error => {
        console.log(error);
      },
    );
  }

  static async _inspectToken() {
    // will inspect jwt access token and either refresh token if expired/expiring
    // or return true if valid token
    // also initiates axios headers for valid http requests

    let tokens = null
    try {
      // get tokens from local storage: note.. insecure
      // let stored = store.getState();

      // get tokens from keychain
      let stored = await Keychain.getGenericPassword()
      tokens = JSON.parse(stored.password)

    } catch (error) {
      console.log(error);
      return false;
    }

    // check token is active
    if (tokens?.access && tokens?.refresh) {
      // decode stored jwt tokens
      const decodedAccess = jwt_decode(tokens.access);

      const expiry = decodedAccess.exp;
      const now = Date.now() / 1000;

      // check token expiry time
      if (expiry - now < 300) {
        // less than 5 minutes to go = 300 seconds, refresh token
        return await this._refreshToken(tokens.refresh);
      } else if (expiry - now < 172800) { // 48 hours ?? need to check this
        // do nothing, return passed
        store.dispatch(setAuthenticatedAction(true));
        return true;
      } else {
        store.dispatch(setAuthenticatedAction(false));
        return false;
      }
    }
    return false;
  }

  static async _refreshToken(refreshToken) {
    // init data for server
    let data = {
      refresh: refreshToken,
    };
    // start request
    return await loginHttp.post("api/token/refresh/", data).then(
      async response => {
        // store access token
        return await this._setTokens({ access: response.data.access, refresh: refreshToken });
      },
    ).catch(
      error => {
        console.log("error refreshing data", error);
        return false;
      },
    );
  }

  static async _setHttpHeaders(data) {
    // new headers
    const headers = {
      Authorization: `JWT ${data.access}`,
      "Content-Type": "application/json",
    };

    // set header on axios
    http.defaults.headers = headers;
    return true;
  }
}

