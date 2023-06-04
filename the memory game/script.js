const colors = [
  "#ff0000",
  "#ffff00",
  "#ff8800",
  "#00ff00",
  "#ff00ff",
  "#00ffff",
  "#0000ff",
  "#000000",
  "#ffffff",
  "#ce00ff",
  "#14930a",
  "#0af89d",
];

const numOfCards = 3;
let newGameIndicator = 0;
let cardsColor = [];
let currentCard = 0;

init();

function init() {
  if (!newGameIndicator) {
    renderColorPicker(colors);
  } else {
    const modal = document.querySelector(".modal");
    modal.style.visibility = "hidden";
    document.querySelector(".dim_screen").style.visibility = "hidden";
    cardsColor = new Array();
    currentCard = 0;
    renderCards(colors, numOfCards);
    if (document.querySelector(".win")) {
      document.querySelector(".win").classList.remove("win");
      document.querySelector(".modal_top_text").textContent = "You Lost";
      document.querySelector(".modal_lower_text").textContent =
        "Wonna give it another shot ?";
    }
  }
}

function renderColorPicker(colorPalete) {
  colorPalete.forEach((color) => {
    const colorPaleteElement = document.createElement("div");
    colorPaleteElement.classList.add("picker");
    colorPaleteElement.style.backgroundColor = color;
    document.querySelector(".picker-box").appendChild(colorPaleteElement);
  });
  renderCards(colors, numOfCards);
}

function renderCards(palete, size) {
  for (let i = 0; i < size; i++) {
    if (!newGameIndicator) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("unmarked-card", "card");
      paintCard(cardElement, i);
      document.querySelector(".cards-box").appendChild(cardElement);
    } else {
      const cardElements = Array.from(document.querySelectorAll(".card"));
      paintCard(cardElements[i], i);
    }
  }

  function paintCard(card, i) {
    cardsColor.push(palete[Math.round(Math.random() * (palete.length - 1))]);
    card.style.backgroundColor = cardsColor[i];
  }

  timer();
  colorPicker();
}

function timer() {
  document.querySelector(".dim_screen").classList.add("transparent");
  document.querySelector(".dim_screen").style.visibility = "visible";
  setTimeout(hideCards, 3000);
  setTimeout(ableUserInput, 3000);
}

function ableUserInput() {
  document.querySelector(".dim_screen").style.visibility = "hidden";
}

function hideCards() {
  Array.from(document.querySelectorAll(".card")).forEach(
    (card) => (card.style.backgroundColor = "white")
  );
}

function colorPicker() {
  Array.from(document.querySelectorAll(".picker")).forEach((pickerEl) => {
    pickerEl.addEventListener("click", compareColor);
  });
  changeCurrentCardStyle();
}

function changeCurrentCardStyle() {
  const cards = document.querySelectorAll(".card");
  if (newGameIndicator) {
    Array.from(cards).forEach((card) => {
      card.classList.add("unmarked-card");
      card.classList.remove("marked-card");
    });
  }
  if (currentCard) {
    cards[currentCard - 1].classList.remove("marked-card");
    cards[currentCard - 1].style.backgroundColor = cardsColor[currentCard - 1];
  }
  if (currentCard < numOfCards) {
    cards[currentCard].classList.remove("unmarked-card");
    cards[currentCard].classList.add("marked-card");
  }
}

function compareColor(e) {
  // conver picked color: RGB to Hex
  const rgbArr = window
    .getComputedStyle(e.target)
    .backgroundColor.substring(4)
    .split(",")
    .map((numStr) => parseInt(numStr, 10));
  const [r, g, b] = rgbArr;
  console.log(r, g, b);

  //compare picked color to flash card
  if (cardsColor[currentCard] === rgbToHex(r, g, b)) {
    // console.log(`colors matched time: ${currentCard + 1}`);
    currentCard++;
    // check if finished comparing
    if (!(currentCard < numOfCards)) {
      console.log("win");
      changeCurrentCardStyle();
      gameOver(1);
    } else {
      changeCurrentCardStyle();
    }
  } else gameOver(0);
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function gameOver(isWin) {
  newGameIndicator = 1;
  const modal = document.querySelector(".modal");
  modal.style.visibility = "visible";
  document.querySelector(".dim_screen").style.visibility = "visible";

  const [yesBtn, noBtn] = document.querySelectorAll("button");
  yesBtn.addEventListener("click", init);
  noBtn.addEventListener("click", navigate);

  function navigate() {
    window.location.href = "https://www.google.com";
  }

  if (isWin) {
    modal.classList.add("win");
    document.querySelector(".modal_top_text").textContent = "You Won";
    document.querySelector(".modal_lower_text").textContent = "Go again?";
  }
}
