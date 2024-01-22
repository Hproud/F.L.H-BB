// import { useNavigate } from "react-router-dom"
import { useModal } from "../../context/Modal"





export default function ConfirmDeleteModal() {
// const navigate=useNavigate()
const {closeModal} = useModal()

const yes = (e) =>{
    e.preventDefault()
    console.log('you said  yes')
    // return closeModal
}

const no =(e)=>{
e.preventDefault()
console.log('you pushed no')
//  return closeModal


}


  return (
    <div>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button onClick={yes && closeModal}>Yes(Delete Spot)</button>
        <button onClick={no && closeModal}>No(Keep Spot)</button>
    </div>
  )
}
