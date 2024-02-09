import React, { useContext, useEffect, useState } from "react";
import Logo from "../img/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [username, setUsername] = useState(currentUser?.username || "");

  useEffect(() => {
    setUsername(currentUser?.username || "");
  }, [currentUser]);

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="links">
          <div className="category-links">
            <Link className="link" to="/?cat=tech">
              <h6>TECH</h6>
            </Link>
            <Link className="link" to="/?cat=movies">
              <h6>MOVIES</h6>
            </Link>
            <Link className="link" to="/?cat=design">
              <h6>DESIGN</h6>
            </Link>
            <Link className="link" to="/?cat=food">
              <h6>FOOD</h6>
            </Link>
          </div>
          <div className="other-links">
            {currentUser ? (
              <>
                <span>{username}</span>
                <Link className="link" to="/edit-profile">
                  <h6>Edit Profile</h6>
                </Link>
                <span onClick={logout}>
                  <h6>Logout</h6>
                </span>
              </>
            ) : (
              <Link className="link" to="/login">
                Login
              </Link>
            )}
            <span className="write">
              <Link className="link" to="/write">
                Write
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
