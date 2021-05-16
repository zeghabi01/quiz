const questionSide = document.querySelector("#questionSide p")
const choicesSide = document.querySelector("#choicesSide ul")
const questionNumber = document.querySelector("#questionNumber span")
const btn = document.getElementById("btn")
const body = document.querySelector("body")
const gameContainer = document.getElementById("playingGame")
const lossContainer = document.getElementById("loss")
const winContainer = document.getElementById("win")
const start = document.getElementById("startgame")
const startgameContainer = document.getElementById("gameStartContainer")
const myNav = document.getElementById("startNav")
const myFormInput = document.querySelector('#myForm input')
const player = document.getElementById('playerName')


const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

var gameSound = new Audio('gameSound.wav');
var timersound = new Audio('timer2.wav');
var winsound = new Audio('win.wav');
var losssound = new Audio('loss.wav');
var corretcsound = new Audio('correct.wav')

const COLOR_CODES = {
  info: {
    color: "#32A7F9"
  },
  warning: {
    color: "#32A7F9",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 12;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
var timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;


const timer = document.getElementById("ac");
const loader = document.getElementById("loader")
const correct = document.getElementById("correct")
const wrong = document.getElementById("wrong")
const sad = document.getElementById("sad");

const assets = document.getElementById("assets")



let questionCounter = 0;
let randomQuestion;

let question = null;

let availableQuestions = []
let availableChoices = []
let DUARITION = 1000

let playerName;

// GET QUESTION FROM JSON FILE
async function myQuestions() {
    let response = await fetch("questions.json")
    let myJson = await response.json()

    return myJson
}


myQuestions().then(questions => {
    availableQuestions = questions;

})

// .addEventListener("click",(e)=> 

start.onclick = (e) => {

  playerName = myFormInput.value

  startgameContainer.classList.add('hide')
  myNav.classList.add('hide')

  playingGame.classList.remove('hide')
  startGame()

}


function startGame() {


  if(playerName === "") {
    playerName = "لاعب غير معروف"
    player.innerHTML = playerName
  }else {
    player.innerHTML = playerName
  }


  randomQuestion = availableQuestions.sort((a,b) => 0.5 - Math.random())
  
  startTimer()

  getQuestions()

}


function getQuestions() {

  timersound.play();

  question = randomQuestion[questionCounter]

// SHOW QUESTION
  questionSide.innerHTML = question.question
  questionNumber.innerHTML = questionCounter + 1

  
// SHOW CHOICES 

  for(let i=0;i<question.choices.length;i++) {
    availableChoices.push(i)
  }


  let randomChoices = availableChoices.sort(() => Math.random() - 0.5)

  randomChoices.forEach((choiceIndex,index) => {

  const letters = ["أ","ب","ت","ث"]
  const li = document.createElement("li")
  li.classList.add('bounceli2')
  const span = document.createElement("span")
  const p = document.createElement("p")

  span.innerHTML = letters[index]
  p.innerHTML = question.choices[choiceIndex]

  li.appendChild(span)
  li.appendChild(p)
  li.dataset.target = choiceIndex


  
  li.addEventListener("click", e => {
    getAnswer(e.currentTarget)
  })

  choicesSide.appendChild(li)

  });



}


function getAnswer(choice) {
 
  timersound.pause()
  timersound.currentTime = 0;

  Array.from(choicesSide.children).forEach(e => {
    e.classList.remove('bounceli2')
  })

  clearInterval(timerInterval)
  unclickable()
  timer.classList.add('hide')
  loader.classList.remove('hide')

  choice.style.transition = ".2s ease"
  choice.style.transform = "scale(1.01)"

  setTimeout(() => {
    if(parseInt(choice.dataset.target) === question.answer) {
      loader.classList.add('hide')
      choice.classList.add('correct')
      correct.classList.remove('hide')
      corretcsound.play()

      choice.style.background = "green"

      Array.from(choicesSide.children).forEach(element => {
        if(!element.classList.contains('correct'))
          element.classList.add('result')
      })

      setTimeout(() => {
        if(questionCounter === availableQuestions.length - 1 ) {
          winsound.play()
          questionCounter = 0

          resetCorrect()
          gameContainer.classList.add('hide')
          winContainer.classList.remove('hide')
        }else {

          resetCorrect()

          questionCounter++
  
          getQuestions()
  
          startTimer()

        }

      }, 2000);

    }else {

      choice.classList.add('wrong')

      choice.style.background = "red"

      Array.from(choicesSide.children).forEach(choice => {
        if(choice.dataset.target == question.answer) {
          choice.classList.add("correct")
        }else {
          choice.classList.add('result')
        }
      })

      loader.classList.add('hide')
      wrong.classList.remove('hide')
      losssound.play()

      setTimeout(() => {
        
        gameContainer.classList.add('hide')
        lossContainer.classList.remove('hide')


        reset()
        
      }, 2000);

    }

    choice.style.transition = "none"

    Array.from(choicesSide.children).forEach(e => {
      e.classList.add('bounceli')
    })

  }, 800);
  
}


function exit() {  
  lossContainer.classList.add('hide')
  startgameContainer.classList.remove('hide')
  myNav.classList.remove('hide')
}

function goBack() {  
  winContainer.classList.add('hide')
  startgameContainer.classList.remove('hide')
  myNav.classList.remove('hide')
}


function unclickable() {

  body.classList.add("disabled")

}


function gameOver() {
  clearInterval(timerInterval)
  unclickable()
  timer.classList.add('hide')
  loader.classList.remove('hide')

  setTimeout(() => {
   
    Array.from(choicesSide.children).forEach(element => {
      if(element.dataset.target == question.answer) {
        element.classList.add('correct')
        element.style.transition = ".2s ease-in"
        element.style.transform = "scale(1.01)"
      }
      else 
        element.classList.add('result')
   
      element.classList.add('bounceli')
    })

    loader.classList.add('hide')
    sad.classList.remove('hide')

    setTimeout(() => {

      gameContainer.classList.add('hide')
      lossContainer.classList.remove('hide')


      reset()

    }, 2000);

  }, 1000);

}

function resetCorrect() {

  timePassed = 0
  timeLeft = 12

  body.classList.remove('disabled')


  availableChoices = []
  choicesSide.innerHTML = " "


  Array.from(assets.children).forEach(element => {

    if(!element.classList.contains('hide')) {
      element.classList.add('hide')
    }

    if(element.classList.contains('ac')) {
      element.classList.remove('hide')
    }
    
  })

  timer.innerHTML = " "

}

function reset() {

  questionCounter = 0
  timePassed = 0
  timeLeft = 12

  body.classList.remove('disabled')


  Array.from(choicesSide.children).forEach(element => {
      element.classList.remove('correct')
  })

  Array.from(assets.children).forEach(element => {

    if(!element.classList.contains('hide')) {
      element.classList.add('hide')
    }

    if(element.classList.contains('ac')) {
      element.classList.remove('hide')
    }
    
  })


  availableChoices = []
  choicesSide.innerHTML = " "

  timer.innerHTML = " "

}



/****** COUNT DOWN ******/

/*

startTimer();

onTimesUp();

*/



function onTimesUp() {
  gameOver()
}

function startTimer() {

  timer.innerHTML = `
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer__path-remaining ${remainingPathColor}"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
    )}</span>
  </div>
  `;
  
    timerInterval = setInterval(() => {
    timePassed = timePassed + 1;

    timeLeft = TIME_LIMIT - timePassed;

    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }



  }, 1000);

}

function formatTime(time) {
  return `<small>${time}s</small>`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
