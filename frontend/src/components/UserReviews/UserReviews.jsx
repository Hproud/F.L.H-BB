import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { allMyReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewDeleteModal from "../ReviewModal/ReviewDeleteModal";
import ReviewUpdateModal from "../ReviewModal/ReviewUpdateModal";
export default function UserReviews() {
  const reviews = useSelector(state => state?.reviews.reviews)

const dispatch = useDispatch()



useEffect(()=>{
dispatch(allMyReviews())
},[])



  return (
    <div>
      <h1>Manage Reviews</h1>
      {reviews && reviews.map((review)=>(
<div>
  <h2>{review.Spot.name}</h2>
  <p>{review.createdAt}</p>
  <p>{review.review}</p>
  <OpenModalButton
                      buttonText='Update'
                      modalComponent={<ReviewUpdateModal />}
                      onButtonClick={() => {
                        dispatch(singleReview(review)).then(() => (
                          <ReviewUpdateModal />
                        ));
                      }}
                    />
                    <OpenModalButton
                      buttonText='Delete'
                      modalComponent={<ReviewDeleteModal />}
                      onButtonClick={() => {
                        dispatch(singleReview(review)).then(<ReviewDeleteModal />);
                      }}
                    />
</div>
))}
      </div>
  )
}
