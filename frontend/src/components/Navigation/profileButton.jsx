import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useEffect } from "react";
import LoginFormModal from '../LoginFormModal/LoginFormModal'
import SignUpModal from '../signUpForm/SignUpModal'
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useSelector } from "react-redux";
import { RecentActorsRounded } from "@material-ui/icons";



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
  // console.log(user,'im the userrrrrrrrrr')

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
      <button onClick={toggleMenu}style={{borderRadius: '12px'}} className={'profileButton' } id={'clickable'}>
        <RecentActorsRounded  />
      </button>
      <ul className={ulClassName} hidden={!showMenu} ref={ulRef}>
        {user ? (
          <>

            <li> Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
            <Link to='spots/current' id={'clickable'}>Manage Spots</Link>
            </li>

            <br/>
            <button onClick={handleLogout} className="logoutbutton" id={'clickable'}>LogOut</button>
          </>
        ): (<>
          <li style={{marginBottom:'5px',justifySelf:'center'}}>
            <OpenModalButton

              buttonText="Log In"
              modalComponent={<LoginFormModal />}
                onButtonClick={() =>{<LoginFormModal /> }}

  />
            {/* <NavLink to="/login">Log In</NavLink> */}
          </li>
          <li id={'clickable'}>
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
