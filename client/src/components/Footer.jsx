import React from "react";
import Logo from "../img/Logo.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="Logo" />
      <span>
        Made with 🤍 and <b>React.js</b>
      </span>
    </footer>
  );
};

export default Footer;
