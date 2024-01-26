import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import { useEffect, useState } from "react";
import { findReviews, singleReview } from "../../store/reviews";
import ReviewUpdateModal from "../ReviewModal/ReviewUpdateModal";
import ReviewDeleteModal from "../ReviewModal/ReviewDeleteModal";

export default function Review({spot}) {
  const reviews = useSelector((state) => state.reviews.reviews);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [isloading, setIsLoading] = useState(true);
  const [posted,setPosted] = useState(false)
  const [owner,setOwner]= useState(false)
// console.log(spot.id,"this is the spot in review")
//   console.log(user.id, "this is what i am getting for user");
  useEffect(() => {
    dispatch(findReviews(spot.id)).then(() => setIsLoading(false));
    if(user &&( spot.id === user.id)){
      setOwner(true)
    }

  }, [dispatch, spot]);

  // console.log(reviews, "this is the reviews");
  // console.log(posted,'posted')
useEffect(()=>{

     reviews.map(review => {
      if(user && (review.userId === user.id)){
        // console.log(review.userId,'this is the userId for review')
        return setPosted(true)
      }
    })



},[reviews])


  if (!isloading) {
    return (
      <div>
        <h2>reviews</h2>
        <div>
{user && !owner && !posted &&

<OpenModalButton
  buttonText='Post Your Review'
  modalComponent={<ReviewModal />}
  onButtonClick={() => {
    <ReviewModal />;
  }}
/>


}



          {reviews.length > 0 &&
            reviews.map((review) => (
              <div key={review.id}>
                <h3>{review.User.firstName}</h3>
                <p>{review.createdAt}</p>
                <p>{review.review}</p>
                  {user && review.userId === user.id  && (
                    <OpenModalButton
                    buttonText='Update'
                    modalComponent={<ReviewUpdateModal />}
                    onButtonClick={() => {
                      dispatch(singleReview(review)).then(() => (
                        <ReviewUpdateModal spot={spot}  />
                        ));
                      }}
                      />
                  )}
                  {user && review.userId === user.id &&  (
                    <OpenModalButton
                    buttonText='Delete'
                    modalComponent={<ReviewDeleteModal />}
                    onButtonClick={() => {
                      dispatch(singleReview(review)).then(
                        <ReviewDeleteModal />
                        );
                      }}
                      />
                  )}
                      <div>
                </div>
              </div>
            ))}
          {!reviews.length && (
            <div>
              <h3>Be the first to post a review!</h3>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return <div>loading...</div>;
  }
}
