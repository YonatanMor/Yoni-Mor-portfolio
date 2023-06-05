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
let uniqueColor = [];
let currentCard = 0;
let $ = (selector) => document.querySelector(`${selector}`);
let $$ = (selector) => document.querySelectorAll(`${selector}`);

init();

function init() {
  if (!newGameIndicator) {
    renderColorPicker();
  } else {
    if ($(".win")) {
      $(".win").classList.remove("win");
      $(".modal_top_text").textContent = "You Lost";
      $(".modal_lower_text").textContent = "Wonna give it another shot ?";
    }
    const modal = $(".modal");
    modal.style.visibility = "hidden";
    $(".dim_screen").style.visibility = "hidden";
    uniqueColor = []
    currentCard = 0;
  }
  renderCards();
  timer();
  colorPicker();
  changeCurrentCardStyle();
}

function renderColorPicker() {
  colors.forEach((color) => {
    const colorPaleteElement = document.createElement("div");
    colorPaleteElement.classList.add("picker");
    colorPaleteElement.style.backgroundColor = color;
    $(".picker-box").appendChild(colorPaleteElement);
  });
}

function renderCards() {
  for (let i = 0; i < numOfCards; i++) {
    if (!newGameIndicator) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("unmarked-card", "card");
      paintCard(cardElement, i);
      $(".cards-box").appendChild(cardElement);
    } else {
      const cardElement = Array.from($$(".card"))[i];
      paintCard(cardElement, i);
    }
  }
}

function paintCard(card, i) {
  let color = colors[Math.floor(Math.random() * colors.length)];
  if (!uniqueColor.includes(color)) {
    uniqueColor.push(color);
    card.style.backgroundColor = uniqueColor[i];
  } else paintCard(card, i);
}

function timer() {
  $(".dim_screen").classList.add("transparent");
  $(".dim_screen").style.visibility = "visible";
  setTimeout(hideCards, 3000);
  setTimeout(ableUserInput, 3000);
}

function ableUserInput() {
  $(".dim_screen").style.visibility = "hidden";
}

function hideCards() {
  Array.from($$(".card")).forEach(
    (card) => (card.style.backgroundColor = "white")
  );
}

function colorPicker() {
  Array.from($$(".picker")).forEach((pickerEl) => {
    pickerEl.addEventListener("click", compareColor);
  });
}

function changeCurrentCardStyle() {
  const cards = $$(".card");
  if (newGameIndicator) {
    Array.from(cards).forEach((card) => {
      card.classList.add("unmarked-card");
      card.classList.remove("marked-card");
    });
  }
  if (currentCard) {
    cards[currentCard - 1].classList.remove("marked-card");
    cards[currentCard - 1].style.backgroundColor = uniqueColor[currentCard - 1];
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
  if (uniqueColor[currentCard] === rgbToHex(r, g, b)) {
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
  const modal = $(".modal");
  modal.style.visibility = "visible";
  $(".dim_screen").style.visibility = "visible";

  const [yesBtn, noBtn] = $$("button");
  yesBtn.addEventListener("click", init);
  noBtn.addEventListener("click", navigate);

  function navigate() {
    window.location.href = "https://www.google.com";
  }

  if (isWin) {
    modal.classList.add("win");
    $(".modal_top_text").textContent = "You Won";
    $(".modal_lower_text").textContent = "Go again?";
  }
}
