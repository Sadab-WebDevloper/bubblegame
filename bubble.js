let score = 0;
let miss = 0;
let gameactive = true;
let bubbleSpeed = 1500; // Initial speed
let bubbleInterval = setInterval(creatediv, bubbleSpeed);

function getRandomAlphabetornum() {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function getRandomColor() {
    let r = Math.floor(Math.random() * 200 + 55); // Avoid too dark colors
    let g = Math.floor(Math.random() * 200 + 55);
    let b = Math.floor(Math.random() * 200 + 55);
    return `rgba(${r}, ${g}, ${b}, 0.5)`; // Semi-transparent for glass effect
}

function getRandomPosition(sizePx) {
    let container = document.getElementById("container");
    // Ensure bubble doesn't spawn off-screen
    let maxX = container.clientWidth - sizePx;
    let startX = Math.floor(Math.random() * maxX);
    return { x: startX };
}

function updatescore(){
    score++;
    document.getElementById("score").innerText = "Score: " + score;

    if (score == 50 || score == 150 || score == 250 || score == 400 || score == 600) {
        let alertsound = document.getElementById("scoresound");
        alertsound.currentTime = 0;
        alertsound.play();

        setTimeout(()=>{
            alert("Well Done! Speed is increasing");
            if (score == 50) {
                bubbleSpeed = 1300;
            } else if (score == 150) {
                bubbleSpeed = 1100;
            } else if (score == 250) {
                bubbleSpeed = 900;
            } else if (score == 400) {
                bubbleSpeed = 700;
            } else if (score == 600) {
                bubbleSpeed = 400;  
            }
            
            clearInterval(bubbleInterval);
            bubbleInterval = setInterval(creatediv, bubbleSpeed);
        }, 500);
    }
}

function updatemissed() {
    if (!gameactive) return;
    miss++;
    document.getElementById("miss").innerText = "Missed: " + miss;

    if (miss >= 15) {
        gameactive = false;
        let gameover = document.getElementById("gameover");
        gameover.style.display = "block";

        let gameoversound = document.getElementById("gameoversound");
        gameoversound.currentTime = 0;
        gameoversound.play();

        clearInterval(bubbleInterval);
    }
}

function blastbubble(div) {
    // Prevent blasting the same bubble multiple times
    if (div.classList.contains("pop-anim")) return;

    let popsound = document.getElementById("sound");
    popsound.currentTime = 0;
    popsound.play();

    // Trigger pop animation class
    div.classList.add("pop-anim");

    updatescore();

    // Remove element after animation completes
    setTimeout(function () {
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
    }, 150);
}

function creatediv() {
    if (!gameactive) return;

    var d = getRandomAlphabetornum();
    let div = document.createElement("div");
    div.className = "dynamic-div";
    div.innerHTML = d;
    div.id = d; 
    
    // Dynamic Size (between 6vw and 10vw)
    let sizeVw = Math.floor(Math.random() * 4 + 6);
    
    // Fallback min size logic
    let sizePx = (window.innerWidth * sizeVw) / 100;
    if (sizePx < 50) sizePx = 50; // Minimum 50px

    div.style.width = sizePx + "px";
    div.style.height = sizePx + "px";
    div.style.fontSize = (sizePx * 0.4) + "px"; // Font size scales with bubble size

    // Color
    let color = getRandomColor();
    div.style.backgroundColor = color;
    
    // Dynamic position
    let position = getRandomPosition(sizePx);
    div.style.left = position.x + "px";
    
    // Dynamic Animation Durations
    let floatDur = Math.random() * 3 + 4; // 4s to 7s
    let swayDur = Math.random() * 1.5 + 1.5; // 1.5s to 3s
    let swayAnim = Math.random() > 0.5 ? "swayLeft" : "swayRight";
    
    div.style.setProperty('--float-duration', floatDur + 's');
    div.style.setProperty('--sway-duration', swayDur + 's');
    div.style.setProperty('--sway-anim', swayAnim);

    document.getElementById("container").appendChild(div);

    // Remove bubble if it reaches the top (matches float duration)
    setTimeout(()=>{
        if (div.parentNode && !div.classList.contains("pop-anim")) {
            div.parentNode.removeChild(div);
            updatemissed();
        }
    }, floatDur * 1000);
}

document.body.addEventListener("keyup", function (event) {
    if (!gameactive) return;
    let key = event.key.toUpperCase();
    let e = document.getElementById(key);
    if (e) {
        blastbubble(e);
    }
});

document.body.addEventListener("click", function (event) {
    if (!gameactive) return;
    if (event.target.classList.contains("dynamic-div")) {
        blastbubble(event.target);
    }
});