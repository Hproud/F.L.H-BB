import { useState } from "react"
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import *  as reviewsActions from '../../store/reviews'
// import { useNavigate } from "react-router-dom";


export default function ReviewModal() {
const [review,setReview] = useState('');
const [stars,setStars] = useState(1)
const {closeModal} = useModal()
const spot = useSelector(state => state.spot?.spot)
const dispatch = useDispatch();
// const reviews = useSelector(state => state.reviews?.review)
const [errors,setErrors] = useState('')




const handleSubmit = (e) =>{
e.preventDefault();
const data={
spotId: spot.id,
review,
stars
}
 dispatch(reviewsActions.writeReview(data)).then(dispatch(reviewsActions.findReviews(spot.id))).then(closeModal).catch( async (res) => {
const data= await res.json()
  if (data ) {
    console.log(data,'this is in your modal!')
   setErrors(data);
  }else{
    closeModal
  }
});

}
console.log(errors,'this is the errors')


  return (
    <div>
        <form className="create-review" onSubmit={handleSubmit }>
        <h1>How was your stay?</h1>
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
        <button type='submit' disabled={review.length < 10}>Submit Your Review</button>

        </form>
    </div>
  )
}
