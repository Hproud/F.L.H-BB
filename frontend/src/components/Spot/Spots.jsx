import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spot";
import { useEffect, useState } from "react";
import { findReviews } from "../../store/reviews";
import ReserveButton from "../ReserveButton";
import Review from './Review'
// import ReviewUpdateModal from "../ReviewModal/ReviewUpdateModal";


export default function Spots() {
  const { spotId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const spot = useSelector((state) => state?.spot.spot);
  // const user = useState((state) =>
  //   state?.session?.user
  // );
  // const reviews = useSelector((state) => state?.reviews.reviews);
const pics = useSelector(state => state?.spot?.SpotImages)

  // const rating = (reviews) => {
  //   if (reviews) {
  //     return (finalRating = true);
  //   } else {
  //     return (finalRating = false);
  //   }
  // };
// {!spot.SpotImages && pics (
//       const payload={
//         url: pic.url,
//         preview:false
//       }
//       dispatch(addspotPic(payload,spot.id)).then(singleSpot(spot.id))
//     ))





  let finalRating;

  useEffect(() => {
    dispatch(singleSpot(spotId))
      .then(() => dispatch(findReviews(spotId)))
      .then(() => setIsLoading(false));

  }, [dispatch, spotId]);
// console.log(pics,'this is the images')
  // const allreviews = (reviews) => {
  //   if (reviews && reviews.length) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const reviewer = (review, user) => {
    if (review.userId === user.id) {
      return true;
    } else {
      return false;
    }
  };

// const answer = allreviews(reviews);

// console.log(reviews,"this is my set of reviews")
if (!isLoading) {
  return (
    <div>
      <h2>{spot.name}</h2>
      <p>
        {spot.city}, {spot.state} {spot.country}
      </p>
      <img src={spot.previewImage} style={{height:'400px'}} />
      {pics &&
       pics.map((image) =>

         <img key={image.id} src={image.url} style={{height:'200px',width:'250px'}} hidden={image.preview}/>

         )}
      <div>
        <h2>

          Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
        </h2>
        <p>{spot.description}</p>

        {finalRating &&
          reviewer(
            <div>
              {spot.avgRating} Average Star Rating {spot.numReviews} Reviews
            </div>
          )}
        {!finalRating && <div> new </div>}
        <div>
          <ReserveButton spot={spot} />
        </div>
        <div>
          {<Review spot={spot} />}
        </div>
        {/* <div>
          <OpenModalButton
            buttonText='Post Your Review'
            modalComponent={<ReviewModal />}
            onButtonClick={() => {
              <ReviewModal />;
            }}
          />
        </div> */}
        {/* {reviews &&
          reviews.map((review) => (
            <div key={review.id}>
              <h3>{review.User.firstName}</h3>
              <p>{review.createdAt}</p>
              <p>{review.review}</p>
            </div>
          ))} */}
        {/* {!answer && (
          <div>
            <h3>Be the first to post a review!</h3>
          </div>
        )} */}
      </div>
    </div>
  )}
  else {
  return (<div>Loading...</div>)
}

}
