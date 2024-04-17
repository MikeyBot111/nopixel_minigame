let timer_start, timer_time, timerStart, pos_checked;
let game_started = false;
let streak = 0;
let max_streak = 0;

let maxWords = 25;
let maxSelectedWords = 5;
let maxTime = 20;

const all_words = ["affair", "critical", "kill", "nerve", "ballot", "bill", "straighten", "slice", "feedback",
    "medium", "passion", "love", "displace", "separation", "boom", "allocation", "pause", "stress",
    "battery", "ritual", "confront", "loud", "skate", "jacket", "faithful", "avenue", "hostile",
    "seasonal", "worry", "debate", "miner", "capture", "woman", "highlight", "finger", "recycle",
    "bind", "tendency", "employ", "cooperation", "shower", "export", "affect", "insure", "burial",
    "bring", "equinox", "machinery", "taxi", "chauvinist"
];

let selected_words = [];
let words = [];
let current_word = "";


const getCookieValue = (name) => (document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '');
const getMaxStreakFromCookie = () => {
    const str = getCookieValue('max-streak_word_memory');
    return str !== '' ? parseInt(str, 10) : 0;
};

max_streak = getMaxStreakFromCookie();

const sleep = (ms, fn) => {return setTimeout(fn, ms)};

// Option
document.querySelector('#maxWords').addEventListener('input', function(ev){
    document.querySelector('.maxWords_value').innerHTML = ev.target.value;
    maxWords = parseInt(ev.target.value, 10);
    streak = 0;
    reset();
});

document.querySelector('#maxSelectedWords').addEventListener('input', function(ev){
    document.querySelector('.maxSelectedWords_value').innerHTML = ev.target.value;
    maxSelectedWords = parseInt(ev.target.value, 10);
    streak = 0;
    reset();
});

document.querySelector('#maxTime').addEventListener('input', function(ev){
    document.querySelector('.maxTime_value').innerHTML = ev.target.value;
    maxSelectedWords = parseInt(ev.target.value, 10);
    streak = 0;
    reset();
});



// Reset
document.querySelector('.btn_again').addEventListener('click', function(){
    streak = 0;
    reset();
});


// Game code

function refresh() {
    document.querySelector('.gamestreak').innerHTML = `${streak} / ${maxWords}`;
    current_word = selected_words[Math.floor(Math.random() * selected_words.length)];
    document.querySelector('.current_word').innerHTML = current_word;
}

function createWords(){
    for (let i = 0; i < maxSelectedWords; i++) {
        selected_words.push(all_words[Math.floor(Math.random() * all_words.length)])
    }      
}


function listener(ev) {
    if (!game_started) return;

    if (ev.target.classList[0] === "new") {
        if (words.includes(current_word)) return reset();

        words.push(current_word);
        streak += 1;
        refresh();
    } else if (ev.target.classList[0] === "seen") {
        if (!words.includes(current_word)) return reset();

        streak += 1;
        refresh();
    }

    if (streak === maxWords) reset();
}

function addListeners(){
    document.querySelector('.seen').addEventListener('mousedown', listener);
    document.querySelector('.new').addEventListener('mousedown', listener);
}

function reset(){
    game_started = false;

    words = [];
    selected_words = [];
    current_word = "";

    resetTimer();
    clearTimeout(timer_start);

    max_streak = getMaxStreakFromCookie();

    document.querySelector('.splash').classList.remove('hidden');
    document.querySelector('.game').classList.add('hidden');

    document.querySelector('.streak').innerHTML = streak;
    document.querySelector('.max_streak').innerHTML = max_streak;

    streak = 0;

    start();
}

function start(){   
    createWords();
    refresh();
    addListeners();

    timer_start = sleep(500, function(){
        document.querySelector('.splash').classList.add('hidden');
        document.querySelector('.game').classList.remove('hidden');
        
        game_started = true;

        startTimer();
    });
}

function startTimer(){
    timerStart = new Date();
    timer_time = setInterval(timer,1);
}
function timer(){
    let timerNow = new Date();
    let timerDiff = new Date();
    timerDiff.setTime(timerNow - timerStart);

    const timeMil = timerDiff.getSeconds() * 1000 + timerDiff.getMilliseconds();

    document.querySelector('.time-bar').style.width = (100 - (timeMil / (maxTime * 1000)) * 100) + '%';
    if (timeMil >= (maxTime * 1000)) reset();
}

function resetTimer(){
    clearInterval(timer_time);
}

start();