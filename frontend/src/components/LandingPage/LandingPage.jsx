

import { useDispatch,useSelector} from "react-redux";
import { useEffect,useState } from 'react'
import { allSpots } from '../../store/spot';
import './LandingPage.css'
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const dispatch = useDispatch()
const [isLoading,setIsLoading] = useState(true);
const spots = useSelector(state => state.spot.spots)
const navigate =useNavigate()

useEffect(() => {
 dispatch(allSpots())
 .then(()=> setIsLoading(false))




},[dispatch])





if(!isLoading) {
  // console.log(spots,'this is alllllll spotttsssss')
  return (
    <div className='spotList'>
      <h2>All spots</h2>
      <ul className='listings' >
{spots && spots.map((spot) =>(
  <li key={spot.id}>
    <div className='spot' onClick={() => navigate(`spots/${spot.id}`)} >

     <img className='spotImage' src={`${spot.previewImage}`} />
     <div className='spotInfo'>
   <p id='spotAddress'>{spot.city}, {spot.state}</p>
   <p id='spotPrice'>${spot.price} per night</p>
   <p id='spotDescription'>{spot.description}</p>
     </div>

    </div>
  </li>
))}
      </ul>
    </div>
  )}else{
    return( <div>Loading...</div>)
  }
}
