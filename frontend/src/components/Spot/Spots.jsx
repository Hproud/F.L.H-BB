import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spot";
import { useEffect, useState } from "react";
import { findReviews } from "../../store/reviews";
import ReserveButton from "../ReserveButton";
import Review from './Review'



export default function Spots() {
  const { spotId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spot.spot);

  const reviews = useSelector((state) => state?.reviews.reviews);
const pics = useSelector(state => state.spot.spot?.SpotImages)



  useEffect(() => {
    dispatch(singleSpot(spotId))
      .then(() => dispatch(findReviews(spotId)))
      .then(() => setIsLoading(false));

  }, [dispatch, spotId]);

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

        {reviews &&
          (
            <div>
              {spot.avgRating} Average Star Rating {spot.numReviews} Reviews
            </div>
          )}
        {!reviews && <div> new </div>}
        <div>
          <ReserveButton spot={spot} />
        </div>
        <div>
          {<Review spot={spot} />}
        </div>

      </div>
    </div>
  )}
  else {
  return (<div>Loading...</div>)
}

}
