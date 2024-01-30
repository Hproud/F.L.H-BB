import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spot";
import { useEffect, useState } from "react";
import { findReviews } from "../../store/reviews";
import ReserveButton from "../ReserveButton";
import Review from './Review'
import { FaStar } from "react-icons/fa";
import { GoDotFill } from "react-icons/go"

import './Spots.css'



export default function Spots() {
  const { spotId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spot.spot);
  const reviews = useSelector((state) => state?.reviews?.reviews);
const pics = useSelector(state => state.spot.spot?.SpotImages)
const rating = useSelector(state => state.spot.spot?.avgRating)


const pop =Number.isInteger(rating)
useEffect(() => {
  dispatch(singleSpot(spotId))
  .then(() => dispatch(findReviews(spotId)))
  .then(() => setIsLoading(false));


  }, [dispatch,spotId]);

if (!isLoading) {
  return (
    <div className="spotsPage">
      <h2 style={{position: 'relative',fontSize:'24pt',top:'30px',left:'-6px'}}>{spot.name}</h2>
      <p style={{fontSize:'16pt'}}>
        {spot.city}, {spot.state}, {spot.country}
      </p>
      <div className="theImages">
      <img src={spot.previewImage} style={{height:'400px'}}  className="previewimage"/>
      <div className="piclist" >
      {pics &&
       pics.map((image) =>

         <img  key={image.id} src={image.url} style={{height:'200px',width:'300px'}} hidden={image.preview}/>

         )}
      </div>
      </div>
      <div className="propertyInfo">
        <div className="infoBlock">
        <h2 className="host" style={{fontSize:'24pt', margin:'3px',height:'60px'}}>
          Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
        </h2>

        <p className="description" style={{width:'400px'}}>{spot.description}</p>



        {!reviews.length  && <div className="new"> new </div>}
        {reviews.length === 1 && <div className="revrating">
  <FaStar/> {spot.avgRating}.0 Average Star Rating <GoDotFill className="dot"/> {spot.numReviews} Review
  </div>}
        <div >
          <ReserveButton spot={spot} />
        </div>
</div>
<hr className="sep"></hr>
        {reviews.length > 1 &&
  <div className="spotRate" style={{gridRow:'3', position:'relative',top:'0px'}}>
{spot && pop &&
<div>
  <FaStar/> {spot.avgRating}.0 Average Star Rating {spot.numReviews} Reviews
  </div>
}

{spot && !pop && (
<div style={{position:'relative',bottom:'40px'}}>
  <FaStar/> {spot.avgRating.toFixed(1)} Average Stars
</div>
)}

            </div>
          }
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
