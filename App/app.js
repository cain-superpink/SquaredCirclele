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
let rounds = [];

const contestantOne = {
  button: WrestlerOneEl,
  wrestlerData: {},
};
const contestantTwo = {
  button: WrestlerTwoEl,
  wrestlerData: {},
};
const contestants = [contestantOne, contestantTwo];

const scoreArray = [];
let roundNumber = 0;
let score = 0;

startBtnEl.addEventListener("click", () => {
  startGame();
  GenerateMatchupData();
});

WrestlerOneEl.addEventListener("click", () => {
  submitChoice(contestantOne, WrestlerOneEl);
});
WrestlerTwoEl.addEventListener("click", () => {
  submitChoice(contestantTwo, WrestlerTwoEl);
});

nextBtnEl.addEventListener("click", () => {
  nextRound();
  GenerateMatchupData();
});

const startGame = () => {
  roundNumber = 0;
  score = 0;
  GenerateMatchupData();
  mapMatchuptoButtons(rounds);
  startGameShowButtons();
  document
    .querySelectorAll(".scoreCircle")
    .forEach((circle) => (circle.classList = "scoreCircle"));
};

const submitChoice = (choice) => {
  disableChoiceButtons();

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
      ratingTextEl.classList.add("correctText");
    }
    if (ratingNumber < maxRating) {
      ratingTextEl.classList.add("incorrectText");
    }
  });
};

const GenerateMatchupData = () => {
  function dateToSeed(dateString) {
    let hash = 0;

    for (let i = 0; i < dateString.length; i++) {
      hash = Math.imul(31, hash) + dateString.charCodeAt(i);
      hash |= 0;
    }

    return hash >>> 0;
  }

  // --------------------------------------------
  // Mulberry32 seeded random number generator
  // --------------------------------------------

  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6d2b79f5);

      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // --------------------------------------------
  // Select today's 10 rounds
  // --------------------------------------------

  function generateDailyRounds(items, rng, roundCount = 10) {
    if (items.length < roundCount * 2) {
      throw new Error(
        `At least ${roundCount * 2} items are required for ${roundCount} rounds.`,
      );
    }
    const rounds = [];

    // Keep track of items that have already been used
    const availableItems = [...items];

    for (let round = 0; round < roundCount; round++) {
      // ----------------------------------------
      // Pick first item
      // ----------------------------------------

      const firstIndex = Math.floor(rng() * availableItems.length);

      const firstItem = availableItems[firstIndex];

      // Remove it so it cannot appear again today
      availableItems.splice(firstIndex, 1);

      // ----------------------------------------
      // Find possible second items
      // Must have a different score
      // ----------------------------------------

      const validSecondItems = availableItems.filter(
        (item) => item.ratingText !== firstItem.ratingText,
      );

      if (validSecondItems.length === 0) {
        throw new Error(
          `Unable to create round ${round + 1}: ` +
            `no remaining item has a different score.`,
        );
      }

      // ----------------------------------------
      // Pick second item
      // ----------------------------------------

      const secondIndex = Math.floor(rng() * validSecondItems.length);

      const secondItem = validSecondItems[secondIndex];

      // Find the actual index in availableItems
      const actualSecondIndex = availableItems.indexOf(secondItem);

      // Remove it so it cannot appear again today
      availableItems.splice(actualSecondIndex, 1);

      rounds.push({
        round: round + 1,
        itemA: firstItem,
        itemB: secondItem,
      });
    }

    return rounds;
  }

  // ============================================
  // Generate today's game
  // ============================================

  // UTC date in YYYY-MM-DD format
  const dateString = new Date().toISOString().slice(0, 10);

  // Convert date to seed
  const seed = dateToSeed(dateString);

  // Create deterministic RNG
  const rng = mulberry32(seed);

  // Generate 10 rounds
  rounds = generateDailyRounds(WrestlerDataArray, rng, 10);
};

const mapMatchuptoButtons = (rounds) => {
  contestantOne.wrestlerData = rounds[roundNumber].itemA;
  contestantTwo.wrestlerData = rounds[roundNumber].itemB;
  contestants.forEach((contestant) => {
    const nameEl = contestant.button.querySelector(".nameText");
    const RatingEl = contestant.button.querySelector(".ratingText");
    nameEl.innerText = contestant.wrestlerData.nameText;
    RatingEl.innerText = contestant.wrestlerData.ratingText;
  });
};

const nextRound = () => {
  if (roundNumber > 9) {
    GameOver();
  } else {
    mapMatchuptoButtons(rounds);
    enableChoicebuttons();
  }
};

const GameOver = () => {
  pickerBoxEl.classList.add("hidden");
  nextBtnEl.classList.add("hidden");
  scoreTextEl.classList.remove("hidden");
  answerText.classList.remove("correctText", "incorrectText");
  answerText.classList.add("hidden");
  // startBtnEl.classList.remove("hidden");
  // startBtnEl.textContent = "Play Again?";
  scoreTextEl.textContent = `You Scored ${score} out of ${roundNumber}`;
  answerText.innerHTML = "&nbsp;";
  const headingText = document.querySelector(".headingText");
  if (score < 5) {
    headingText.innerText = "Better luck next time!";
  } else if (score == 10) {
    headingText.innerText = "Perfect score!";
  } else if (score >= 5) {
    headingText.innerText = "Nice job";
  }

  const endTextEl = document.querySelector(".endText");
  endTextEl.classList.remove("hidden");
};

const enableChoicebuttons = () => {
  WrestlerOneEl.style.pointerEvents = "unset";
  WrestlerTwoEl.style.pointerEvents = "unset";
  answerText.classList.remove("correctText", "incorrectText");
  const ratingTextEls = document.querySelectorAll(".ratingText");
  ratingTextEls.forEach((ratingTextEl) => {
    ratingTextEl.classList.remove("correctText", "incorrectText");
  });

  nextBtnEl.classList.add("hidden");
  answerText.innerHTML = "&nbsp;";
};

const disableChoiceButtons = () => {
  WrestlerOneEl.style.pointerEvents = "none";
  WrestlerTwoEl.style.pointerEvents = "none";
  nextBtnEl.classList.remove("hidden");
};

const startGameShowButtons = () => {
  scoreTextEl.classList.add("hidden");
  gameContainerEl.classList.remove("hidden");
  pickerBoxEl.classList.remove("hidden");
  nextBtnEl.classList.remove("hidden");
  startBtnEl.classList.add("hidden");
  nextBtnEl.classList.add("hidden");
};
