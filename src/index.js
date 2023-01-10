import ReactDOM from "react-dom/client";
import "./index.css";
import React from "react";

//Alli Komponente wo brucht werde werde importiert
import Login from "./Login.js";
import Quiz from "./Quiz.js";
import Navbar from "./Navbar.js";
import Home from "./Home.js";
import Kapitelwahl from "./Kapitelwahl.js"

//Root Element und Navbar Element werde im index.html File gsuecht und usgwählt
const root = ReactDOM.createRoot(document.getElementById("root"));
const navbar = ReactDOM.createRoot(document.getElementById("navbar"));

//Zeigt s Login im root Element ah
export const renderLogin = (n) => {
  root.render(<Login register={n} />);
};

//Loggt us idem dass es de Navbar en leere User mitgit und d Homesite azeigt
export const renderLogout = () => {
  //Zeigt d Navigation im navbar-Element (neu) ah
  navbar.render(<Navbar user={null} />);
  //Zeigt d Startsite im root-Element ah
  root.render(<Home />);
};

//Zeigt s Quiz im root-Element ah
//nimmt Kapitel und de aktuell igloggti Nutzer entgege und gits em Quiz witer
export const renderQuiz = (kapitel, user) => {
  root.render(<Quiz kapitel={kapitel} user={user} />);
};

//Zeigt d Kapitelwahl im root-Element ah
//nimmt de aktuell igloggti Nutzer entgege und gits de Kapitelsite witer zums denn em Quiz witerzgä
export const renderKapitelwahl = (user, finished) => {
 root.render(<Kapitelwahl user={user} finished={finished}/>)
};

//Zeigt d Navbar im navbar-Element ah
//nimmt de aktuell igloggti Nutzer entgege und gits de Navbar witer
export const renderNavbar = (n) => {
  navbar.render(<Navbar user={n} />);
};

//Zeigt d Startsite im root-Element ah
export const renderHome = () => {
  root.render(<Home />);
};

//Es werde am Afang immer d Navbar (ohni Nutzer) und d Startsite azeigt
renderNavbar(null);
renderHome();
