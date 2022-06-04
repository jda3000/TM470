const SET_ACCESS = "SET_ACCESS";

const SET_REFRESH = "SET_REFRESH";

const SET_TOKENS = "SET_TOKENS";

const SET_AUTHENTICATED = "SET_AUTHENTICATED";

const SET_LOGOUT = "SET_LOGOUT";

const SET_CURRENT_USER = 'SET_CURRENT_USER';


export const setAccessAction = (value) => ({
  type: SET_ACCESS,
  payload: value,
});

export const setRefreshAction = (value) => ({
  type: SET_REFRESH,
  payload: value,
});

export const setTokensAction = (value) => ({
  type: SET_TOKENS,
  payload: value,
});

export const setAuthenticatedAction = (value) => ({
  type: SET_AUTHENTICATED,
  payload: value,
});

export const logoutAction = () => ({
  type: SET_LOGOUT,
});

export const setCurrentUserAction = (value) => ({
  type: SET_CURRENT_USER,
  payload: value,
});

export const initialState = {
  tokens: {
    access: null,
    refresh: null,
  },
  isAuthenticated: false,
  currentUser: null,
};


export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS:
      return {
        ...state, tokens: { access: action.payload, refresh: state.tokens.refresh },
      };
    case SET_REFRESH:
      return {
        ...state, tokens: { refresh: action.payload, access: state.tokens.access },
      };
    case SET_TOKENS:
      return {
        ...state, tokens: action.payload,
      };
    case SET_AUTHENTICATED:
      return {
        ...state, isAuthenticated: action.payload,
      };
    case SET_LOGOUT:
      return {
        isAuthenticated: false,
      };
    case SET_CURRENT_USER:
      return {
        ...state, currentUser: action.payload,
      };
    default:
      return state;
  }
}
