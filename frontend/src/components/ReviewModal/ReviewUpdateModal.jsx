import { useEffect, useState } from "react"
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import *  as reviewsActions from '../../store/reviews'

import './starrating.css'

export default function ReviewUpdateModal() {
const Review = useSelector(state => state.reviews.review)
  const [review,setReview] = useState(Review.review);
  const [stars,setStars] = useState(Review.stars)
  const {closeModal} = useModal()
  // const spot = useSelector(state => state.spot?.spot)
  const dispatch = useDispatch();
  // const reviews = useSelector(state => state.reviews.review)
  const [errors,setErrors] = useState({})
console.log(Review,'this is the review')
const spot = Review.spotId;
console.log(spot,'this is my spot')

useEffect(()=>{},[Review,review,stars])


  const handleSubmit = (e) =>{
    e.preventDefault();
    const data={
    reviewId: Review.id,
    review,
    stars
    };
     dispatch(reviewsActions.changeReview(data))
closeModal
    //  .then(()=> {() => dispatch(reviewsActions.findReviews(spot.id))})
    //  .then(()=>closeModal)
     .catch( async (res) => {
    const data= await res.json()
      if (data ) {
        // console.log(data,'this is in your modal!')
       setErrors(data);
      }
    })
    // window.location.reload();

return closeModal
    }
    // console.log(errors,'this is the errors in the review update')




  return (
   <div>
        <form className="update-review" onSubmit={handleSubmit}>
        <h1>How was your stay at {spot.name}?</h1>
        {errors && (
          <p>{errors.message}</p>
        )}
        <input
        type="text"
        placeholder="Leave your review here..."
        value={review}
        onChange={e => setReview(e.target.value)}
        />
        <label>Stars</label>
        <input type='range'
        min={1}
        max={5}
    value={stars}
    onChange={e => setStars(e.target.value)}
        />
        <button type='submit' disabled={review.length < 10} id={'clickable'}>Update Your Review</button>

        </form>
    </div>

  )
}
