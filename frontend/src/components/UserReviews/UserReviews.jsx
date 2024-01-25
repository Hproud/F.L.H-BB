import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allMyReviews, singleReview } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewDeleteModal from "../ReviewModal/ReviewDeleteModal";
import ReviewUpdateModal from "../ReviewModal/ReviewUpdateModal";
import { allSpots } from "../../store/spot";
export default function UserReviews() {
  const reviews = useSelector((state) => state?.reviews?.reviews);
  // const spots = useSelector((state) => state.spot.spots);
  // const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allMyReviews());
  }, [dispatch]);

  return (
    <div>
      <h1>Manage Reviews</h1>
      {reviews &&
        reviews.map((review) => (
          <div key={review.id}>
            <h3>{review.Spot.name}</h3>
            <p>{review.createdAt}</p>
            <p>{review.review}</p>
            <OpenModalButton
              buttonText='Update'
              modalComponent={<ReviewUpdateModal />}
              onButtonClick={() => {dispatch(singleReview(review)).then(<ReviewUpdateModal />)

              }}
            />

            <OpenModalButton
              buttonText='Delete'
              modalComponent={<ReviewDeleteModal />}
              onButtonClick={() => {
                <ReviewDeleteModal />;
              }}
            />
          </div>
        ))}
    </div>
  );
}
