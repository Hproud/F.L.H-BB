import { csrfFetch } from "./csrf";
//?------------------------------Variables--------------------------------------

const GET_SPOTS= 'spots/getSpots'
const GET_ONE= 'spots/getOne'

//& ------------------------------- ACTIONS-----------------------------------//

const getAllSpots = (spots) =>({
    type: GET_SPOTS,
    spots
})

const oneSpot = (spot) => ({
    type: GET_ONE,
    spot
})

//! ------------------------------- THUNKS -----------------------------------//

export const allSpots = () => async dispatch => {
    const allOfThem = await csrfFetch('/api/spots')
     let spots = await allOfThem.json()
    //  console.log(spots.Spots)
     dispatch(getAllSpots(spots.Spots))

return spots
}

export const singleSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
if(res.ok){
    const data = await res.json();
    console.log(data,'this is my dataaaaaaa')
    dispatch(oneSpot(data))
}

}

//TODO-------------------------------REDUCER--------------------------------------


const spotReducer = (state={},action) => {

    switch(action.type){

case GET_SPOTS:
return {...state, spots: action.spots};

case GET_ONE:
    return {...state, spot: action.spot}

default: return state;

    }
}


export default spotReducer;
