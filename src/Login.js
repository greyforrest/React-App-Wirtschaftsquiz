import "./index.css";
import login from "./images/LoginRegister.svg";
import React, { useState } from "react";
//firebase sache
import { initializeApp } from "firebase/app";
import { ref, onValue, set, getDatabase } from "firebase/database";
//config beinhaltet d Datebankdate
import firebaseConfig from "./config";
//dient als "Navigation"
import { renderKapitelwahl, renderNavbar } from "./index.js";
//hash vo passwörter
import bcrypt from "bcryptjs";

//De user wo grad igloggt isch (zu beginn null)
var user = null;

//Firebase Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//DListe vo allne Users (zum Login und Registriere kontrolliere/usfüehre)
var users = null;

//Variable vom Formular
var email = "";
var passwort = "";
var repeatPasswort = "";

//Öb registriere oder login azeigt wird, wird mitgä bim öffne (isRegister === true heisst Registriere wird azeigt)
var isRegister = null;

//Öb uf "Noch kein Konto/Bereits ein Konto" klickt worde isch
var switched = false;

//Komponent Login
//Props beinhaltet:
//register = false/true: öbs registriere oder login isch
function Login(props) {
  //wenn update mit shouldUpdate irgendwo im code gänderet wird, wird de Komponent neu glade
  const [update, shouldUpdate] = useState(false);
  //Wird brucht demit ned wieder us de Props usgläse wird was für en Status (Register/Login) isch wenn mit
  //"Noch kein Konto/Bereits ein Konto" gwechslet wird (süsch wird ned gwechslet)
  if (!switched) {
    //öb registriere oder login wird us de props glese
    isRegister = props.register;
    //alli felder werde gleert wenn mit anmelden/registrieren (us de navbar) gwechslet wird
    Array.from(document.getElementsByTagName("input")).forEach(
      (i) => (i.value = "")
    );
  } else {
    //wenn gswitched worde isch mit "Noch kein Konto/Bereits ein Konto" wird das wieder uf false gsetzt
    //demit wemmer jetzt via Anmelden/Registrieren wechslet wieder uf d Props gluegt wird
    switched = false;
  }
  //Login wird azeigt
  if (!isRegister) {
    return (
      <div className="w-full h-full flex p-7 pt-20">
        <div className="loginform w-full h-96 md:w-1/2 md:p-8 shadow-2xl rounded-md">
          <form className="w-full">
            <p className="mx-auto medium text-center w-full text-2xl mb-5 text-violet-400">
              Anmelden
            </p>
            <label className="mt-5 regular text-gray-600">Email:</label>
            <br />
            <input
              type="text"
              onChange={(e) => handleEmailChange(e)}
              name="email"
              className="mt-1 w-full mb-5 py-1 px-1 bg-white border border-slate-300 rounded-md text-sm focus:outline-violet-400"
            />
            <br />
            <label className="mt-5 regular text-gray-600">Passwort:</label>
            <br />
            <input
              type="password"
              onChange={(e) => handlePassChange(e)}
              name="passwort"
              className="mt-1 w-full py-1 px-1 bg-white border border-slate-300 rounded-md text-sm focus:outline-violet-400"
            />
            <br />
            <div className="flex justify-center items-center my-5">
              <button
                id="submit"
                onClick={(e) => logIn(e)}
                className="loginbtn w-1/3 medium bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-lg text-md"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center items-center mt-5 pb-5">
              <button
                id="switch"
                onClick={(e) => switchTo(e)}
                className="keinkontobtn bg-transparent regular text-violet-400 py-2 px-4 border border-violet-400 rounded-lg text-sm hover:text-violet-600 hover:border-violet-600"
              >
                Noch kein Konto?
              </button>
            </div>
          </form>
        </div>
        <div className="md:w-1/2 loginimg flex justify-center">
          <img src={login} width="500" alt="Bild nicht verfügbar" />
        </div>
      </div>
    );
    //Registrieren wird azeigt
  } else {
    return (
      <div className="h-full w-full flex p-7">
        <div className="registerform w-full md:w-1/2 md:p-8 shadow-2xl rounded-md">
          <form className="w-full">
            <p className="mx-auto medium text-center w-full text-2xl mb-5 text-violet-400">
              Registrieren
            </p>
            <label className="mt-5 regular text-gray-600">Email:</label>
            <br />
            <input
              type="text"
              onChange={(e) => handleEmailChange(e)}
              name="email"
              className="mt-1 w-full mb-5 py-1 px-1 bg-white border border-slate-300 rounded-md text-sm focus:outline-violet-400"
            />
            <br />
            <label className="mt-5 regular text-gray-600">Passwort:</label>
            <br />
            <input
              type="password"
              onChange={(e) => handlePassChange(e)}
              name="passwort"
              className="mt-1 mb-5 w-full py-1 px-1 bg-white border border-slate-300 rounded-md text-sm focus:outline-violet-400"
            />
            <br />
            <label className="mt-5 regular text-gray-600">
              Passwort wiederholen:
            </label>
            <br />
            <input
              type="password"
              onChange={(e) => handleRepPassChange(e)}
              name="passwort"
              className="mt-1 w-full mb-5 py-1 px-1 bg-white border border-slate-300 rounded-md text-sm focus:outline-violet-400"
            />
            <br />
            <div className="flex justify-center items-center my-5">
              <button
                id="submit"
                onClick={(e) => register(e)}
                className="registrierenbtn w-1/3 medium bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-lg text-md"
              >
                Registrieren
              </button>
            </div>
            <div className="flex justify-center items-center mt-5 pb-5">
              <button
                id="switch"
                onClick={(e) => switchTo(e)}
                className="bereitskontobtn bg-transparent regular text-violet-400 py-2 px-4 border border-violet-400 rounded-lg text-sm hover:text-violet-600 hover:border-violet-600"
              >
                Schon ein Konto?
              </button>
            </div>
          </form>
        </div>
        <div className="md:w-1/2 loginimg flex justify-center">
          <img src={login} width="500" height="300" alt="Bild nicht verfügbar" />
        </div>
      </div>
    );
  }

  //Passe d Variable vo de Igabfelder ah wenn öppis igäh wird
  //e.preventDefault() wird brucht, demit methode ned automatisch usgfüehrt wird ohni chnopfdruck/änderig
  function handleEmailChange(e) {
    e.preventDefault();
    email = e.target.value;
  }

  function handlePassChange(e) {
    e.preventDefault();
    passwort = e.target.value;
  }

  function handleRepPassChange(e) {
    e.preventDefault();
    repeatPasswort = e.target.value;
  }

  //Wenn uf registriere drückt wird
  function register(e) {
    e.preventDefault();
    //registriere funktioniert nur wenn d email ned leer isch, s passwort ned leer isch und passwort und repeatpasswort glich sind
    //checkRegisterData => siehe Methode witer unde
    if (
      checkRegisterData(e)
    ) {
      if (email.replace(/\s/g, "") !== "" &&
        passwort.replace(/\s/g, "") !== "") {
        if (passwort !== repeatPasswort) {
          alert("Die Passwörter stimmen nicht überein.")
        } else {
          //Passwort wird ghashed für id db
          //Quelle: https://www.npmjs.com/package/bcrypt
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(passwort, salt, function (err, hash) {
              writeUserData(e, hash);
            });
          });
          //user wird updated demit d navbar email und dpünkt azeige chan
          //punkte == totale punkte (alle kapitel)
          //Warum 0? Will er neu registriert isch und no ke pünkt het
          user = { email: email, passwort: passwort, punkte: 0 };
          //siehe index.js
          renderNavbar(user);
          renderKapitelwahl(user, true);
        }
      } else {
        alert("Weder das Passwort noch die Email dürfen leer sein oder nur aus Leerzeichen bestehen.")
      }

    }
  }

  //Wenn uf Login drückt wird
  //PROBLEM: User muess zwei mal uf Login drücke, will d Datebank bim erste mal ned glade wird
  //Warum wird d Datebank ned glade? ich weiss es ned
  function logIn(e) {
    e.preventDefault();
    getUserData(e);
    //wenn d Userliste glade/ned leer isch wird dur alli user durerotiert
    var userFound = false;
    if (users !== null && users.length > 0) {
      users.every((user) => {
        //will s Passwort ghashed isch wirds mit bcrypt vergliche
        //Quelle: https://www.npmjs.com/package/bcrypt
        if (user.email === email && bcrypt.compareSync(passwort, user.passwort)) {
          userFound = true;
          return false;
        }
        return true;
      });
    }
    //wenn s passwort und d email beides i de datebank sind, isch de user scho registriert und wird igloggt
    if (userFound) {
      //user wird updated demit d navbar email und dpünkt azeige chan
      //punkte == totale punkte (alle kapitel) => siehe Methode witer unde
      user = { email: email, passwort: passwort, punkte: getPunkte(email, e) };
      //siehe index.js
      renderNavbar(user);
      renderKapitelwahl(user, true);
      //wenn de user ned gfunde worde isch, gits en Fehler
    } else {
      //d userliste isch da, aber de user ned i de liste
      if (users !== null) {
        alert(
          "Login ist gescheitert. Diesen Nutzer mit dieser Email und diesem Passwort scheint es nicht zu geben."
        );
        //d userliste isch ned da, deswege chaner ned igloggt werde (Siehe PROBLEM obe)
      } else {
        alert("Ein Bug, den wird noch nicht lösen konnten, ist aufgetreten. Klicke nochmals auf den Knopf, um das Login zu bestätigen oder allenfalls eine richtige Fehlermeldung zu bekommen.");
      }
    }
  }

  //Wechsel zwüsche Login//Registrierig wenn uf "Noch kein Konto/Bereits ein Konto" drückt wird
  function switchTo(e) {
    e.preventDefault();
    //d Variable vom Formular werde gleert
    email = "";
    passwort = "";
    repeatPasswort = "";
    //d Felder vom Formular werde gleert
    Array.from(document.getElementsByTagName("input")).forEach(
      (i) => (i.value = "")
    );
    //S gegeteil vo dem wos vorher gsi isch
    isRegister = !isRegister;
    //es isch durch switch gwechslet worde
    switched = true;
    //Komponent wird neu glade
    shouldUpdate(!update);
  }

  //luegt, dass d Email es @ und en . het und ned bereits i de db isch
  //PROBLEM: User muess zwei mal uf Login drücke, will d Datebank bim erste mal ned glade wird
  //Warum wird d Datebank ned glade? ich weiss es ned
  function checkRegisterData(e) {
    e.preventDefault();
    //@ und . vorhande?
    if (email.indexOf("@") !== -1 && email.indexOf(".") !== -1) {
      var emailFound = false;
      getUserData(e);
      //d Liste isch da und ned leer
      if (users !== null && users.length > 0) {
        //alli user werde duregange zum luege öb d email scho dinne isch
        users.every((user) => {
          if (user.email === email) {
            emailFound = true;
            return false;
          }
          return true;
        });
      }
      //wenn d Liste ned glade wird (Siehe PROBLEM obe)
      if (users === null) {
        alert("Ein Bug, den wird noch nicht lösen konnten, ist aufgetreten. Klicke nochmals auf den Knopf, um die Registrierung zu bestätigen oder allenfalls eine richtige Fehlermeldung zu bekommen.");
        return false;
      }
      //wenn dEmail ned dinne isch isch guet
      if (!emailFound) {
        return true;
      }
      //wenn dEmail scho dinne isch
      alert("Es gibt bereits einen Account mit dieser Email.");
      return false;
    }
    //Email het kes @ oder ke . oder beides ned
    alert("Deine Email scheint nicht korrekt zu sein.");
    return false;
  }

  //Schriebt id Datebank
  //e !== undefined macht i dem fall sgliche wie e.preventDefault() (oder söts ämu)
  //Quelle: https://firebase.google.com/docs/database/web/read-and-write
  function writeUserData(e, hash) {
    if (e !== undefined) {
      //macht en neue itrag a de stell 0 oder zhinderst
      set(ref(db, "users/" + (users.length === null ? 0 : users.length)), {
        email: email,
        passwort: hash,
        //Pünkt vo allne 10 Kapitel (kapitel 5 und 7 gits ned, sind aber trotzdem drin zums eifacher mache)
        //Kapitel 11 hemmer dussegloh
        punkte: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      });
    }
  }

  //Holt alli Userdate us de Datebank (funktioniert meistens bim erste mal ned => Wieso? ich weiss es ned)
  //Quelle: https://firebase.google.com/docs/database/web/read-and-write
  function getUserData(e) {
    if (e !== undefined) {
      //verbindig zu de Datebank und em unterstamm "users"
      const query = ref(getDatabase(app), "users/");
      //holt sich die wert wo det sind (snapshot) und speicheret die i de users
      onValue(query, (snapshot) => {
        users = snapshot.val();
      });
    }
  }

  //Holt sich d Pünkt pro Kategorie vom ne User und git die total punktzahl zrüg
  function getPunkte(email, e) {
    if (e !== undefined) {
      var punkteArr = null;
      //users werde im login bereits gholt und sötte ned null si
      if (users !== null && users.length > 0) {
        //goht alli user dure und suecht de mit de email vo dem wo igloggt isch
        users.every((user) => {
          if (user.email === email) {
            //speicheret det denn alli pünkt (alli kapitel ab)
            punkteArr = user.punkte;
            return false;
          }
          return true;
        });
      }
      //wenn d users doch null sind oder d Pünkt ned gfunde worde sind
      if (users === null || punkteArr === null) {
        alert("Es ist ein Fehler aufgetreten. Versuche es nochmals.");
        return null;
      }
      //alli pünkt werde duregange und zämezellt und denn zruggä
      var punkte = 0;
      punkteArr.every((punktzahl) => {
        punkte = punkte + punktzahl;
        return true;
      });
      return punkte;
    }
  }
}

//Ganze Komponent wird exportiert falls <Login /> importiert und ufgruefe wird
export default Login;
