import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ownerSpots,singleSpot } from "../../store/spot"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal'
import './OwnersSpots.css'

export default function OwnersSpots() {
const navigate= useNavigate()
const dispatch = useDispatch()
const user = useSelector(state => state.session?.user)
const spots = useSelector(state => state.spot?.spots)

// const [spotId,setSpotId] = useState()
// const [isLoaded, setIsLoaded] = useState(false)

useEffect(() => {
  dispatch(ownerSpots(user.id))
},[dispatch,user.id])



const onClickUpdate = (spotId) => {

  dispatch(singleSpot(spotId)).then(()=> navigate('/update') )

}

// const handleDelete = (spotId) =>{


// dispatch(deleteSpot(spotId)).then(() => navigate('/spots/current'))

// }


  return (
    <div>
      <h1>Manage Your Spots</h1>
      <button className="newspotbutton" type='button' onClick={() => navigate('/spots/new')}>Create a New spot</button>

      <ul className="ownedSpots">
{spots && spots.map((spot) => (
  <li key={spot.id}>
    <div className="thisspots">
      <img className='mainpic' src={spot.previewImage} style={{height: "200px"}} onClick={() => navigate(`/spots/${spot.id}`)}/>
      <p>{spot.city}, {spot.state}</p>
      <p>${spot.price} night</p>
      <div className="buttonscontainer">
        <button className="updatebutton" type='button' onClick={e => { e.preventDefault(); onClickUpdate(spot.id)}} >Update</button>
        <OpenModalButton
              buttonText="Delete"
              modalComponent={<ConfirmDeleteModal />}
                onButtonClick={() =>{dispatch(singleSpot(spot.id)).then(() => <ConfirmDeleteModal />) }}

  />

      </div>
    </div>
  </li>
))}
      </ul>
    </div>
  )
}
