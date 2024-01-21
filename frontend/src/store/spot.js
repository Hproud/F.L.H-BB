import { csrfFetch } from "./csrf";
//?------------------------------Variables--------------------------------------

const GET_SPOTS= 'spots/getSpots'
const GET_ONE= 'spots/getOne'
const CREATE_SPOT='spots/createSpot'

//& ------------------------------- ACTIONS-----------------------------------//

const getAllSpots = (spots) =>({
    type: GET_SPOTS,
    spots
})

const oneSpot = (spot) => ({
    type: GET_ONE,
    spot
})

const createSpot = (spot) =>({
    type: CREATE_SPOT,
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

export const addSpot = (payload)=>async dispatch => {


const res = await csrfFetch('/api/spots',{
    method: 'POST',
        body: JSON.stringify(payload)
})

if(res.ok){
    const spot = await res.json()
    // console.log(spot,'this is the created spot!!!!')
    dispatch(createSpot(spot))
}else{
    const errors = await res.json();
    // console.log(errors,'this is the errors inside the thunk')
    return errors
}

}

//TODO-------------------------------REDUCER--------------------------------------


const spotReducer = (state={},action) => {

    switch(action.type){

case GET_SPOTS:
return {...state, spots: action.spots};

case GET_ONE:
    return {...state, spot: action.spot}

    case CREATE_SPOT:
        return{...state, spot: action.spot}

default: return state;

    }
}


export default spotReducer;
