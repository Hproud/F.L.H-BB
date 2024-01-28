
import './reserveButton.css'
import { useDispatch, useSelector } from "react-redux";
import {FaStar} from 'react-icons/fa'
import { GoDotFill } from "react-icons/go"

export default function ReserveButton() {
const spot = useSelector(state => state.spot.spot);
console.log(spot,'this is the spot')
// const dispatch = useDispatch()


  return (
    <div className="reservationButton">
        <div style={{display:'flex'}}>
          <p className='price'>${spot.price}</p><p className='night'> night</p>
          </div>
        <p className='avgrating'><FaStar/>{spot.avgRating}  <GoDotFill className='dot'/>  {spot.numReviews}  Reviews</p>
        <button className='reservebutton' type='button' style={{cursor: 'pointer'}} onClick={()=> alert("Feature Coming Soon!")} id={'clickable'}>Reserve</button>
    </div>
  )
}
