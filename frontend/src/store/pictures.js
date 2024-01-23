import { csrfFetch } from "./csrf";

//?------------------------------Variables--------------------------------------
const GET_SPOT_PICS ='pictures/getSpotPics'
const GET_REVIEW_PICS='pictures/getReviewImages'
const ADD_SPOT_IMAGES='pictures/getSpotImages'
//& ------------------------------ACTIONS---------------------------------------
const spotPictures = (data) => ({
    type: GET_SPOT_PICS,
    data
})

const reviewPictures = (data) => ({
    type: GET_REVIEW_PICS,
    data
})
const addSpotImages = (data) =>({
    type: ADD_SPOT_IMAGES,
    data
})



//! -------------------------------THUNKS----------------------------------------






//TODO-------------------------------REDUCER--------------------------------------


const pictureReducer = (state={}, action) =>{

    switch(action.type){

        

        case GET_SPOT_PICS:
        return {...state, spotImages: action.data};


        case GET_REVIEW_PICS:
        return {...state, ReviewImages: action.data};

    default: return state
    }

}

export default pictureReducer
