import { csrfFetch } from "./csrf";
const GET_SPOTS= 'spots/getSpots'

//& ------------------------------- ACTIONS-----------------------------------//

const getAllSpots = (spots) =>({
    type: GET_SPOTS,
    spots
})


//! ------------------------------- THUNKS -----------------------------------//

export const allSpots = () => async dispatch => {
    const allOfThem = await csrfFetch('/api/spots')
     let spots = await allOfThem.json()
     console.log(spots.Spots)
     dispatch(getAllSpots(spots.Spots))


return spots
}



const spotReducer = (state={},action) => {

    switch(action.type){

case GET_SPOTS:
return {...state, spots: action.spots};


default: return state;

    }
}


export default spotReducer;
