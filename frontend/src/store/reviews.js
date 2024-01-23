import { csrfFetch } from "./csrf";

//?------------------------------Variables--------------------------------------
const GET_ALL = 'reviews/getAll'
const ADD_REVIEW = 'reviews/addReview'

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


export const writeReview = (payload) => async dispatch =>{
    const {spotId, review, stars} = payload
console.log('start',payload)
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`,{
        method: 'POST',
        body: JSON.stringify({
             review,
            stars
        })
    })


    if(res.ok){
        const review = await res.json()
        console.log(review,'this is what the res is')
        dispatch(findReviews(spotId))

    }else{
        const errors = await res.json()
        console.log(errors,'errors from thunk')
        // return errors
    }
}


//TODO-------------------------------REDUCER--------------------------------------


const reviewsReducer = (state={},action)=>{
    switch(action.type){

case GET_ALL:
    return {...state, reviews: action.reviews};






        default: return state
    }
}

export default reviewsReducer
