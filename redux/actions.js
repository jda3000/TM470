const SET_ACCESS = "SET_ACCESS"

const SET_REFRESH = "SET_REFRESH"

const SET_TOKENS = "SET_TOKENS"

export const setAccessAction = (value) => ({
  type: SET_ACCESS,
  payload: value
})

export const setRefreshAction = (value) => ({
  type: SET_REFRESH,
  payload: value
})

export const setTokensAction = (val) => ({
  type: SET_TOKENS,
  payload: value
})
