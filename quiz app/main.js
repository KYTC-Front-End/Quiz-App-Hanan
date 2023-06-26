// **  Declare Global Variables ** //

let count;
let numQuestions = questions.length;
let currentQuestion;
let gameStop = true;
let gameScore;
let timerInterval;
let userAnswers = [];

// Select HTML elements for later DOM manipulation
let time = document.getElementById("timer");
let score = document.getElementById("user-score");
let startBtn = document.getElementById("start");
startBtn.addEventListener("click", newGame);

// Get each container <div>
let welcomeDiv = document.querySelector(".welcome-container");
let questionDiv = document.querySelector(".questions-container");
let formDiv = document.querySelector(".form-container");
let highScoreModal = document.querySelector(".modal-container");
let leaderboard = document.querySelector(".user-scores");
let leaderLink = document.querySelector(".leaderText");
leaderLink.addEventListener("click", showLeader)
let qTitle = document.getElementById("question-title");
let qChoices = document.getElementById("question-choices");
// Select form input element 
let username = document.getElementById("username");
// Capture Submit Event
let userSubmit = document.getElementById("userSubmit");
userSubmit.addEventListener("click", saveUser);
// Modal Logic
let closeModal = document.querySelector(".close")
closeModal.addEventListener("click", clearModal);
// Close Modal when clicked outside of modal-container
window.addEventListener("click", outsideModal);
let exit = document.querySelector(".exit");
exit.addEventListener("click", clearModal);
let clearScores = document.querySelector(".clear");
clearScores.addEventListener("click", clearLeaderBoard);

function initialize() {
    if (localStorage.length === 0) {
        highScoreArray = [];
        localStorage.setItem("userScores", JSON.stringify(highScoreArray));
    }
    let findTopScore = localStorage.getItem("userScores");
    let parsedScore = JSON.parse(findTopScore);
    console.log(parsedScore);
    let max = 0;
    let user;

    // Let's find the TOP score
    for (let i = 0; i < parsedScore.length; i++) {
        // TEST to see if current score [i] is greater than current value of max
        // NOTE that we are dealing with an OBJECT, the OBJECT contains both 'username' and 'score' properties
        if (max < parsedScore[i].score) {
          
            max = parsedScore[i].score;
            user = parsedScore[i].username;
        }
    }

    questionDiv.classList.add("hide");
    formDiv.classList.add("hide");
    highScoreModal.classList.add("hide");

}


initialize();

// New Game Function: 

function newGame() {
   
    gameStop = false;
    
    gameScore = 0;

    currentQuestion = 0;

    
   userAnswers = [];

    count = 75;
    timer();
    time.textContent = count;

    welcomeDiv.classList.add("hide");

    questionDiv.classList.remove("hide");
    check();
}

// Timer Function:

function timer() {
    
    timerInterval = setInterval(function() {
     
        count--;
       
        time.textContent = count;

        if (count === 0) {
          
            gameOver();
        }
    }, 1000)  
}

// Check Function: Tests if we have run out of quesitons
function check() {
 
    if (currentQuestion === numQuestions) {
        
        gameOver();
    } else {
        loadQuestion();
    }
} 




// Load Question Function:

function loadQuestion() {
    
    qTitle.textContent = '';
    qChoices.textContent = '';

    for (let i = 0; i < questions[currentQuestion].choices.length; i++) {
        qTitle.textContent = questions[currentQuestion].title;

    
        let ansChoice = document.createElement("li");
      
        ansChoice.setAttribute("id", i);
      
        ansChoice.setAttribute("data-name", `data-choice-${i}`);
        ansChoice.setAttribute("value", questions[currentQuestion].choices[i]);
        
        ansChoice.classList.add("ans-choice");


    
        ansChoice.addEventListener("click", next)
   
        ansChoice.textContent = questions[currentQuestion].choices[i];

        // Add answer choice to <ul> DOM
        qChoices.appendChild(ansChoice);
    }

}


// Log User Selection Function:

function next(event) {
    // Uncomment the lines below and inspect the console output if your struggling with events
    // console.log(event);
    // console.log(event.target);
    // console.log(event.target.id);
    // console.log(event.target.innerText);

    if(event.target.innerText === questions[currentQuestion].answer) {
        gameScore += 10;
    }
    currentQuestion++;

    check();
}


// End Game Function: Updates gameEnd variable, clears the timer interval, displays end game text 
//      calls the scoring function and the username form

function gameOver() {
 
    gameStop = true;

  
    clearInterval(timerInterval);
    time.textContent = "- -";

    gameScore += count;
    questionDiv.classList.add("hide");

   
    score.textContent = gameScore;
 r
    formDiv.classList.remove("hide");
  
    username.value = '';
}


// Save User/Score Function: 

function saveUser(event) {

    event.preventDefault();
    
    if (username.value == '') {
        return;
    }

    let tempArray = localStorage.getItem("userScores");
 
    let parsedTempArray = JSON.parse(tempArray);
  
    if (parsedTempArray !== null) {
       
        parsedTempArray.push(
            {
                username: username.value,
                score: gameScore
            }
        );

        sortScores(parsedTempArray);

        localStorage.setItem('userScores', JSON.stringify(parsedTempArray));
    } else {  
        
        let highScoreArray = [];
     
        highScoreArray.push(
            {
                username: username.value,
                score: gameScore
            }
        );
        localStorage.setItem('userScores', JSON.stringify(highScoreArray));
    }
    // Clear form input field
    username.value = '';
    // Display the Leader Board
    showLeader();
}


// Leader Board Function: Function will pull userScore OBJECT
//     from local storage and create a leader board div

function showLeader() {
 
    formDiv.classList.add("hide");
    questionDiv.classList.add("hide");
    welcomeDiv.classList.add("hide");

    highScoreModal.classList.remove("hide");

    leaderboard.innerHTML = "";

    let highScoreBoard = localStorage.getItem('userScores');
    let parsedScoreBoard = JSON.parse(highScoreBoard);

    // Display high scores
    for (let i = 0; i < parsedScoreBoard.length; i++) {
        let newScore = document.createElement("li");
        newScore.textContent = parsedScoreBoard[i].username + " : " + parsedScoreBoard[i].score;
        newScore.classList.add("score-item");
        leaderboard.appendChild(newScore);
    }
}

// ---------------------------------------------------- //
//
// Sort Function: Function will sort the Leader Board
//     into high to low scores
//
// ---------------------------------------------------- //
function sortScores(scoreObj) {
    
    scoreObj.sort( function(a, b) {
       
        return b.score - a.score;
    });
}

function clearLeaderBoard() {
  
    localStorage.removeItem("userScores");
    console.log("Scores Cleared");
    console.log(localStorage);
    leaderboard.innerHTML = "";
}


// Clear Modal Function: Function will clear Leader Board
//      Modal overlay and return to welcome screen

function clearModal() {
    
    highScoreModal.classList.add("hide");
 
    welcomeDiv.classList.remove("hide");
}

function outsideModal(event) {
    if (event.target == highScoreModal) {
       
        highScoreModal.classList.add("hide");
       
        welcomeDiv.classList.remove("hide");
    }
} 
