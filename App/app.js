import data from "./CagematchData.json" with { type: "json" };
const WrestlerOneEl = document.getElementById("WrestlerOne");
const WrestlerTwoEl = document.getElementById("WrestlerTwo");
const WrestlerOneNameEl = document.getElementById("WrestlerOneName");
const WrestlerTwoNameEl = document.getElementById("WrestlerTwoName");
const WrestlerOneRatingEl = document.getElementById("WrestlerOneRating");
const WrestlerTwoRatingEl = document.getElementById("WrestlerTwoRating");
let contestantOne = {};
let contestantTwo = {};

const submitChoice = (choice, button) => {
  let unchosen = {};
  let unchosenBtn = "";
  const chosenBtn = button;
  if (choice === contestantOne) {
    unchosen = contestantTwo;
    unchosenBtn = WrestlerTwoEl;
  } else {
    unchosen = contestantOne;
    unchosenBtn = WrestlerTwoEl;
  }
  const chosenRating = choice.ratingText;
  const unchosenRating = unchosen.ratingText;

  if (chosenRating === unchosenRating) {
    console.log("tie");
  }
  if (chosenRating > unchosenRating) {
    console.log("correct");
  }
  if (chosenRating < unchosenRating) {
    console.log("incorrect");
  }
  WrestlerOneRatingEl.classList.add("visible");
  WrestlerTwoRatingEl.classList.add("visible");
};

WrestlerOneEl.addEventListener("click", () => {
  submitChoice(contestantOne, WrestlerOneEl);
});
WrestlerTwoEl.addEventListener("click", () => {
  submitChoice(contestantTwo, WrestlerTwoEl);
});

const loadMatchup = () => {
  contestantOne = data[Math.floor(Math.random() * data.length)];
  contestantTwo = data[Math.floor(Math.random() * data.length)];

  WrestlerOneNameEl.textContent = contestantOne.nameText;
  WrestlerTwoNameEl.textContent = contestantTwo.nameText;
  WrestlerOneRatingEl.textContent = contestantOne.ratingText;
  WrestlerTwoRatingEl.textContent = contestantTwo.ratingText;
};

loadMatchup();
