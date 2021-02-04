/*jshint esversion: 6 */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// As can be found on github: https://github.com/portexe/VanillaCalendar/blob/master/script.js                             //
// Referenced from PortEXE                                           /   //                                                //
// as used in their demo "Coding A Calendar App In Plain JavaScript":  https://www.youtube.com/watch?v=m9OSBJaQTlM         //
// Adapted by by Rebecca Rosies for the Use of Full projects course @ Erasmushogeschool Brussel                            //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let nav = 0; //0 = current month -> if now = may -> juni nav = + 1, april nav = -1
let clicked = null; // clicked = whatever day we've clicked on
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];
// get an item , if it exists: use JSON.parse to get the array of event objects, if it doesn't exist get an empty array
// we'll later make it so if a user adds or deletes an event we'll manipulate the array and then restore it into local storage

//constants:
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturaday"
]; //we're gonna use this to determine the number of paddingdays required
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput"); // to get the input of the modal
const calendar = document.getElementById("calendar");

function openModal(date) {
  clicked = date;

  // to find an event that already exists for that day
  const eventForDay = events.find((e) => e.date === clicked);
  //but it could also be that there isnt an event for that day so:
  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }
  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDay();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  //console.log(day, month, year); // -> month uses indexvalue (~array) -> januari = 0 !!!!-> always month + 1
  const firstDayOfMonth = new Date(year, month, 1); // ==> first day of the month
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // month + 1 = next month && 0 for the day  = last day of previous day  ===> last day of this month

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }); // to see on what weekday the firstday of the month falls
  //if its friday -> indexnumber of friday = 5 -> 5 padding days

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]); // splits array into 2 items: weekday & 1/x/202x

  //to display the right month:
  document.getElementById(
    "monthDisplay"
  ).innerText = `${dt.toLocaleDateString("en-us", { month: "long" })} ${year}`; //`${}` = string interpolation -> WITH BACKTICKS!!!

  //to wipe the month when clicking on next:
  calendar.innerHTML = "";

  //for loop to loop through the paddingdays and all of the days in the month and render all of these in a long row that folds and wraps down to a grid
  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    //paddingday or normalday?:
    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays; //number of the day
      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventForDay) {
        // if there is an event for the day that we chose
        const eventDiv = document.createElement("div"); // create a div
        eventDiv.classList.add("event"); // set a class
        eventDiv.innerText = eventForDay.title; // set the text
        daySquare.appendChild(eventDiv); // put it inside of the daysquare
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");
    events.push({
      date: clicked,
      title: eventTitleInput.value
    });
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });
  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });
  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);

  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
}

initButtons();
load(); //one time call when loading the browser + throughout the application as user clicks stuff: call load again
