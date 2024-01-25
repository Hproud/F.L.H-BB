// import { useState } from "react"
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import *  as reviewsActions from '../../store/reviews'

export default function ReviewDeleteModal() {
    const spot = useSelector(state => state.spot?.spot)
    const review= useSelector(state => state.reviews?.review)
    const {closeModal} = useModal()
    const dispatch= useDispatch()
    const yes = (e) =>{
        e.preventDefault()
        // console.log('you said  yes')
        // console.log(spot.id,'this is the spot')
        // console.log(review.id,'this is the review')
            dispatch(reviewsActions.removeReview(review.id,spot.id))
    .then(closeModal)

        // return closeModal
    }

    // const no =(e)=>{
    // e.preventDefault()
    // console.log('you pushed no')
    //  return closeModal


    // }


      return (
        <div>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this review from the listings?</p>
            <button onClick={yes }>Yes(Delete Review)</button>
            <button onClick={closeModal }>No(Keep Review)</button>
        </div>
      )

}
