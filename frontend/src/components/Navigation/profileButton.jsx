import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useEffect } from "react";


function ProfileButton({ user }) {
  const ulRef = useRef();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    // user = dispatch(logout())
    return navigate("/login", { replace: true });
  };

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
  }, [showMenu]);


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu}>
        <i className='fas fa-user-circle' />
      </button>
      <ul className={ulClassName} hidden={!showMenu} ref={ulRef}>
        {user && (
          <>
            <li>
              {user.firstName} {user.lastName}
            </li>
            <li>{user.username}</li>
            <li>{user.email}</li>
            <button onClick={handleLogout}>LogOut</button>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
