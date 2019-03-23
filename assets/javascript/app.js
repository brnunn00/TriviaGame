//Going to try to run everything as one object
//Set up click handlers first, define object content, push through each question as a stage, tracked by index

$(document).ready(function(){
    $('#startGameBtn').on('click', triviaObj.initializeGame);
    $('#newGameBtn').on('click', triviaObj.resetGame);
    $(document.body).on('click', '.questionChoice', triviaObj.processChoice);
    $('#nextQBtn').on('click', triviaObj.clearForNext);
    var gameArray = gameLibrary();
});

var triviaObj = {
questionIndex: 0,
gameStarted: false,
timerStarted: false,
timerLength:10,
timerRunning: false,
timeRemaining:0,
numCorrect:0,
numWrong:0,
timeElapsed:0,
intervalId:'',
nextQuestionTimeOut:5,
timeOutRunning:false,
gameObj:{},

//this should get the choice box values and set the game parameters of library (arrays of qs, choices and answers) and hides/shows pertinent panels. 
//gets first quest
initializeGame: function(){
    triviaObj.gameStarted = true;
        let tempArr = gameLibrary();
    var gameSelected = $('#gameChoiceCont').find(":selected").val();
    var gameLengthSel = $('#gameDif').find(":selected");
    triviaObj.timerLength = gameLengthSel.val();
    triviaObj.gameObj = tempArr[gameSelected];    
    $('.triviaTopic').text(triviaObj.gameObj.name + " Difficulty: " + gameLengthSel.text());
    $('.gameStartCont').css('display','none');
    triviaObj.getQuestionData();
},

getQuestionData: function(){
   if (triviaObj.gameStarted){
var que = triviaObj.gameObj.questions[this.questionIndex];
let questionEle = $('<h2>');
questionEle.addClass("questionText");
questionEle.text(que);
questionEle.appendTo('.questionCont');
triviaObj.loadChoicesForQuestion();
   }
},

loadChoicesForQuestion: function(){
let cObj = this.gameObj.choices[this.questionIndex];
for (i=0; i<cObj.length; i++){
    let grr = $('<h2>');
    grr.addClass('questionChoice');
    grr.val(i);
    grr.text(cObj[i]);
    grr.appendTo('.choicesCont');
}

triviaObj.beginTimer();
},

beginTimer: function(){

    if (!triviaObj.timerRunning) {
        this.timeRemaining = this.timerLength;
        $('.timerPanel').css('display', 'block');
        $('.timeDisplay').text("Time Remaining: " + timeConverter(this.timeRemaining));
        triviaObj.intervalId = setInterval(this.count,1000);
        triviaObj.timerRunning = true;
    
      }
},
count: function(){
    
    triviaObj.timeRemaining--;   
   
    var res = timeConverter(triviaObj.timeRemaining);    
    if (triviaObj.timerRunning){
    $('.timeDisplay').text("Time Remaining: " + res);
    triviaObj.timeElapsed++;
if (triviaObj.timeRemaining ===0){
  
    triviaObj.stopTimer();
    triviaObj.resultShow('TimeUp');
}
} else if (triviaObj.timeOutRunning){
    $('.timeDisplay').text("Next question in: " + res);
    if (triviaObj.timeRemaining ===0){
  
        triviaObj.stopTimer();
        triviaObj.clearForNext();
    }
}
},

stopTimer: function(){

    clearInterval(triviaObj.intervalId);
    triviaObj.timerRunning = false;
    triviaObj.timeOutRunning = false;

},
processChoice: function(){
    let picked = $(this).val();
    triviaObj.stopTimer();
    if (picked == triviaObj.gameObj.answerKey[triviaObj.questionIndex]){
        triviaObj.resultShow("correct");
    } else {
        triviaObj.resultShow("wrong");

    }
  
},
resultShow: function(res){
let akey = triviaObj.gameObj.answerKey[triviaObj.questionIndex];
//clear choices, leave question, show answer, wait for user to click next question then rebuild. 
let corAns = "The correct answer is: " + triviaObj.gameObj.choices[triviaObj.questionIndex][akey];
let resBuild ='';
switch (res){
case "correct": 
resBuild += triviaObj.gameObj.choices[triviaObj.questionIndex][akey] + " - That's right !";
triviaObj.numCorrect++;
break;
case "wrong":
resBuild += "Sorry! " + corAns;
triviaObj.numWrong++;
break;
case "TimeUp":
resBuild += "Times up! " + corAns;
triviaObj.numWrong++;
break;
default: resBuild = corAns;
}

$('.choicesCont').empty();

let resText  = $('<h2>');
resText.addClass("resultText")
resText.text(resBuild);
$('.resultTextCont').append(resText);
$('.resultCont').css('display','block');

triviaObj.questionIndex++;
if (triviaObj.questionIndex == triviaObj.gameObj.questions.length){
triviaObj.gameOver();

} else {
    triviaObj.startNextQTimer();
}
},
startNextQTimer: function(){
    if (!triviaObj.timeOutRunning) {
        this.timeRemaining = triviaObj.nextQuestionTimeOut;
        $('.timerPanel').css('display', 'block');
        $('.timeDisplay').text("Next question in: " + timeConverter(this.timeRemaining));
        triviaObj.intervalId = setInterval(this.count,1000);
        triviaObj.timeOutRunning = true;
    
      }
},

gameOver: function(){
    $('#nextQBtn').css('display', 'none');
    $('.timerPanel').css('display', 'none');
    $('.endGameCont').css('display','block');
    let resText = "Game over! You got " + triviaObj.numCorrect + " out of " + triviaObj.gameObj.questions.length + " questions correct in " + triviaObj.timeElapsed 
     +  " seconds!";
     let resEle = $('<div>');
     resEle.text(resText);
     resEle.addClass("gameOverText");
     resEle.appendTo('.gameEndRes');
    
}, 
clearForNext: function(){
    triviaObj.stopTimer();
    $('.resultTextCont').empty();
    $('.questionCont').empty();
    $('.timeDisplay').text(timeConverter(triviaObj.timerLength));
    $('.resultCont').css('display',"none");
    // $('.nextQBtn').css('display',"none");
    triviaObj.getQuestionData();
},
resetGame: function(){
    triviaObj.gameStarted = false;
    triviaObj.numCorrect = 0;
    triviaObj.numWrong = 0
    triviaObj.gameObj = {};
    triviaObj.timeElapsed = 0;
    triviaObj.questionIndex = 0;
     triviaObj.clearForNext();
     $('#nextQBtn').css('display', 'block');
     $('.triviaTopic').empty();
     $('.gameEndRes').empty();
     $('.gameStartCont').css('display','block');
     $('.endGameCont').css('display','none');
    
}
}

function gameLibrary(){
var gameArr = [];

var beerGame = {
    name:"Beer!!",
    questions:["What is the main ingredient of any beer?","What does I.P.A. Stand For?","What style of ale uses Wheat for fermentation and is typically unfiltered?"
    ,"What is the agent that makes sour beers sour?"],
    choices:[["Water","Alcohol","Hops","Magic"],["Indian Pint of Ale","International Pale Ale","India Pale Ale","India Painted Ale"],
    ["Lager","Hefeweisen","I.P.A", "Stout" ],["Souring Powder", "Wild Yeast/Bacteria","Early Harvest Hops", "Lemons and other Citrus" ]],
    answerKey:[0,2,1,1]
}
gameArr.push(beerGame);

var videoGamesGame = {
    name:"Video Games",
    questions:["League of Legends is a popular MOBA. What does 'MOBA' stand for?","What is the name of the Alliance Human Capital City in World of Warcraft?","Who published the popular Battle Royale game, Fortnite?","What is the name of game IV in the Elder Scrolls series?"
,"At its peak (October 2010), World of Warcraft had a player base exceeding how many active subscriptions?"],
    choices:[["Multiplayer Online Brawl Arena", "Multiplayer Open Battleground Action", "Miniature Online Battle Attack", "Multiplayer Online Battle Arena"],["Asgard","Stormwind","Azeroth","Nilhelm"],["Epic Games","Activision","Riot Games","Steam","Nintendo"],
    ["Skyrim","Morrowind","Oblivion","Return of the Dragonborn", "Dawnguard"],["4.5 Million", "10 Million", "12 Million", "16 Million"]],
    answerKey:[3,1,0,2,2]
}
gameArr.push(videoGamesGame);
if (!triviaObj.gameStarted){
for (let index = 0; index < gameArr.length; index++) {
   let oppy = $("<option>");
   oppy.val(index);
   oppy.text(gameArr[index].name)
   oppy.appendTo('#gameChoiceCont');    
}

}
return gameArr;
    
}


function timeConverter(t){

t = parseInt(t);
      if (t < 10) {
        t = "0" + t;
      }  
    
    
      return "00" + ":" + t;
  }

