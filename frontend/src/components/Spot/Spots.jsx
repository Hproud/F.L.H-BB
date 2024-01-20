import { useDispatch,useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spot";
import { useEffect, useState } from "react";
import { findReviews } from "../../store/reviews";
import ReserveButton from "../ReserveButton";

export default function Spots() {
const {spotId} = useParams()
const [isLoading,setIsLoading] = useState(true)
const dispatch = useDispatch()
const spot = useSelector(state => state?.spot.spot)
const reviews = useSelector(state => state?.reviews.reviews)

  useEffect(() => {
    dispatch(singleSpot(spotId))
 .then(()=> dispatch(findReviews(spotId)))
    .then(()=>setIsLoading(false))

  },[dispatch])

// console.log(reviews,"this is my set of reviews")
if(!isLoading){
  return (
    <div>
      <h2>{spot.name}</h2>
      <p>{spot.city}, {spot.state} {spot.country}</p>
{spot && spot.SpotImages.map(image =>(
<img  src={image.url}/>
  )
)}
<div>
  <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
  <p>{spot.description}</p>




<div>{spot.avgRating} Average Star Rating   {spot.numReviews} Reviews</div>
<div>
  <ReserveButton spot={spot} />
</div>
{reviews && reviews.map(review => (
  <div>
    <h3>{review.User.firstName}</h3>
    <p>{review.createdAt}</p>
    <p>{review.review}</p>
  </div>
))}

</div>
    </div>
  )
}else{
  return (<div>Loading...</div>)
}
}
