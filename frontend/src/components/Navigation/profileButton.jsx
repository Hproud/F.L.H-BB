import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useEffect } from "react";
import LoginFormModal from '../LoginFormModal/LoginFormModal'
import SignUpModal from '../signUpForm/SignUpModal'
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useSelector } from "react-redux";

function ProfileButton() {
  const user = useSelector(state => state.session.user)
  const ulRef = useRef();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    // user = dispatch(logout())
   navigate("/", { replace: true });
  };
  console.log(user,'im the userrrrrrrrrr')

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    // if (!showMenu) setShowMenu(true);
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu,dispatch]);


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu}>
        <i className='fas fa-user-circle' />
      </button>
      <ul className={ulClassName} hidden={!showMenu} ref={ulRef}>
        {user ? (
          <>

            <li> Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
            <Link to='spots/current'>Manage Spots</Link>
            </li>
            <li>
              <Link to='reviews/current'>Manage Reviews</Link>
            </li>
            <br/>
            <button onClick={handleLogout}>LogOut</button>
          </>
        ): (<>
          <li>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
                onButtonClick={() =>{<LoginFormModal /> }}

  />
            {/* <NavLink to="/login">Log In</NavLink> */}
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignUpModal />}
            />
            {/* <NavLink to="/signup">Sign Up</NavLink> */}
          </li>
        </>)}
      </ul>
    </>
  );
}

export default ProfileButton;
