import { csrfFetch } from "./csrf";

//?------------------------------Variables--------------------------------------
const GET_ALL = 'reviews/getAll'
const EDIT_REVIEW = 'reviews/addReview'
const GET_ONE = 'reviews/getOne'
const DELETE_Review='reviews/deleteReview'
//& ------------------------------ACTIONS---------------------------------------

const allReviews = (reviews) => ({
    type: GET_ALL,
    reviews
})

const editReview = ( review ) => ({
    type: EDIT_REVIEW,
    review
})

const getReview =(review) => ({
    type: GET_ONE,
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
        dispatch(findReviews(spotId))

    }else{
        const errors = await res.json()
        console.log(errors,'errors from thunk')
        // return errors
    }
}



export const changeReview = (payload) => async dispatch => {
    const {reviewId, review, stars} = payload

    const res = await csrfFetch(`/api/reviews/${reviewId}`,{
        method: 'PUT',
        body: JSON.stringify({
             review,
            stars
        })
    })

    if(res.ok){
        const review = await res.json()
        console.log(review,'this is what the res is')
        dispatch(editReview(review))
        return review

    }else{
        const errors = await res.json()
        console.log(errors,'errors from thunk')
        // return errors
    }

}

export const singleReview = (review) => dispatch => {
    dispatch(getReview(review))
}


export const removeReview = (reviewId,spotId) => async dispatch =>{
    const res = await csrfFetch(`/api/reviews/${reviewId}`,
    {
        method: 'DELETE'
    })

    if (res.ok){
        dispatch(allReviews(spotId))
    }else{
        const errors = await res.json();
        return errors
      }
}

//TODO-------------------------------REDUCER--------------------------------------


const reviewsReducer = (state={},action)=>{
    switch(action.type){

case GET_ALL:
    return {...state, reviews: action.reviews};

case EDIT_REVIEW:
        return {...state, review: action.review}

case GET_ONE:
    return { ...state, review: action.review}


        default: return state
    }
}

export default reviewsReducer
