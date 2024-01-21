import { useDispatch,useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spot";
import { useEffect, useState } from "react";


export default function Spots() {
const {spotId} = useParams()
const [isLoading,setIsLoading] = useState(true)
const dispatch = useDispatch()
const spot = useSelector(state => state?.spot.spot)

  useEffect(() => {
    dispatch(singleSpot(spotId)).then(()=>setIsLoading(false))
  },[dispatch])


if(!isLoading){
  return (
    <div>
      <h2>{spot.name}</h2>
      <p>{spot.city}, {spot.state} {spot.country}</p>
{spot && spot.SpotImages.map(image =>(
<img src={image.url}/>
  )
)}
<div>
  <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
  <p>{spot.description}</p>
</div>
<div>{spot.numReviews} Reviews</div>
    </div>
  )
}else{
  return (<div>Loading...</div>)
}
}
