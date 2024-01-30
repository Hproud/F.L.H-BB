import { useEffect, useState } from "react"
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import *  as reviewsActions from '../../store/reviews'

import {FaStar} from 'react-icons/fa'
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
     dispatch(reviewsActions.changeReview(data)).then(closeModal)
     .then(location.reload())

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
    <div className="reviewform">
        <form className="create-review" onSubmit={handleSubmit }>
        <h1 className="reviewHeading">How was your stay?</h1>
        {errors && (
          <p style={{color: 'red',fontWeight:'bold',justifySelf:'center'}}>{errors.message}</p>
        )}
        <input
        className="commentBox"
        type="text"
        style={{ flexDirection: 'start'}}
        placeholder="Leave your review here..."
        value={review}
        onChange={e => setReview(e.target.value)}
        />
        <div className="starrating">
          <div className="stars">
          <FaStar   onClick={() => setStars(1)} className="favstar" />
          <FaStar   onClick={() => setStars(2)} className="favstar" />
          <FaStar   onClick={() => setStars(3)} className="favstar" />
          <FaStar   onClick={() => setStars(4)} className="favstar" />
          <FaStar   onClick={() => setStars(5)} className="favstar" />
          </div>
        <label className="starlabel">Stars</label>
        <input
        className="slider"
        type='range'
        min={1}
        max={5}
        value={stars}
        onChange={e => setStars(e.target.value)}
        style={{justifyself: 'center'}}
/>
        </div>
<br />
        <button className="subbutton" type='submit' disabled={review.length < 10}>Submit Your Review</button>

        </form>
    </div>
  )

}
