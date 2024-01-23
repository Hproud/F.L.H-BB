import { useDispatch, useSelector } from "react-redux"
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import { useEffect, useState } from "react";
import { findReviews } from "../../store/reviews";


export default function Review({spotId}) {
    const reviews = useSelector(state => state?.reviews.reviews)
    const user = useSelector(state => state?.session.user)
const dispatch = useDispatch();
const [isloading,setIsLoading] = useState(true)


useEffect(()=>{
  dispatch(findReviews(spotId))
  .then(() => setIsLoading(false));
},[dispatch])

console.log(reviews,'this is the reviews')
    // const allreviews = (reviews) => {
    //     if (reviews && reviews.length) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   };

    //   const answer = allreviews(reviews);

if(!isloading){
  return (
    <div>
        <h2>reviews</h2>
        <div>
          <OpenModalButton
            buttonText='Post Your Review'
            modalComponent={<ReviewModal />}
            onButtonClick={() => {
              <ReviewModal />;
            }}
          />
          {reviews &&
          reviews.map((review) => (
            <div key={review.id}>
              <h3>{review.User.firstName}</h3>
              <p>{review.createdAt}</p>
              <p>{review.review}</p>
            </div>
          ))}
           {(!reviews) && (
          <div>
            <h3>Be the first to post a review!</h3>
          </div>
        )}
        </div>
    </div>
  )
           }else{
            return (<div>loading...</div>)
           }
}
