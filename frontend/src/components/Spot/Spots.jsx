import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spot";
import { useEffect, useState } from "react";
import { findReviews } from "../../store/reviews";
import ReserveButton from "../ReserveButton";
import Review from './Review'
import { FaStar } from "react-icons/fa";
import Divider from '@mui/material/Divider';
import './Spots.css'

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
    <div className="spotsPage">
      <h2>{spot.name}</h2>
      <p>
        {spot.city}, {spot.state} {spot.country}
      </p>
      <img src={spot.previewImage} style={{height:'400px'}} />
      {pics &&
       pics.map((image) =>

         <img key={image.id} src={image.url} style={{height:'200px',width:'250px'}} hidden={image.preview}/>

         )}
      <div className="propertyInfo">
        <div className="infoBlock">
        <h2 className="host">
          Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
        </h2>
        <p className="description">{spot.description}</p>
        {reviews.length > 0 &&
            <div className="spotrate">

             <FaStar/> {spot.avgRating} Average Star Rating {spot.numReviews} Reviews
            </div>
          }
<div className="ressetup">
        </div>
<Divider className="divider"/>
        {!reviews.length  && <div> new </div>}
        <div className="reservedbutton">
          <ReserveButton spot={spot} />
        </div>

</div>
        <div className="reviews">
          {<Review spot={spot} />}
        </div>

      </div>
    </div>
  )}
  else {
  return (<div>Loading...</div>)
}

}
