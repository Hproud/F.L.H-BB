import { csrfFetch } from "./csrf";

//?------------------------------Variables--------------------------------------
const GET_ALL = 'reviews/getAll'


//& ------------------------------ACTIONS---------------------------------------

const allReviews = (reviews) => ({
    type: GET_ALL,
    reviews
})


//! -------------------------------THUNKS----------------------------------------


export const findReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (res.ok){
        const data = await res.json()
     
        dispatch(allReviews(data.Reviews))
    }else{
        console.log('failed to load reviews')
    }
}



//TODO-------------------------------REDUCER--------------------------------------


const reviewsReducer = (state={},action)=>{
    switch(action.type){

case GET_ALL:
    return {...state, reviews: action.reviews}

        default: return state
    }
}

export default reviewsReducer
