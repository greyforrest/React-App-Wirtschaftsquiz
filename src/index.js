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

var loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
var loggedInUserPass = localStorage.getItem("loggedInUserPass");
var loggedInUserPunkte = localStorage.getItem("loggedInUserPunkte");


//Zeigt s Login im root Element ah
export const renderLogin = (isRegister) => {
  localStorage.setItem("loggedInUserEmail", null)
  localStorage.setItem("loggedInUserPass", null)
  localStorage.setItem("loggedInUserPunkte", null)
  root.render(<Login register={isRegister} />);
};

//Loggt us idem dass es de Navbar en leere User mitgit und d Homesite azeigt
export const renderLogout = () => {
  localStorage.setItem("loggedInUserEmail", null)
  localStorage.setItem("loggedInUserPass", null)
  localStorage.setItem("loggedInUserPunkte", null)
  //Zeigt d Navigation im navbar-Element (neu) ah
  navbar.render(<Navbar user={null} />);
  //Zeigt d Startsite im root-Element ah
  root.render(<Home />);
};

//Zeigt s Quiz im root-Element ah
//nimmt Kapitel und de aktuell igloggti Nutzer entgege und gits em Quiz witer
export const renderQuiz = (kapitel, user) => {
  localStorage.setItem("loggedInUserEmail", user.email)
  localStorage.setItem("loggedInUserPass", user.passwort)
  localStorage.setItem("loggedInUserPunkte", user.punkte)  
  root.render(<Quiz kapitel={kapitel} user={user} />);
};

//Zeigt d Kapitelwahl im root-Element ah
//nimmt de aktuell igloggti Nutzer entgege und gits de Kapitelsite witer zums denn em Quiz witerzgä
export const renderKapitelwahl = (user) => {
  localStorage.setItem("loggedInUserEmail", user.email)
  localStorage.setItem("loggedInUserPass", user.passwort)
  localStorage.setItem("loggedInUserPunkte", user.punkte)
  root.render(<Kapitelwahl user={user} />)
};

//Zeigt d Navbar im navbar-Element ah
//nimmt de aktuell igloggti Nutzer entgege und gits de Navbar witer
export const renderNavbar = (n) => {
  navbar.render(<Navbar user={n} />);
};

//Zeigt d Startsite im root-Element ah
export const renderHome = () => {
  localStorage.setItem("loggedInUserEmail", null)
  localStorage.setItem("loggedInUserPass", null)
  localStorage.setItem("loggedInUserPunkte", null)
  root.render(<Home />);
};

//Es werde am Afang immer d Navbar (ohni Nutzer) und d Startsite azeigt
if(loggedInUserEmail !== null && loggedInUserPass !== null && loggedInUserPunkte !== null){
  var user = {email: loggedInUserEmail, passwort: loggedInUserPass, punkte: loggedInUserPunkte};
  renderNavbar(user);
  renderKapitelwahl(user);
} else {
  renderNavbar(null);
  renderHome();
}

