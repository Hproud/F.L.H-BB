import { csrfFetch } from "./csrf";
import { allSpots} from "./spot";

//?------------------------------Variables--------------------------------------
const GET_ALL = 'reviews/getAll'
const EDIT_REVIEW = 'reviews/addReview'
const GET_ONE = 'reviews/getOne'
const OWNER_REVIEWS='reviews/ownerReviews'
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


const myReviews = (reviews) =>({
    type: OWNER_REVIEWS,
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
        dispatch(allSpots())
        dispatch(findReviews(spotId))
        return review

    }else{
        const errors = await res.json()
        console.log(errors,'errors from thunk')
        // return errors
    }
}



export const changeReview = (data) => async dispatch => {
    const {reviewId, review, stars} = data
console.log(data, 'this is what i have from my thunk')
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
        dispatch(allSpots())
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
// console.log('hit')
    if (res.ok){
        dispatch(allSpots())
        dispatch(allReviews(spotId))

    }else{
        const errors = await res.json();
        return errors
      }
}


export const allMyReviews = () => async dispatch =>{
    const res = await csrfFetch(`/api/reviews/current`)

    if(res.ok){
        const reviews = await res.json();
        // console.log(reviews.Reviews,'this is my reviews')
        dispatch(myReviews(reviews.Reviews))
        return reviews
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

    case OWNER_REVIEWS:
    return {...state, reviews: action.reviews}

        default: return state
    }
}

export default reviewsReducer
