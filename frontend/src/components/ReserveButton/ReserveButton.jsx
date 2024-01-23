import './reserveButton.css'

export default function ReserveButton({spot}) {
  return (
    <div className="reservationButton">
        <p>${spot.price} night</p>
        <p>{spot.avgRating}  {spot.numReviews}Reviews</p>
        <button type='button' onClick={()=> alert("Feature Coming Soon!")}>Reserve</button>
    </div>
  )
}
