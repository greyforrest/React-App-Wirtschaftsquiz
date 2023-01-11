import "./index.css";
import React from "react";
//Siehe index.js
import {
  renderLogin,
  renderLogout,
  renderHome,
  renderKapitelwahl,
} from "./index.js";

//S Navbar Element vo glichzitig als "Navigation" dient
//Wieso "Navigation"? Es wird ke Site gwechslet sondern eifach es anderes Element uf dere Site glade
function Navbar(props) {
  var user = props.user !== undefined ? props.user : null;
  //Wenn öpper igloggt isch wird rechts d Punktzahl und d Email vom Nutzer sowie "Ausloggen" azeigt
  // Wirtschaftsquiz obe rechts chamer nöd ahklicke, wills mega kurz ish, ich glaube hinte dra ish no HOME deswege so kurz wie das wort home
  if (user != null) {
    return (
      <header className="h-28 grid grid-col-5 grid-rows-2 gap-2 sm:h-auto sm:grid-cols-none sm:grid-rows-none sm:flex sm:justify-end sm:items-center p-7">
        <button
          onClick={(e) => navKapitelwahl(e, user)}
          className="col-span-3 row-start-1 sm:col-auto bold title text-[20px] mr-auto cursor-pointer"
        >
          Wirtschaftsquiz
        </button>
        <p className="h-8 sm:h-auto w-14 sm:w-auto px-2 col-start-1 text-xs sm:text-md md:text-lg lg:text-xl row-start-2 sm:col-auto sm:row-auto text-black userpunkte rounded-full bg-violet-200 p-2">
          <span>🏆 </span>
          {props.user.punkte}
        </p>
        <div className="flex justify-center items-end text-right col-start-5 row-start-2 sm:col-auto sm:row-auto">
          <p className="text-xs lg:text-lg sm:text-base ml-5 mr-5 italic">{props.user.email}</p>
        </div>
        <button
          onClick={(e) => navLogOut(e)}
          className="semibold row-start-1 right-10 absolute sm:relative text-xs sm:right-auto md:text-lg lg:text-xl sm:col-auto sm:row-auto logbtn h-7 sm:h-auto bg-black w-20 sm:w-auto hover:opacity-80 text-white py-2 px-2 sm:px-4 rounded-full"
        >
          Ausloggen
        </button>
      </header>
    );
    //Wenn niemmer igloggt isch wird recht "Anmelden" und "Registrieren" azeigt
  } else {
    return (
      <header className="flex justify-end items-center p-7">
        <button
          onClick={(e) => navHome(e)}
          className="bold title text-[20px] mr-auto cursor-pointer"
        >
          Wirtschaftsquiz
        </button>
        <button
          onClick={(e) => navAnmelden(e)}
          className="semibold logbtn text-black mr-4 hover:opacity-80"
        >
          Anmelden
        </button>
        <button
          onClick={(e) => navRegistrieren(e)}
          className="semibold registerbtn bg-black hover:opacity-80 text-white py-2 px-4 rounded-full"
        >
          Registrieren
        </button>
      </header>
    );
  }

  //Rendere die jewilige Element uf Chnopfdruck
  //Siehe index.js

  function navHome(e) {
    e.preventDefault();
    renderHome();
  }

  function navAnmelden(e) {
    e.preventDefault();
    renderLogin(false);
  }

  function navRegistrieren(e) {
    e.preventDefault();
    renderLogin(true);
  }

  function navLogOut(e) {
    e.preventDefault();
    renderLogout();
  }

  function navKapitelwahl(e, user) {
    e.preventDefault();
    renderKapitelwahl(user);
  }
}
//Navbar Komponenet wird azeigt wenn <Navbar /> importiert und ufgruefe wird
export default Navbar;
