// Seleciona elementos da interface
let focusT = document.querySelector('#focus-time'); // Tempo de foco
let breaks = document.querySelector('#break-time'); // Tempo de pausa

let plusButton = document.querySelectorAll('.btn-plus'); // Botões de incremento
let minusButton = document.querySelectorAll('.btn-minus'); // Botões de decremento

let startButton = document.querySelector('#start'); // Botão de iniciar
let stopButton = document.querySelector('#stop'); // Botão de parar

let tagHours = document.querySelector('#hour'); // Elemento de exibição de horas
let tagMinutes = document.querySelector('#minutes'); // Elemento de exibição de minutos
let tagSeconds = document.querySelector('#seconds'); // Elemento de exibição de segundos

let timerStatus = document.querySelector('#timer-status'); // Status do temporizador

// Variáveis do temporizador
let timer = ''; // Identificador do temporizador
let timerActive = false; // Indica se o temporizador está ativo
let timerType = 'Foco'; // Tipo de temporizador (Foco/Pausa)
let startTime = 1500; // Tempo inicial do temporizador (em segundos)
let focusTime = 1500; // Tempo de foco padrão (em segundos)
let breakTime = 300; // Tempo de pausa padrão (em segundos)
let currentTime = 1500; // Tempo atual do temporizador (em segundos)

//Variáveis do Contador 
let workCounter = 0;
let pauseCounter = 0;
let workTime = 0; 
let pauseTime = 0;

// Função para exibir o tempo do temporizador na interface
function timerDisplay() {
    focusT.innerHTML = minutesDisplay(focusTime) + ' min';
    breaks.innerHTML = minutesDisplay(breakTime) + ' min';
    currentTimer();    
}

// Função para calcular e exibir o progresso total do temporizador
function handleTotalProgress(startTime, currentTime) {
    var timePassed = startTime - currentTime;
    var deg;
    if (timePassed < (startTime / 2)) {
        deg = 90 + (360 * timePassed / startTime)
    }
    else if (timePassed >= (startTime / 2)) {
        deg = -90 + (360 * timePassed / startTime);
    }
}

// Função para calcular e exibir o progresso dos segundos do temporizador
function handleSecondsProgress(currentTime) {
    var secondsPassed = 60 - secondsConvert(currentTime).seconds;
    var deg;
    if (secondsPassed < (60 / 2)) {
        deg = 90 + (360 * secondsPassed / 60)
    }
    else if (secondsPassed >= (60 / 2)) {
        deg = -90 + (360 * secondsPassed / 60);
    }
}

// Função para converter segundos em minutos
function minutesDisplay(timeInSec) {
    return parseInt(timeInSec / 60);
}

// Função para exibir o tempo atual do temporizador
function currentTimer() { 
    if (secondsConvert(currentTime).hours) {
        tagHours.classList.remove('hidden');
        tagHours.innerHTML = secondsConvert(currentTime). hours + ': ';
        
    } else {
        tagHours.innerHTML = '';
    }
    tagMinutes.innerHTML = secondsConvert(currentTime). minutes + ': ';
    tagSeconds.innerHTML = secondsConvert(currentTime). seconds;
}

// Função para adicionar um zero à esquerda se o número for menor que 10
function addLeadingZero(time) {
    return time < 10? '0' + time : time;
}

// Função para converter segundos em horas, minutos e segundos
function secondsConvert(second) { 
    var result = { hours: 0, minutes: 0, seconds: 0 };
    var seconds = second % 60;
    var minutes = parseInt(second / 60) % 60;
    var hours = parseInt(second / 3600);
    if (hours > 0) {
        result.hours = hours;
    }
    result.minutes = addLeadingZero(minutes);
    result.seconds = addLeadingZero(seconds);
    return result;
}

function countDown() {
    timerStatus.innerHTML = timerType;
    if (currentTime > 0) {
        currentTime--;
        currentTimer();
        handleTotalProgress(startTime, currentTime);
        handleSecondsProgress(currentTime);
        if (currentTime === 0) {
            if (timerType === 'Foco') {
                currentTime = breakTime;
                startTime = breakTime;
                timerType = 'Pausa';
                timerStatus.innerHTML = timerType;
                workCounter++; 
                workTime = parseInt((workTime + focusTime) / 60); 
                showNotification(`Tempo de pausa iniciado! ${workCounter} tempo de foco realizado! ${workTime} minutos no total!`);
                
                // Simular clique para abrir o modal
                document.getElementById("btExibeExercicio").click();
            } else {
                currentTime = focusTime;
                startTime = focusTime;
                timerType = 'Foco';
                timerStatus.innerHTML = timerType;
                pauseCounter++; 
                pauseTime = parseInt((pauseTime + breakTime) / 60); 
                showNotification(`Tempo de foco iniciado! ${pauseCounter} tempo de pausa realizado! ${pauseTime} minutos no total!`);
                
                // Simular clique para fechar o modal
                document.getElementById("closeModal").click();
            }
        }
    }
}

// Função para iniciar ou pausar o temporizador
function toggleTimer() {
    if (timerActive) {
        clearInterval(timer);
        startButton.innerHTML = 'Iniciar';
        timerActive = false;
    }
    else {
        startButton.innerHTML = 'Pausar';
        timer = setInterval(countDown, 1000);
        timerActive = true;
    }
}

// Função para parar o temporizador
function stopTimer() { 
    timerActive = false;
    startButton.innerHTML = 'Iniciar';
    clearInterval(timer);
    timerType = 'Foco';
    currentTime = focusTime;
    handleTotalProgress(startTime, currentTime);
    handleSecondsProgress(currentTime);
    timerDisplay();
}

// Função para atualizar o tempo quando os botões de incremento/decremento são clicados
function displayChangedTime(e, time) {
    if (e.target.id === 'focus-plus' || e.target.id === 'focus-minus') {
        focusT.innerHTML = minutesDisplay(focusTime) + ' min';
    }
    else if (e.target.id === 'break-plus' || e.target.id === 'break-minus') {
        breaks.innerHTML = minutesDisplay(breakTime) + ' min';
    }
}

// Event Listeners para os botões de iniciar e parar o temporizador
startButton.addEventListener('click', toggleTimer);
stopButton.addEventListener('click', stopTimer);

// Event Listeners para os botões de incremento de tempo
for (var i = 0; i < plusButton.length; i++) {
    plusButton[i].addEventListener('click', function (e) {
        if (!timerActive) {
            if (e.target.id === 'focus-plus') {
                focusTime += 300;
                currentTime = focusTime;
                startTime = focusTime;
                displayChangedTime(e, focusTime);
                currentTimer();
            } 
            else if (e.target.id === 'break-plus') {
                breakTime += 300;
                displayChangedTime(e, breakTime);
                currentTimer();
            }
        }
    });
}

for (var i = 0; i < minusButton.length; i++) {
    minusButton[i].addEventListener('click', function (e) {
        if (!timerActive) {
            if (e.target.id === 'focus-minus') {
                if (focusTime > 300) {
                    focusTime -= 300;
                    currentTime = focusTime;
                    startTime = focusTime;
                    displayChangedTime(e, focusTime);
                    currentTimer();
                } else if (focusTime === 300 && breakTime >= 600) {
                    focusTime -= 300;
                    breakTime -= 300;
                    currentTime = focusTime;
                    startTime = focusTime;
                    displayChangedTime(e, focusTime);
                    currentTimer();
                    displayChangedTime(e, breakTime);
                }
            } else if (e.target.id === 'break-minus') {
                if (breakTime > 300) {
                    breakTime -= 300;
                    displayChangedTime(e, breakTime);
                    currentTimer();
                }
            }
        }
    });
}
// Função para mostrar uma notificação
function showNotification(message) {
    if (Notification.permission === "granted") {
        // Se as notificações estiverem permitidas, cria a notificação
        var notification = new Notification("Pomodoro Timer", {
            body: message,
        });
    } else if (Notification.permission !== "denied") {
        // Se as notificações ainda não foram solicitadas, solicita ao usuário
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                var notification = new Notification("Pomodoro Timer", {
                    body: message,
                });
            }
        });
    }
}

// Event Listener que executa quando o DOM é carregado para exibir o temporizador inicial
document.addEventListener('DOMContentLoaded', timerDisplay);
