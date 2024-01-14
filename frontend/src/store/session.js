import { csrfFetch } from "./csrf"

const SET_USER = 'session/setUser'
const END_SESSION = 'session/endSession'


//?   Actions

const updateSession= (user) =>({
type: SET_USER,
user
})

const endSession = () => ({
type: END_SESSION
})

//&   Thunks

export const login = (payload) => async dispatch => {
    let data = await csrfFetch('/api/session',{
        method: 'POST',
        body: JSON.stringify(payload)
    })


        data = await data.json()
       return dispatch(updateSession(data.user))



}

export const logout = () => async dispatch => {
    const user = await csrfFetch('/api/session',{method: 'DELETE'})

        dispatch(endSession())


}

export const restoreUser = () => async dispatch =>{
let currentUser = await csrfFetch('/api/session')
currentUser = await currentUser.json()


dispatch(updateSession(currentUser.user))
}

//! reducer
const sessionReducer = (state={user:null},action) => {

switch(action.type){

    case SET_USER :
return {...state, user: action.user};

 case END_SESSION:
    return {...state, user: null};

    default: return state
}

}

export default sessionReducer
