// import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteSpot } from "../../store/spot"





export default function ConfirmDeleteModal() {
// const navigate=useNavigate()
const spot = useSelector(state => state.spot?.spot)
const {closeModal} = useModal()
const dispatch= useDispatch()
const yes = (e) =>{
    e.preventDefault()
    console.log('you said  yes')
    console.log(spot.id,'this is the spot')
dispatch(deleteSpot(spot.id))
.then(closeModal)

    // return closeModal
}

// const no =(e)=>{
// e.preventDefault()
// console.log('you pushed no')
//  return closeModal


// }


  return (
    <div>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button onClick={yes }>Yes(Delete Spot)</button>
        <button onClick={closeModal }>No(Keep Spot)</button>
    </div>
  )
}
