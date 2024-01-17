import { useState, } from "react"
import { useDispatch } from "react-redux"

export default function ProfileButton({user}) {
  const [showMenu,setShowMenu] = useState(false)
  const dispatch = useDispatch()
  return (
    <>
    <button onClick={e => setShowMenu(true)}><i className="fa-regular fa-id-card"></i></button>
    </>
  )
}
