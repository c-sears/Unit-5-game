var $gameStart = $('#gameStart');
var $container = $('.container');
var $difficulty = $('.difficulty');
var $category = $('.category');
var $countDown = $('.countDown');

var difficultyChosen = false;
var catChosen = false;

var difficulty = '';
var category = '';

var dataObj = {
    question: '',
    choices: [],
    correct: ''
}

var userChoice = '';

var getSeconds;
var getMseconds;

var score = 0;
var lives = 6;



var gameFunctions = {
    emptyContainer: function(){
        $container.empty();
    },
    startGame: function(){
        gameFunctions.getNewQuestion();
        $container.html('<div class="countDown"></div>')
        var timer;
        timer = setTimeout(function(){
            gameFunctions.emptyContainer();
            gameFunctions.addGameContainer();
        }, 3300)
    },
    getNewQuestion: function(){
        var apiObj = {
            url: 'https://opentdb.com/api.php?amount=1&type=multiple',
            diffParam: '&difficulty=' + difficulty,
            catgryParam: '&category=' + category,
        }
        $.ajax({
            url: apiObj.url + apiObj.diffParam + apiObj.catgryParam,
            method: 'GET'
        }).then(function(question){
            var result = question.results[0];
            var rand = Math.floor(Math.random() * (dataObj.choices.length + 1));
            dataObj.question = result.question;
            dataObj.choices = result.incorrect_answers;
            dataObj.correct = result.correct_answer;
            dataObj.choices.splice(rand, 0, dataObj.correct)
            console.log(dataObj.correct)
        });
    },
    addGameContainer: function(){
        var a = $('<div>');
        var b = $('<div>');
        var c = $('<button>');
        var stats = $('<div class="stats">');
        var time = $('<div class="time">');
        var nestedTime = $('<div class="gameTimer">');
        var wins = $('<div class="wins">');
        var correct = $('<div id="correct">');
        var incorrect = $('<div id="lives">');
        var subButton = $('<button id="submit">')
        a.addClass('question');
        b.addClass('currentQuestion');
        c.addClass('boxSmall');
        $container.append(a);
        a.append(b);
        for (var i = 0; i < dataObj.choices.length; i++){
            a.append('<button class="boxSmall">');
            $('.boxSmall').html('<p class="choices" id="option">')
        };
        $container.append(stats);
        stats.html(time);
        time.html(nestedTime);
        stats.append(wins);
        wins.append(correct);
        wins.append(incorrect);
        subButton.text('Submit');
        stats.append(subButton);

        // Create chain call to update the new html
        gameFunctions.updateDisplay();
    },
    updateDisplay: function(){
        $('.currentQuestion').html(dataObj.question);
        $('.choices').each(function(l, second){
            $(this).html(dataObj.choices[l]);
            if (dataObj.choices[l] == dataObj.correct){
                dataObj.correct = $(this).html();
            }
            dataObj.choices[l] = $(this).html();
            if ($(this).html() == dataObj.correct){
                $(this).attr('value', 'correct');
            }
        })
        $('#correct').html('Score: ' + score);
        $('#lives').html('Lives: ' + lives);

        // Create chain call to start the game timer
        gameFunctions.startQuestTimer();
    },
    startQuestTimer: function(){
        
        var time = $('.gameTimer');
        var seconds = 15;
        var mSeconds = 99;
        getSeconds = setInterval(function(){
            seconds -= 1;
        }, 1000)
        getMseconds = setInterval(function(){
            mSeconds -=1;
            time.text(seconds + ' : ' + mSeconds);
            if (mSeconds == 0){
                mSeconds = 99;
            }
            if (seconds < 10){
                time.text('0' + seconds + ':' + mSeconds);
            }   else {
                time.text(seconds + ':' + mSeconds);
            }   
            if (seconds == 0){
                lives -= 1;
                if (lives >= 1){
                    time.text('00:00');
                    $('#lives').html('Lives: ' + lives);
                    gameFunctions.displayCorrect();
                    clearInterval(getSeconds);
                    clearInterval(getMseconds);
                    var delayQuestion;
                    var second = 6;
                    delayQuestion = setInterval(function(){
                        $('#submit').text(second);
                        second -= 1;
                        if (second == 3){
                            clearInterval(delayQuestion);
                            gameFunctions.startGame();
                        }
                    }, 1000);
                } else {
                    $('#lives').html('Lives: ' + lives);
                    time.text('00:00');
                    gameFunctions.displayCorrect();
                    clearInterval(getSeconds);
                    clearInterval(getMseconds);
                }
            }
        },10)
    },
    displayCorrect: function(){
        $('.choices').each(function() {
            if ($(this).attr('value') == 'correct'){
                $(this).parent().css({'background': 'green'});
            };
        })
    },
    userChooses: function(){
        if ($(userChoice).html() == dataObj.correct && (lives !== 0)){
            console.log(userChoice)
            clearInterval(getSeconds);
            clearInterval(getMseconds);
            userChoice.parent().css({'background': 'green'});
            score += 1;
            $('#correct').html('Score: ' + score);
            var delayQuestion;
            var second = 6;
            delayQuestion = setInterval(function(){
                $('#submit').text(second);
                second -= 1;
                if (second == 0){
                    clearInterval(delayQuestion);
                    gameFunctions.startGame();
                }
            }, 1000);
        }
        else if (($(userChoice).html()) !== dataObj.correct && (lives !== 0)) {
            lives -= 1;
            if (lives !== 0){
                $('#lives').html('Lives: ' + lives);
                clearInterval(getSeconds);
                clearInterval(getMseconds);
                userChoice.parent().css({'background': 'red'});
                gameFunctions.displayCorrect();
                var delayQuestion;
                var second = 6;
                delayQuestion = setInterval(function(){
                    $('#submit').text(second);
                    second -= 1;
                    if (second == 2){
                        clearInterval(delayQuestion);
                        gameFunctions.startGame();
                    }
                }, 1000);
            } else {
                gameFunctions.displayCorrect();
                clearInterval(getSeconds);
                clearInterval(getMseconds);
                userChoice.parent().css({'background': 'red'});
                $('#lives').html('Lives: ' + lives);
            };
        } ;
    },
}


$category.click(function(){
    category = $(this).attr('value');
    $(this).css({'background': 'white'});
    catChosen = true;
});

$difficulty.click(function(){
    difficulty = $(this).attr('value');
    $(this).css({'background': 'white'});
    difficultyChosen = true;
})


var timer;
var timer2;


$gameStart.click(function(){
    if (difficultyChosen && catChosen){
        gameFunctions.emptyContainer();
        gameFunctions.startGame();
    } else {
        console.log('please choose your difficulty and category');
    }
})


$(document).on('click', '.choices', function(){
    userChoice = $(this);
    console.log(userChoice)
})

$(document).on('click', '#submit', function(){
    if (lives !== 0){
        gameFunctions.userChooses();
    }
})