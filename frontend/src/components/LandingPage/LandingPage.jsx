

import { useDispatch,useSelector} from "react-redux";
import { useEffect,useState } from 'react'
import { allSpots } from '../../store/spot';
import './LandingPage.css'
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { FaStar } from "react-icons/fa";
export default function LandingPage() {
    const dispatch = useDispatch()
const [isLoading,setIsLoading] = useState(true);
const spots = useSelector(state => state.spot?.spots)
const navigate =useNavigate()

useEffect(() => {
 dispatch(allSpots())
 .then(()=> setIsLoading(false))




},[dispatch])

spots && spots.forEach(spot =>{
  if(Number.isInteger(spot.avgRating)){
    spot.avgRating = Number(`${spot.avgRating}.0`)
  }
})



if(!isLoading) {
  // console.log(spots,'this is alllllll spotttsssss')
  return (
    <div className='spotList'>

      <ul className='listings'>
{spots && spots.map((spot) =>(
  <li key={spot.id} style={{cursor: 'pointer'}}>
<Tooltip title={spot.name}  placement="top" >
    <div className='spot' onClick={() => navigate(`spots/${spot.id}`)}  >
     <img className='spotImage' src={`${spot.previewImage}`} />

     <div className='spotInfo'>
   <p id='spotAddress'>{spot.city}, {spot.state}</p>
   <div className="listinfo">
    <p id='spotPrice'>${spot.price}</p> <p className="pernight"> night</p>
    </div>

<div className="listedstarrating"><FaStar />{(spot.avgRating).toFixed(1)}</div>


     </div>

    </div>
    </Tooltip>
  </li>
))}
      </ul>
    </div>
  )}else{
    return( <div>Loading...</div>)
  }
}
