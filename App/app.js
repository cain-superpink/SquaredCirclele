import WrestlerDataArray from "./CagematchData.json" with { type: "json" };
const WrestlerOneEl = document.getElementById("WrestlerOne");
const WrestlerTwoEl = document.getElementById("WrestlerTwo");
const scoreTextEl = document.getElementById("scoreText");
const answerText = document.getElementById("answer");
const nextBtnEl = document.getElementById("nextbtn");
const startBtnEl = document.getElementById("startbtn");
const gameContainerEl = document.getElementById("gameContainer");
const pickerBoxEl = document.getElementById("pickerBox");
const scoreCircleElArray = document.getElementsByClassName("scoreCircle");

const contestantOne = {
  button: WrestlerOneEl,
  wrestlerData: WrestlerDataArray[0],
};
const contestantTwo = {
  button: WrestlerTwoEl,
  wrestlerData: WrestlerDataArray[1],
};
const contestants = [contestantOne, contestantTwo];

const scoreArray = [];
let roundNumber = 0;
let score = 0;

startBtnEl.addEventListener("click", () => {
  startGame();
});

WrestlerOneEl.addEventListener("click", () => {
  submitChoice(contestantOne, WrestlerOneEl);
});
WrestlerTwoEl.addEventListener("click", () => {
  submitChoice(contestantTwo, WrestlerTwoEl);
});

nextBtnEl.addEventListener("click", () => {
  nextRound();
  loadMatchup();
});

const startGame = () => {
  roundNumber = 0;
  score = 0;
  loadMatchup();
  scoreTextEl.classList.add("hidden");
  gameContainerEl.classList.add("visible");
  pickerBoxEl.classList.remove("hidden");
  nextBtnEl.classList.remove("hidden");
  startBtnEl.classList.add("hidden");
  document
    .querySelectorAll(".scoreCircle")
    .forEach((circle) => (circle.classList = "scoreCircle"));
};

const submitChoice = (choice) => {
  WrestlerOneEl.style.pointerEvents = "none";
  WrestlerTwoEl.style.pointerEvents = "none";

  nextBtnEl.classList.remove("hidden");

  let unchosen = choice === contestantOne ? contestantTwo : contestantOne;

  const chosenRating = choice.wrestlerData.ratingText;
  const unchosenRating = unchosen.wrestlerData.ratingText;
  roundNumber++;

  if (chosenRating < unchosenRating) {
    displayAnswer("incorrect");
  } else {
    displayAnswer("correct");
  }
};

const displayAnswer = (CorrectStatus) => {
  if (CorrectStatus === "correct") {
    score++;
  }
  scoreArray[roundNumber - 1] = CorrectStatus;
  console.log(scoreArray);
  scoreCircleElArray[roundNumber - 1].classList.add(`${CorrectStatus}Circle`);
  const maxRating = Math.max(
    Number(contestantOne.wrestlerData.ratingText),
    Number(contestantTwo.wrestlerData.ratingText),
  );
  answerText.textContent = CorrectStatus;
  answerText.classList.add(`${CorrectStatus}Text`);

  contestants.forEach((contestant) => {
    const ratingNumber = Number(contestant.wrestlerData.ratingText);
    const btnEl = contestant.button;
    const ratingTextEl = btnEl.querySelector(".ratingText");

    if (ratingNumber === maxRating) {
      ratingTextEl.classList.add("visible", "correctText");
    }
    if (ratingNumber < maxRating) {
      ratingTextEl.classList.add("visible", "incorrectText");
    }
  });
};

const loadMatchup = () => {
  WrestlerOneEl.style.pointerEvents = "unset";
  WrestlerTwoEl.style.pointerEvents = "unset";
  answerText.classList.remove("correctText", "incorrectText");
  nextBtnEl.classList.add("hidden");

  answerText.innerHTML = "&nbsp;";

  let filteredWrestlerDataArray = [...WrestlerDataArray];
  contestants.forEach((contestant) => {
    const ratingTextEl = contestant.button.querySelector(".ratingText");
    const nameTextEl = contestant.button.querySelector(".nameText");
    ratingTextEl.classList = "ratingText";
    contestant.wrestlerData =
      filteredWrestlerDataArray[
        Math.floor(Math.random() * filteredWrestlerDataArray.length)
      ];
    filteredWrestlerDataArray = filteredWrestlerDataArray.filter(
      (Wrestler) => Wrestler.ratingText !== contestant.wrestlerData.ratingText,
    );
    nameTextEl.textContent = contestant.wrestlerData.nameText;
    ratingTextEl.textContent = contestant.wrestlerData.ratingText;
  });
};

const nextRound = () => {
  if (roundNumber > 9) {
    GameOver();
  } else {
    loadMatchup();
  }
};

const GameOver = () => {
  pickerBoxEl.classList.add("hidden");
  nextBtnEl.classList.add("hidden");
  scoreTextEl.classList.remove("hidden");
  startBtnEl.classList.remove("hidden");
  startBtnEl.textContent = "Play Again?";
  scoreTextEl.textContent = `Score: ${score} / ${roundNumber}`;
};
