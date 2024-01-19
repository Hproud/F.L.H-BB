
import * as spotAction from '../../store/spot'
import { useDispatch,useSelector} from "react-redux";
import { useEffect,useState } from 'react'
import { allSpots } from '../../store/spot';


export default function LandingPage() {
    const dispatch = useDispatch()
const [isLoading,setIsLoading] = useState(true)
const spots = useSelector(state => state.spot.spots)


useEffect(() => {
 dispatch(allSpots())
 .then(()=> setIsLoading(false))




},[dispatch])


if(!isLoading) {
  // console.log(spots,'this is alllllll spotttsssss')
  return (
    <div>
      <h2>All spots</h2>
      <ul>
{spots && spots.map((spot) =>(
  <li>{spot.address}</li>
))}
      </ul>
    </div>
  )}else{
    return( <div>Loading...</div>)
  }
}
