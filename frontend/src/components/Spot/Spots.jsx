import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spot";
import { useEffect, useState } from "react";
import { findReviews } from "../../store/reviews";
import ReserveButton from "../ReserveButton";
import Review from './Review'
import { FaStar } from "react-icons/fa";

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
      <h2 style={{position: 'relative',left:'10px',fontSize:'24pt',top:'30px',left:'-6px'}}>{spot.name}</h2>
      <p style={{fontSize:'16pt'}}>
        {spot.city}, {spot.state}, {spot.country}
      </p>
      <div className="theImages">
      <img src={spot.previewImage} style={{height:'400px'}}  className="previewimage"/>
      <div className="piclist" >
      {pics &&
       pics.map((image) =>

         <img  key={image.id} src={image.url} style={{height:'200px',width:'200px'}} hidden={image.preview}/>

         )}
      </div>
      </div>
      <div className="propertyInfo">
        <div className="infoBlock">
        <h2 className="host" style={{fontSize:'24pt', margin:'3px',height:'60px'}}>
          Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
        </h2>
        <p className="description">{spot.description}</p>


        {!reviews.length  && <div className="new"> new </div>}
        <div >
          <ReserveButton spot={spot} />
        </div>
</div>
<hr></hr>
        {reviews.length > 0 &&
            <div className="spotRate" style={{gridRow:'3', position:'relative',top:'0px'}}>

             <FaStar/> {spot.avgRating} Average Star Rating {spot.numReviews} Reviews
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
