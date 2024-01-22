import { csrfFetch } from "./csrf";
//?------------------------------Variables--------------------------------------

const GET_SPOTS = "spots/getSpots";
const GET_ONE = "spots/getOne";
const CREATE_SPOT = "spots/createSpot";
const GET_OWNED = "spots/getOwned";
const UPDATE_SPOT='spots/updateSpot'
//& ------------------------------- ACTIONS-----------------------------------//

const getAllSpots = (spots) => ({
  type: GET_SPOTS,
  spots,
});

const oneSpot = (spot) => ({
  type: GET_ONE,
  spot,
});

const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

const ownedSpots = (spots) => ({
  type: GET_OWNED,
  spots,
});

const updateSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
})

//! ------------------------------- THUNKS -----------------------------------//

export const allSpots = () => async (dispatch) => {
  const allOfThem = await csrfFetch("/api/spots");
  let spots = await allOfThem.json();
  //  console.log(spots.Spots)
  dispatch(getAllSpots(spots.Spots));

  return spots;
};

export const singleSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const data = await res.json();
    console.log(data, "this is my dataaaaaaa");
    dispatch(oneSpot(data));
  }
};

export const addSpot = (payload) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const spot = await res.json();
    // console.log(spot,'this is the created spot!!!!')
    dispatch(createSpot(spot));
  } else {
    const errors = await res.json();
    // console.log(errors,'this is the errors inside the thunk')
    return errors;
  }
};


export const ownerSpots = () => async dispatch => {
    const res = await csrfFetch(`/api/spots/current`)

    if(res.ok){
        const spots = await res.json()
        console.log(spots,'this is what we are getting owned')
        dispatch(ownedSpots(spots.Spots))
    }
};

export const updatingSpot = (payload) => async dispatch => {
    const {spotId,address,city,state,country,lat,lng,name,price,description,previewImage} = payload
    const res = await csrfFetch(`/api/spots/${spotId}`,{
        method: 'PUT',
        body: JSON.stringify({
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            price: price,
            description:description,
            previewImage: previewImage
        })
    })

    if(res.ok){
        const spot = await res.json()
        console.log(spot, 'this is my updated spot')
        dispatch(updateSpot(spot))
    }else{
        const errors = res.json()
        return errors
    }
}

//TODO-------------------------------REDUCER--------------------------------------

const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SPOTS:
      return { ...state, spots: action.spots };

    case GET_ONE:
      return { ...state, spot: action.spot };

    case CREATE_SPOT:
      return { ...state, spot: action.spot };

    case GET_OWNED:
      return { ...state, spots: action.spots };


      case UPDATE_SPOT:
        return { ...state, spot: action.spot };
    default:
      return state;
  }
};

export default spotReducer;
