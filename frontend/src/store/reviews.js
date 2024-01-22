import { csrfFetch } from "./csrf";

//?------------------------------Variables--------------------------------------
const GET_ALL = 'reviews/getAll'
const ADD_REVIEW = 'reviews/addReview'

//& ------------------------------ACTIONS---------------------------------------

const allReviews = (reviews) => ({
    type: GET_ALL,
    reviews
})

const newReview = (review) => ({
    type: ADD_REVIEW,
    review
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
        dispatch(newReview(review))

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

case ADD_REVIEW:
    return {...state, review: action.review}




        default: return state
    }
}

export default reviewsReducer
