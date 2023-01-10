//firebase sache
import { initializeApp } from "firebase/app";
import { get, child, getDatabase, ref, onValue } from "firebase/database";
//config beinhaltet d Datebankdate
import firebaseConfig from "./config";
import React, { useState } from "react";
import { renderQuiz } from "./index.js";

//Alli Frage
var fragen = null;
//Agmeldete Nutzer
var user = null;
//Alle user für uslese vo db
var users = null;
//Firebase
const app = initializeApp(firebaseConfig);
//boolean array für alli quizzes wo scho gspielt worde sind
var completelyDone = true;
var alreadyPlayed = [];

//Alli frage inklusive antwortmöglichkeite und richtig antwort
function Kapitelwahl(props) {
  const [update, shouldUpdate] = useState(false);
  readQuestions();
  user = props.user;
  //Quelle: https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
  const rows = [];
  alreadyPlayed = [];
  if (alreadyPlayed.length === 0) {
    completelyDone = true;
    quizzesAlreadyPlayed();
  }
  if (fragen !== null && alreadyPlayed.length > 0) {
    for (let i = 1; i <= fragen.length; i++) {
      if (fragen[i] !== undefined && fragen[i].length !== null) {
        if (completelyDone) {
          rows.push(
            <button onClick={(e) => openQuiz(e, i)}>
              <div key={i}>
                <div className="bg-green-300 max-w-md rounded-lg overflow-hidden shadow-lg">
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">Kapitel {i}</div>
                    <p className="text-gray-700 text-base">
                      {alreadyPlayed[i - 1][1]} von {fragen[i].length} Fragen
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        } else {
          if (alreadyPlayed[i - 1][0]) {
            rows.push(
              <button onClick={(e) => openQuiz(e, i)}>
                <div key={i}>
                  <div className="bg-slate-200 max-w-md rounded-lg overflow-hidden shadow-lg">
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">Kapitel {i}</div>
                      <p className="text-gray-700 text-base">
                        {alreadyPlayed[i - 1][1]} von {fragen[i].length} Fragen
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          } else {
            rows.push(
              <button onClick={(e) => openQuiz(e, i)}>
                <div key={i}>
                  <div className="max-w-md rounded-lg overflow-hidden shadow-lg">
                    <div className="px-6 py-4 hover:bg-violet-200">
                      <div className="font-bold text-xl mb-2">Kapitel {i}</div>
                      <p className="text-gray-700 text-base">
                        0 von {fragen[i].length} Fragen
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          }
        }
      }
    }
    return (
      <div className="p-16">
        <h1 className="text-3xl medium uppercase mb-5">BWL-Quizze</h1>
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {rows}
        </div>
      </div>

    );
  } else {
    return (
      <div className="flex justify-center items-center h-100 p-10">
        <div>
          <p className="text-3xl mb-10">Quizze konnten nicht geladen werden.</p>
          <div className="flex justify-center items-center">
            <button
              onClick={(e) => reload(e)}
              className="medium bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-md"
            >
              Neu laden
            </button>
          </div>
        </div>
      </div>
    );
  }

  function openQuiz(e, kapitel) {
    e.preventDefault();
    renderQuiz(kapitel, user);
  }

  function reload(e) {
    e.preventDefault();
    readQuestions();
    quizzesAlreadyPlayed();
    shouldUpdate(!update);
  }

  //Liest alli Froge us de firebase datebank
  function readQuestions() {
    //verbindig zu de datebank
    const dbRef = ref(getDatabase(app));
    if (fragen == null) {
      //froge müend nur einisch usglese werde, deswege "get" und ned "onValue"
      //holt alli Frage vo "Fragen/kapitelnummere (z.b. 1)"
      //Quelle: https://firebase.google.com/docs/database/web/read-and-write
      get(child(dbRef, "Fragen/"))
        .then((snapshot) => {
          //wenns froge het werde die gspeicheret
          if (snapshot.exists()) {
            fragen = snapshot.val();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  //holt sich alli userdate zum em richtige user d pünkt zgä
  //Quelle: https://firebase.google.com/docs/database/web/read-and-write
  function getUserData() {
    if (fragen !== null && users == null) {
      const query = ref(getDatabase(app), "users/");
      onValue(query, (snapshot) => {
        const data = snapshot.val();
        users = data;
      });
    }
  }

  function quizzesAlreadyPlayed() {
    if (fragen !== null && alreadyPlayed.length === 0) {
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
        users.every((dbuser) => {
          if (user.email === dbuser.email) {
            userid = count;
            return false;
          }
          count = count + 1;
          return true;
        });
        //Wenns ke userid het gits en fehler
        if (userid === null) {
          alert("Es ist ein Fehler vorgefallen.");
        } else {
          //Frogt d Pünkt vo ihm im aktuelle Kapitel ab
          var dbuserPunkte = null;
          const query = ref(getDatabase(app), "users/" + userid + "/punkte/");
          onValue(query, (snapshot) => {
            const data = snapshot.val();
            dbuserPunkte = data;
          });
          if (dbuserPunkte === null) {
            alert("Es ist ein Fehler vorgefallen.");
          } else {
            count = -1;
            dbuserPunkte.every((punktzahl) => {
              count = count + 1;
              if (
                fragen[count + 1] !== undefined &&
                fragen[count + 1].length !== null
              ) {
                if (punktzahl > 0) {
                  if (punktzahl === fragen[count + 1].length) {
                    completelyDone = completelyDone && true;
                  } else {
                    completelyDone = false;
                  }
                  alreadyPlayed.push([true, punktzahl]);
                  return true;
                } else {
                  completelyDone = false;
                  alreadyPlayed.push([false, punktzahl]);
                  return true;
                }
              } else {
                alreadyPlayed.push([false, 0]);
                completelyDone = completelyDone && true;
                return true;
              }
            });
          }
        }
      } else {
        alert("Es ist ein Fehler vorgefallen.");
      }
    }
  }
}

export default Kapitelwahl;
