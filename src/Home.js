import "./index.css";
import React from "react";
import { renderLogin } from "./index.js";
import CH from "./images/HomeSchweiz.svg";
import graph from "./images/HomeBildRechts.svg";
import check from "./images/HomeHaeckchen.svg";
import melanie from "./images/melanie.jpeg";
import oltian from "./images/oltian.jpg";
import luka from "./images/luka.jpeg";
import kevin from "./images/kevin.jpeg"

function Home() {
  return (
    <section className="hero grid p-14">
      <div className="col">
        <div className="flex justify-start items-center mb-2">
          <img className="w-10" src={CH} alt="CH" />
          <p className="ml-1 text-xl">
            <span className="semibold ml-1 text-xl">5+</span> BWL Kapitel
          </p>
        </div>
        <p className="hero-text semibold text-9xl mb-2">
          Prüfe dein BWL-Wissen,<span className="block"></span> lerne neues und
          erreiche<span className="block"></span> Punkte beim Lernen
        </p>
        <div className="flex justify-start items-center mb-2">
          <img className="w-4" src={check} alt="" />
          <p className="ml-1 text-base">Fragen zum KLV-Verlag BWL-Buch</p>
        </div>
        <button
          className="jetztspielenbtn semibold bg-black text-white py-3 px-4 rounded-full hover:opacity-80"
          onClick={(e) => goToRegis(e)}
        >
          Jetzt kostenlos spielen
        </button>
        <p className="medium entwicklertxt uppercase">
          Entwickelt und verwendet von Schülern aus der Kanti Baden
        </p>
        <div className="entwickler flex items-start">
          <div className="absolute left-8 xl:left-16 rounded-full h-10 w-10 overflow-hidden">
            <img
              src={melanie}
              alt="Melanie, Bild Entwickler 1"
              className="absolute h-full w-full object-cover rounded-full"
            />
          </div>
          <div className="absolute left-16 xl:left-24 rounded-full h-10 w-10 overflow-hidden">
            <img
              src={oltian}
              alt="Oltian, Bild Entwickler 2"
              className="absolute h-full w-full object-cover rounded-full bg-slate-600"
            />
          </div>
          <div className="absolute left-24 xl:left-32 rounded-full h-10 w-10 overflow-hidden">
            <img
              src={luka} 
              alt="Luka, Bild Entwickler 3"
              className="absolute h-full w-full object-cover rounded-full bg-slate-600"
            />
          </div>
          <div className="absolute left-32 xl:left-40 rounded-full h-10 w-10 overflow-hidden">
            <img
              src={kevin}
              alt="Kevin, Bild Entwickler 4"
              className="absolute h-full w-full object-cover rounded-full bg-slate-600"
            />
          </div>
          <div />
        </div>
      </div>
      <div className="col hidden sm:flex graphImg">
        <img src={graph} alt="Bild nicht verfügbar" />
      </div>
    </section>
  );

  function goToRegis(e) {
    e.preventDefault();
    renderLogin(true);
  }
}

export default Home;
