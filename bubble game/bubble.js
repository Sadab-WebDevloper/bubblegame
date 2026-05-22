let score = 0;
        let miss = 0;
        let gameactive = true;
        let bubbleSpeed = 1500; // Initial speed
        let bubbleInterval = setInterval(creatediv, bubbleSpeed);

        function getRandomAlphabetornum() {

            alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return alphabet[Math.floor(Math.random() * alphabet.length)];
        }

        function getRandomColor() {

            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);

            return "rgb(" + r + "," + g + "," + b + ")";
        }
        
        function getRandomPosition() {

            let container = document.getElementById("container");
            let maxX = container.clientWidth - (container.clientWidth * 0.08);
            let startX = Math.floor(Math.random() * maxX);
            return { x: startX };

        }

        function updatescore(){
            score++;
            document.getElementById("score").innerText = "Score:" + score;

            if (score == 50 || score == 150 || score == 250 || score == 400 || score == 600) {

                let alertsound = document.getElementById("scoresound");
                alertsound.currentTime = 0;
                alertsound.play();


                setTimeout(()=>{

                    alert(" Well Done! Speed is increasing");
                    if (score == 50) {
                        bubbleSpeed = 1300;
                    }else if (score == 150) {
                        bubbleSpeed = 1100;
                    }else if (score == 250) {
                        bubbleSpeed = 900;
                    }else if (score == 400) {
                        bubbleSpeed = 700;
                    } else if (score == 600) {
                        bubbleSpeed = 400;  
                    }
                    
                    clearInterval(bubbleInterval); // Stop the previous interval
                    bubbleInterval = setInterval(creatediv, bubbleSpeed); // Start new interval
                },500);
            }
        }

        function updatemissed() {
            if (!gameactive) return;
            miss++;
            document.getElementById("miss").innerText = "Missed:" + miss;

            if (miss >= 15) {
                gameactive = false;
                let gameover = document.getElementById("gameover");
                gameover.style.display = "block";

                let gameoversound = document.getElementById("gameoversound");
                gameoversound.currentTime = 0;
                gameoversound.play();

                // Stop generating bubbles
                clearInterval(bubbleInterval);
            }
        }
       

       

        function blastbubble(div) {

            let popsound = document.getElementById("sound");
            popsound.currentTime = 0;
            popsound.play();

            div.style.transform = "scale(2)";
            div.style.opacity = "0";

            updatescore();

            setTimeout(function () {

                div.parentNode.removeChild(div);
            }, 200);

        }

        function creatediv() {

            var d = getRandomAlphabetornum();
            let div = document.createElement("div");
            div.className = "dynamic-div";

            div.innerHTML = d;//generate random charchter between A to Z and number 1 to 9
            div.id = d;// variable use for charachter and number  
            div.style.backgroundColor = getRandomColor();//generate random color using RGB 
            
            let position = getRandomPosition();
            div.style.left = position.x + "px";
            div.style.bottom = "0px"; //start from bottom

            document.getElementById("container").appendChild(div);

            setTimeout(()=>{

                div.parentNode.removeChild(div);
                updatemissed();
            },6000)
        }

        document.body.addEventListener("keyup", function (event) {
            let key = event.key.toUpperCase();
            let e = document.getElementById(key);
            if (e) {
                blastbubble(e);
            }
        });

        document.body.addEventListener("click", function (event) {
            if (event.target.classList.contains("dynamic-div")) {
                blastBubble(event.target);
            }
        });