import { csrfFetch } from "./csrf";

//?------------------------------Variables--------------------------------------
const GET_SPOT_PICS ='pictures/getSpotPics'
const GET_REVIEW_PICS='pictures/getReviewImages'
// const ADD_SPOT_IMAGES='pictures/getSpotImages'
const PLACE_HOLDER='pictures/placeholder'
//& ------------------------------ACTIONS---------------------------------------
const spotPictures = (data) => ({
    type: GET_SPOT_PICS,
    data
})

// const reviewPictures = (data) => ({
//     type: GET_REVIEW_PICS,
//     data
// })
// const addSpotImages = (data) =>({
//     type: ADD_SPOT_IMAGES,
//     data
// })

const placeHolder = (data) =>({
    type: PLACE_HOLDER,
    data
})


//! -------------------------------THUNKS----------------------------------------

export const addspotPic = (payload,spotId) => async dispatch => {
   console.log(spotId, 'spotId in thunk')
    const res = await csrfFetch(`/api/spots/${spotId}/images`,{
        method: 'POST',
        body: JSON.stringify(payload)
    })

    if(res.ok){
        const data = await res.json()
        console.log(data)
        dispatch(spotPictures(data))
        return data
    }else{
        const errors=await  res.json()
        return errors
    }

}
 export const addpicInput = (arr) => async dispatch=>{
    const data = arr
        dispatch(placeHolder(data))
    }




//TODO-------------------------------REDUCER--------------------------------------


const pictureReducer = (state={}, action) =>{

    switch(action.type){



        case GET_SPOT_PICS:
        return {...state, spotImages: action.data};


        case GET_REVIEW_PICS:
        return {...state, ReviewImages: action.data};

        case PLACE_HOLDER:
            return {...state, placeHolder: action.data}
    default: return state
    }

}

export default pictureReducer
