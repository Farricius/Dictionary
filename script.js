const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const sound = document.getElementById("sound");
const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const result = document.getElementById("result");
const info = document.getElementById("info");

searchButton.addEventListener("click", () => {
  if (searchInput.value.trim() === "") {
    document.getElementById(
      "result"
    ).innerHTML = `<h4 class="error">Please write a word to search!</h4>`;
    searchInput.focus();
  } else {
    fetchWord(searchInput.value);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (searchInput.value.trim() === "") {
      document.getElementById(
        "result"
      ).innerHTML = `<h4 class="error">Please write a word to search!</h4>`;
      searchInput.focus();
    } else {
      fetchWord(searchInput.value);
    }
  }
});

function fetchWord(inputWord) {
  let meaningsListHTML = "";
  fetch(`${url}${inputWord}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((dataItem) => {
        dataItem.meanings.forEach((meaning) => {
          // Cogemos la frase, la cortamos en palabras quitando espacios y obtenemos múltiples substrings
          // Los substring se mapean con un enlace, arreglamos la cadena y entre palabras hay un espacio blanco (" ")
          const meaningPhrase = meaning.definitions[0].definition;
          const individualWords = meaningPhrase.trim().split(/\s+/);
          const clickableWords = individualWords
            .map((word) => `<a href="#" class="clickable-word">${word}</a>`)
            .join(" ");

          meaningsListHTML += `
            <div>
              <div class="details">
                <p>${meaning.partOfSpeech}</p>
                <p>${dataItem.phonetic || dataItem.phonetics[1]?.text || ""}</p>
              </div>
              <p class="word-meaning">${clickableWords}</p>
              <p class="word-example">${
                meaning.definitions[0].example || "No examples available"
              }</p>
            </div>
          `;
        });
      });

      meaningsListHTML += `<small id="info">* Hover and click any word to see its meaning too! 😃 </small>`;

      // Tras el bucle agregamos al HTML en la zona de arriba el POSIBLE audio y un pequenio encabezado
      document.getElementById("result").innerHTML = `
        <div class="word">
          <h3>${inputWord.toLowerCase()}</h3>
          <button id="audio-btn" style="visibility: hidden;" onclick="playSound()">
            <i class="fa-solid fa-headphones-simple"></i>
          </button>
        </div>
        ${meaningsListHTML}
      `;

      let audioSrc = data[0].phonetics[0]?.audio;

      if (audioSrc) {
        document.getElementById("sound").setAttribute("src", audioSrc);
        document.getElementById("audio-btn").style.visibility = "visible";
      } else {
        document.getElementById("sound").setAttribute("src", "");
      }

      addClickEventToWords();
    })
    .catch((error) => {
      document.getElementById(
        "result"
      ).innerHTML = `<h4 class="error">Sorry, word not found... Try another one!</h4>`;
    });
}

function playSound() {
  sound.play();
}

// Nueva función que permite clickear palabras para búsqueda ignorando símbolos
function addClickEventToWords() {
  document.querySelectorAll(".clickable-word").forEach((word) => {
    word.addEventListener("click", (event) => {
      //event.preventDefault();
      const clickedWord = event.target.textContent.replace(
        /[.,;:"()/|!']/g,
        ""
      );
      fetchWord(clickedWord);
      searchInput.value = clickedWord.toLowerCase();
    });
  });
}
