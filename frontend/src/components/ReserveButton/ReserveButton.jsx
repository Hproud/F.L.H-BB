
import './reserveButton.css'
import { useSelector } from "react-redux";
import {FaStar} from 'react-icons/fa'
import { GoDotFill } from "react-icons/go"

export default function ReserveButton() {
const spot = useSelector(state => state.spot.spot);
// console.log(spot,'this is the spot')
// const dispatch = useDispatch()
const pop= Number.isInteger(spot.avgRating)

  return (
    <div className="reservationButton">
        <div style={{display:'flex'}}>

          <p className='price'>${spot.price}</p><p className='night'> night</p>
          </div>
          {pop && spot.numReviews > 1 && (
            <p
            className='avgrating'><FaStar/>{spot.avgRating}.0  <GoDotFill className='dot'/>  {spot.numReviews}  Reviews</p>
          ) }
          {!pop && spot.numReviews > 1 && (
            <p className='avgrating'><FaStar/>{spot.avgRating.toFixed(1)}  <GoDotFill className='dot'/>  {spot.numReviews}  Reviews</p>
            )}
            {spot.numReviews === 1 && (
              <p className='avgrating'><FaStar/>{spot.avgRating}  <GoDotFill className='dot'/>  {spot.numReviews}  Review</p>
            )}
            {!spot.numReviews &&
               <p className='norevs' ><FaStar/>{spot.avgRating}.0 Average Star Rating</p>
            }
        <button className='reservebutton' type='button' style={{cursor: 'pointer'}} onClick={()=> alert("Feature Coming Soon!")} id={'clickable'}>Reserve</button>
    </div>
  )
}
