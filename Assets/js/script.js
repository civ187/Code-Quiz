function initQuiz() {
        //  Initialize "time remaining" variable
        var timeRemaining=0;
    
        
        //  Clicking the "Start Quiz" button starts the quiz, hides the landing container, and displays the quiz container
        var startButtonEl = document.getElementById("start-button");
        var timeRemainingEl = document.getElementById("time-remaining");
        var finalScoreEl = document.getElementById("final-score");
        var numQuestions = questions.length;
        var landingContainerEl = document.getElementById("landing-container");
        var quizContainerEl = document.getElementById("quiz-container");
        var finalContainerEl = document.getElementById("final-container");
        var submitButtonEl = document.getElementById("submit-initials");
        var highscoreButtonEl = document.getElementById("highscore-button");
        var highscoreContainerEl = document.getElementById("highscore-container");
        var highScores = [];

            //  Method to store and retrieve arrays in/from local storage obtained from https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage
        if (JSON.parse(localStorage.getItem('scores')) !== null) {
            highScores = JSON.parse(localStorage.getItem("scores"));
        }
    
        function startQuiz() {
                
            landingContainerEl.setAttribute("class","container d-none");
            var rowEl = null;
            var colEl = null;
            var headerEl = null;
            var buttonEl = null;
            quizContainerEl.setAttribute("class","container");
            var currentQuestion = 1;
            var score = 0;

            //  Upon starting the quiz, the time remaining variable is assigned a value equal to 15 seconds * the number of questions and starts decreasing by 1 each second
            timeRemaining=numQuestions * 15;
            timeRemainingEl.setAttribute("value",timeRemaining);

            //  Method for stopping the interval once it has started obtained from https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals
            var myInterval = setInterval(function() {
                if (timeRemaining<1) {
                    clearInterval(myInterval);

                    //  When the final question is answered or the timer reaches zero, the quiz container is hidden and the score container is displayed, where the user enters their initials
                    quizContainerEl.setAttribute("class","container d-none");
                    finalContainerEl.setAttribute("class","container");
                    return;
                }
                timeRemaining = timeRemaining - 1;
                timeRemainingEl.setAttribute("value",timeRemaining);
            },1000);
            var clickTimeout = false;
            function generateQuestion(questionNum) {
                //  During the quiz, the header has the current question, and the answer buttons have the possible answers for that question
                quizContainerEl.innerHTML = "";
                rowEl = document.createElement("div");
                rowEl.setAttribute("class","row");
                quizContainerEl.append(rowEl);

                colEl = document.createElement("div");
                colEl.setAttribute("class","col-0 col-sm-2");
                rowEl.append(colEl);

                colEl = document.createElement("div");
                colEl.setAttribute("class","col-12 col-sm-8");
                rowEl.append(colEl);

                colEl = document.createElement("div");
                colEl.setAttribute("class","col-0 col-sm-2");
                rowEl.append(colEl);

                colEl = rowEl.children[1];
                rowEl = document.createElement("div");
                rowEl.setAttribute("class","row mb-3");
                colEl.append(rowEl);

                colEl = document.createElement("div");
                colEl.setAttribute("class","col-12");
                rowEl.append(colEl);

                headerEl = document.createElement("h2");
                headerEl.innerHTML = questions[questionNum-1].title;
                colEl.append(headerEl);

                colEl = quizContainerEl.children[0].children[1];
                for (var i=0; i<4; i++) {
                    var rowEl = document.createElement("div");
                    rowEl.setAttribute("class","row mb-1");
                    colEl.append(rowEl);

                    var colEl2 = document.createElement("div");
                    colEl2.setAttribute("class","col-12");
                    rowEl.append(colEl2);

                    buttonEl = document.createElement("button");
                    buttonEl.setAttribute("class","btn btn-primary");
                    buttonEl.setAttribute("type","button");
                    buttonEl.innerHTML = questions[currentQuestion-1].choices[i];
                    colEl2.append(buttonEl);
                    buttonEl.addEventListener("click",function(){
                        //  When the user clicks one of the answer buttons, if it is the correct answer, the message "Correct" is displayed, and if not, the message "Incorrect" is displayed and 15 seconds deducted from the timer
                        if (clickTimeout) {
                            return;
                        }
                        clickTimeout = true;
                        clearInterval(myInterval);
                        var colEl = quizContainerEl.children[0].children[1];
                        var rowEl = document.createElement("div");
                        rowEl.setAttribute("class","row border-top");
                        colEl.append(rowEl);

                        colEl = document.createElement("div");
                        colEl.setAttribute("class","col-12");
                        rowEl.append(colEl);

                        var parEl = document.createElement("p");
                        colEl.append(parEl);
                        if (this.innerHTML === questions[currentQuestion - 1].answer) {
                            parEl.innerHTML = "Correct!";
                        } else {
                            parEl.innerHTML = "Incorrect";
                            timeRemaining = timeRemaining - 15;
                            if (timeRemaining < 0) {
                                timeRemaining = 0;
                            }
                            timeRemainingEl.setAttribute("value",timeRemaining);
                        }
                        currentQuestion++;
                        if (currentQuestion>questions.length) {
                            score = timeRemaining;
                        }
                        setTimeout(function() {
                            // When an answer is chosen, pause the timer and show the result for 2 seconds before loading the next question
                            if (currentQuestion>questions.length) {
                                // Move to the results page
                                quizContainerEl.setAttribute("class","container d-none");
                                finalContainerEl.setAttribute("class","container");
                                finalScoreEl.setAttribute("value",score);
                            } else {
                                generateQuestion(currentQuestion);
                                clickTimeout = false;
                                myInterval = setInterval(function() {
                                    if (timeRemaining<1) {
                                        clearInterval(myInterval);
                                        quizContainerEl.setAttribute("class","container d-none");
                                        finalContainerEl.setAttribute("class","container");
                                        return;
                                    }
                                    timeRemaining = timeRemaining - 1;
                                    timeRemainingEl.setAttribute("value",timeRemaining);
                                },1000);
                            }
                        },2000);
                    });
                }
                

            }
            function saveHighScore() {
                var initialsEl = document.getElementById("initials-entry");
                var newHighScore = {
                    initials: initialsEl.value,
                    highScore: score
                };
                console.log(newHighScore);
                highScores.push(newHighScore);
                console.log(highScores);
                localStorage.setItem("scores",JSON.stringify(highScores));
            }
            submitButtonEl.addEventListener("click",saveHighScore);
            
            generateQuestion(currentQuestion);
        }

        startButtonEl.addEventListener("click",startQuiz);

        highscoreButtonEl.addEventListener("click",function() {
            landingContainerEl.setAttribute("class","container d-none");
            quizContainerEl.setAttribute("class","container d-none");
            finalContainerEl.setAttribute("class","container d-none");
            highscoreContainerEl.setAttribute("class","container");
            var colEl = document.getElementById("highscore-table");
            for (i=0; i<highScores.length; i++) {
                var rowEl = document.createElement("div");
                rowEl.setAttribute("class","row mb-1");
                colEl.append(rowEl);

                var colEl2 = document.createElement("div");
                colEl2.setAttribute("class","col-12 text-center");
                rowEl.append(colEl2);

                var parEl = document.createElement("div");
                parEl.innerHTML = "Initials: " + highScores[i].initials + "   Score: " + highScores[i].highScore;
                colEl2.append(parEl);
            }
        }
        );
 
}
    
initQuiz();