import './index.css';
import React, { useState } from 'react';
//siehe index.js
import { renderKapitelwahl, renderNavbar } from "./index.js";
//firebase sache
import { initializeApp } from 'firebase/app';
import { get, child, getDatabase, ref, update, onValue } from "firebase/database";
//config beinhaltet d Datebankdate
import firebaseConfig from "./config";

//Azahl richtig beantworteti Frage
var korrekt = 0;

//Alli frage inklusive antwortmöglichkeite und richtig antwort
var fragen = null;

//Kapitel Nummere (wird via props mitgä)
var kapitel = null;

//Buttons
var clickedButton = null;
var correctButton = null;

//Aktuelli Frag inklusive Antwortmöglichkeite und richtig Antwort
var aktuelleFrage = null;

//Fortschritt für d Progressbar
var progress = null;

//Firebase
const app = initializeApp(firebaseConfig)

//agmeldete User zum Resultat speichere 
var user = null;

//Alli user zum bim richtige user update
var users = null;

//Quiz Kompnenet
//Props beinhalte:
//props.user: de igloggti user
//props.kapitel: s Kapitel wo gspielt werde wet
function Quiz(props) {
  user = props.user;
  //Nummere/Position vo de aktuelle Frag
  const [frage, setFrage] = useState(-1);
  //Wenn d Frog -1 isch (also am Start) werde d Frage und korrekt zurückgsetzt
  if (frage === -1) {
    korrekt = 0;
    fragen = null;
  }
  //Wenn kes Kapitel agä isch zellt eifach Kapitel 1
  kapitel = props.kapitel !== undefined ? props.kapitel : 1;
  //Liest alli Frage vom Kapitel i
  readQuestions(kapitel);
  //Wenn d Frog -1 isch (also am Start) wird en Startscreen azeigt
  if (frage < 0) {
    return (
      <div className='w-2/3 h-full mx-auto mt-20'>
        <div className="w-full h-4 rounded-full bg-gray-700"></div>
        <div className="bg-gray-300 rounded-lg h-56 sm:h-64 md:h-80 p-4 sm:p-6 md:p-12 mt-2 sm:mt-5">
          <div>
            <div className=" mt-4 sm:mt-8 md:mt-12">
              <div className='mx-auto text-center text-2xl sm:text-3xl md:text-4xl font-semibold'>
                Bereit für das Quiz zum Kapitel {kapitel}?
              </div>
              <div className='flex justify-center items-center my-6 sm:my-8'>
                <button onClick={e => startQuiz(e)} className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-100 text-sm sm:text-lg md:text-2xl">Starten</button>
              </div>
            </div>
          </div>
        </div>
        <button onClick={e => back(e)} className="float-right my-4 sm:my-8 md:my-12 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-md md:text-xl">Zurück zur Kapitelwahl</button>
      </div>
    );
  } else {
    if (frage !== fragen.length) {
      //aktuelli Frag wird us Fragen gholt (Frag 0 z.b.)
      aktuelleFrage = fragen[frage];
      //Fortschritt wird berechnet
      progress = (frage / fragen.length) * 100;
      //Entweder gits zwei Antwortmöglichkeite...
      if (aktuelleFrage.Art === "2") {
        return (
          <div className='w-2/3 h-full mx-auto mt-20'>
            <div className="w-full h-4 rounded-full bg-gray-700">
              <div className="bg-blue-600 h-4 rounded-full" style={{ width: progress + "%" }}></div>
            </div>
            <div className="bg-gray-300 rounded-lg h-72 md:h-80 py-6 px-4 sm:p-12 mt-2 sm:mt-5 flex justify-center items-center">
              <div>
                <div className="text-base sm:text-xl md:text-2xl lg:text-4xl mb-7 text-center">
                  {aktuelleFrage.Frage}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <button id='A' onClick={e => answeredQuestion(e, "A")} className="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-100 text-xs sm:text-base md:text-lg">{aktuelleFrage.A}</button>
                  <button id='B' onClick={e => answeredQuestion(e, "B")} className="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-100 text-xs sm:text-base md:text-lg">{aktuelleFrage.B}</button>
                </div>
              </div>
            </div>
            <button onClick={e => back(e)} className="float-right my-4 sm:my-8 md:my-12 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-md md:text-xl">Zurück zur Kapitelwahl</button>
          </div>
        );
        //... oder 4
      } else {
        return (
          <div className='w-2/3 h-full mx-auto mt-20'>
            <div className="w-full h-4 rounded-full bg-gray-700">
              <div className="bg-blue-600 h-4 rounded-full" style={{ width: progress + "%" }}></div>
            </div>
            <div className="bg-gray-300 rounded-lg h-min md:h-80 py-6 px-4 sm:p-12 mt-2 sm:mt-5 flex justify-center items-center">
              <div>
                <div className="text-base sm:text-xl md:text-2xl lg:text-4xl mb-7 text-center">
                  {aktuelleFrage.Frage}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <div className="grid grid-rows-2 gap-2 sm:gap-4">
                    <button id='A' onClick={e => answeredQuestion(e, "A")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 sm:px-4 rounded w-100 text-xs sm:text-base md:text-lg">{aktuelleFrage.A}</button>
                    <button id='B' onClick={e => answeredQuestion(e, "B")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 sm:px-4 rounded w-100 text-xs sm:text-base md:text-lg">{aktuelleFrage.B}</button>
                  </div>
                  <div className="grid grid-rows-2 gap-2 sm:gap-4">
                    <button id='C' onClick={e => answeredQuestion(e, "C")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 sm:px-4 rounded w-100 text-xs sm:text-base md:text-lg">{aktuelleFrage.C}</button>
                    <button id='D' onClick={e => answeredQuestion(e, "D")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 sm:px-4 rounded w-100 text-xs sm:text-base md:text-lg">{aktuelleFrage.D}</button>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={e => back(e)} className="float-right my-4 sm:my-8 md:my-12 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-md md:text-xl">Zurück zur Kapitelwahl</button>
          </div>
        );
      }
      //Wenn alli Frage beantwortet sind
    } else {
      //Em user werde d Pünkt guetgschriebe
      updateUserPoints(korrekt, kapitel);
      //En Abschlussscreen
      return (
        <div className='w-2/3 h-full mx-auto mt-20'>
          <div className="w-full h-4 rounded-full bg-gray-700">
            <div className="bg-blue-600 h-4 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: 100 + "%" }}></div>
          </div>
          <div className="bg-gray-300 rounded-lg h-52 sm:h-64 md:h-80 py-6 px-4 sm:px-8 md:px-12 mt-2 sm:mt-5 flex justify-center items-center">
            <div>
              <div className="h-full text-xl md:text-3xl lg:text-4xl font-semibold">
                Du hast {korrekt} von {frage} Fragen zum Kapitel {kapitel} richtig beantwortet.
              </div>
              <button onClick={e => back(e)} className="float-right my-4 sm:my-8 md:my-12 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-lg md:text-2xl">Zurück zur Kapitelwahl</button>
            </div>
          </div>
        </div>
      );
    }
  }

  //Wenn uf "Starten" drückt wird
  function startQuiz(e) {
    e.preventDefault();
    //liest frage nomol ih
    readQuestions(kapitel);
    //setzt die aktuell Fragposition uf 0 (1. Frag)
    setFrage(0);
  }

  //Liest alli Froge us de firebase datebank
  function readQuestions(kapitel) {
    //verbindig zu de datebank
    const dbRef = ref(getDatabase(app));
    if (kapitel != null && fragen == null) {
      //froge müend nur einisch usglese werde, deswege "get" und ned "onValue"
      //holt alli Frage vo "Fragen/kapitelnummere (z.b. 1)"
      //Quelle: https://firebase.google.com/docs/database/web/read-and-write
      get(child(dbRef, "Fragen/" + kapitel)).then((snapshot) => {
        //wenns froge het werde die gspeicheret
        if (snapshot.exists()) {
          fragen = snapshot.val();
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  //holt sich alli userdate zum em richtige user d pünkt zgä
  //Quelle: https://firebase.google.com/docs/database/web/read-and-write
  function getUserData() {
    if (kapitel !== null && korrekt !== null) {
      const query = ref(getDatabase(app), 'users/');
      onValue(query, (snapshot) => {
        const data = snapshot.val();
        users = data;
      });
    }
  }

  //Updated dPünkt vom user am endi
  function updateUserPoints(korrekt, kapitel) {
    //d Verbesserig (oder Verschlechterig) im Verglich zum beste Versuech
    var improvement = 0;
    //D Date werde wieder bim erste mol ned usglese, aber inere Wiederholig scho deswege wirds wiederholt
    //Max 5 mal wills meh au ned bringt
    var count = 0;
    while (users === null && count < 5) {
      count = count + 1;
      getUserData();
    }
    //Zellt welli id zu dem User ghört wo agmeldet isch
    var userid = null;
    count = 0;
    if (users !== null) {
      users.every(dbuser => {
        if (user.email === dbuser.email) {
          userid = count;
          return false;
        }
        count = count + 1;
        return true;
      });
      //Wenns ke userid het gits en fehler
      if (userid === null) {
        alert("Deine Punktzahl konnte wegen eines Fehlers nicht gespeichert werden.");
      } else {
        //Frogt d Pünkt vo ihm im aktuelle Kapitel ab
        var dbuserPunkte = null;
        const query = ref(getDatabase(app), 'users/' + userid + '/punkte/' + (kapitel - 1));
        onValue(query, (snapshot) => {
          const data = snapshot.val();
          dbuserPunkte = data;
        });
        //D Verbesserig/Verschlechterig wird berechnet
        improvement = dbuserPunkte === null ? 0 : (korrekt - dbuserPunkte);
        //Wenns besser isch wird d Datebank updated
        if (dbuserPunkte !== null && dbuserPunkte < korrekt) {
          const updates = {};
          updates["users/" + userid + "/punkte/" + (kapitel - 1)] = korrekt;
          //Ebefalls wiederholige wills ned immer bim erste mal goht
          var updated = false;
          while (!updated && count < 5) {
            updated = update(ref(getDatabase(app)), updates);
          }
          //Fehler wenns au nach 5 mal ned goht
          if (!updated) {
            alert("Deine Punktzahl konnte wegen eines Fehlers nicht gespeichert werden.");
          } else {
            //user wird updated und d pünkt neu berechnet
            user = { email: user.email, passwort: user.passwort, punkte: user.punkte + (improvement >= 0 ? improvement : 0) };
            //siehe index.js
            renderNavbar(user);
          }
        }
        if (dbuserPunkte === null) {
          alert("Deine Punktzahl konnte wegen eines Fehlers nicht gespeichert werden.");
        }
      }
    } else {
      alert("Deine Punktzahl konnte wegen eines Fehlers nicht gespeichert werden.");
    }

  }

  //Wenn en Antwort bim Quiz aklickt wird
  function answeredQuestion(e, choosenOne) {
    e.preventDefault();
    if (document.getElementById(e.target.id)) {

    }
    //Wenns die richtig Antwort isch
    if (choosenOne === aktuelleFrage.Richtig) {
      korrekt = korrekt + 1;
      //De aklickti Button wird grüen und es chönd ke witeri Antworte gwählt werde
      clickedButton = document.getElementById(e.target.id);
      clickedButton.classList.add("bg-green-500");
      clickedButton.classList.remove("bg-blue-500");
      Array.from(document.getElementsByTagName("button")).forEach(b => b.classList.remove("hover:bg-blue-700"));
      Array.from(document.getElementsByTagName("button")).forEach(b => b.setAttribute("disabled", "true"));
    } else {
      //Wenns die falshc Antwort isch
      //Aklickte Button wird rot
      clickedButton = document.getElementById(e.target.id);
      clickedButton.classList.add("bg-red-600");
      clickedButton.classList.remove("bg-blue-500");
      //Die richtig Antwort wird grüen
      correctButton = document.getElementById(aktuelleFrage.Richtig);
      correctButton.classList.add("bg-green-500");
      correctButton.classList.remove("bg-blue-500");
      //Es chönne ke witeri Antworte aklickt werde
      Array.from(document.getElementsByTagName("button")).forEach(b => b.classList.remove("hover:bg-blue-700"));
      Array.from(document.getElementsByTagName("button")).forEach(b => b.setAttribute("disabled", "true"));
    }
    //Nach 2.5 Sekunde chunnt die nöchst Frog
    setTimeout(updateQuestion, 2000);
  }

  //Zeigt die nöchst Frog ah
  function updateQuestion() {
    setFrage(frage + 1);
    //Buttons chönnd wieder aklickt werde
    Array.from(document.getElementsByTagName("button")).forEach(b => b.classList.add("hover:bg-blue-700"));
    Array.from(document.getElementsByTagName("button")).forEach(b => b.removeAttribute("disabled"));
    //De grüen button (und de rot falls vorhande) werde wieder blaue
    if (correctButton != null) {
      clickedButton.classList.remove("bg-red-600");
      clickedButton.classList.add("bg-blue-500");
      correctButton.classList.remove("bg-green-500");
      correctButton.classList.add("bg-blue-500");
      correctButton = null;
      clickedButton = null;
    } else {
      clickedButton.classList.remove("bg-green-500");
      clickedButton.classList.add("bg-blue-500");
      clickedButton = null;
    }
  }

  //Navigiert zrüg uf d Homepage
  function back(e) {
    e.preventDefault();
    renderKapitelwahl(user);
  }
};

//Quiz Komponent wird azeigt wenn <Quiz /> ufgrüefe und importiert wird
export default Quiz;