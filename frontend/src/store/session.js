import { csrfFetch } from "./csrf";
//?------------------------------Variables--------------------------------------

const SET_USER = "session/setUser";
const END_SESSION = "session/endSession";
const ADD_USER = "session/addUser";

//& ------------------------------ACTIONS---------------------------------------

const updateSession = (user) => ({
  type: SET_USER,
  user,
});

const endSession = () => ({
  type: END_SESSION,
});

const newUser = (user) => ({
  type: ADD_USER,
  user,
});

//! -------------------------------THUNKS----------------------------------------

export const login = (payload) => async (dispatch) => {
  // const {credential, password} = payload
  console.log("hit1");

  const data = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  console.log(data,'data');
if(data.ok){
  const user = await data.json();
  dispatch(updateSession(user))}else{
    const errors=data.json();
    return errors
  }
};

export const logout = () => async (dispatch) => {
  await csrfFetch("/api/session", { method: "DELETE" });
  return dispatch(endSession());
};

export const restoreUser = () => async (dispatch) => {
  let res = await csrfFetch("/api/session");

  if (res.ok) {
    const currentUser = await res.json();
    dispatch(updateSession(currentUser.user));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const signUp = (payload) => async (dispatch) => {
  // const { firstName, lastName, email, username, password } = payload;
  const user = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(payload
    ),
  });
  if (user.ok) {
    const data = await user.json();
    return dispatch(newUser(data.user));
  } else {
    const errors = await user.json();
    return errors;
  }
};

//TODO-------------------------------REDUCER--------------------------------------

const sessionReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user };

    case END_SESSION:
      return { ...state, user: null };

    case ADD_USER:
      return { ...state, user: action.user };

    default:
      return state;
  }
};

export default sessionReducer;
