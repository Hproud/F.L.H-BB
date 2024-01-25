import { csrfFetch } from "./csrf"
//?------------------------------Variables--------------------------------------

const SET_USER = 'session/setUser'
const END_SESSION = 'session/endSession'
const ADD_USER = 'session/addUser'


//& ------------------------------ACTIONS---------------------------------------


const updateSession= (user) =>({
type: SET_USER,
user
})

const endSession = () => ({
type: END_SESSION
})

const newUser = (user) => ({
    type: ADD_USER,
    user
})

//! -------------------------------THUNKS----------------------------------------


export const login = (payload) => async dispatch => {
    let data = await csrfFetch('/api/session',{
        method: 'POST',
        body: JSON.stringify(payload)
    })
    if(data.ok){
        data = await data.json()
       dispatch(updateSession(data.user))
    }else{
        const errors = data.json();
        return errors
    }

}

export const logout = () => async dispatch => {
     await csrfFetch('/api/session',{method: 'DELETE'})
       return dispatch(endSession())



}

export const restoreUser = () => async dispatch =>{
let currentUser = await csrfFetch('/api/session')
currentUser = await currentUser.json()

dispatch(updateSession(currentUser.user))
}


export const signUp = (payload) => async dispatch => {
    const {firstName,lastName,email,username,password} = payload
    const user = await csrfFetch('/api/users',{
        method: 'POST',
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            username,
            password
        })
    })

    const data = await user.json()
return dispatch(newUser(data))
}




//TODO-------------------------------REDUCER--------------------------------------

const sessionReducer = (state={user:null},action) => {

switch(action.type){

    case SET_USER :
return {...state, user: action.user};

 case END_SESSION:
    return {...state, user: null};

    case ADD_USER:
        return{...state,user: action.user}

    default: return state
}

}

export default sessionReducer
