/* -------------------------------------------------------------
   Nikku's Anniversary Gift - Full JS Logic, Games & Audio
------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // --- Elements ---
    const introScreen = document.getElementById("intro-screen");
    const openBtn = document.getElementById("open-btn");
    const envelope = document.querySelector(".envelope");
    const appContainer = document.getElementById("app-container");
    const musicToggle = document.getElementById("music-toggle");
    
    // Tab switching
    const navItems = document.querySelectorAll(".nav-item");
    const tabContents = document.querySelectorAll(".tab-content");
    
    // Time shared values
    const monthsVal = document.getElementById("months-val");
    const daysVal = document.getElementById("days-val");
    const hoursVal = document.getElementById("hours-val");
    const minutesVal = document.getElementById("minutes-val");
    const secondsVal = document.getElementById("seconds-val");

    // Polaroid Modal Zoom
    const polaroidCards = document.querySelectorAll(".polaroid-card");
    const polaroidModal = document.getElementById("polaroid-modal");
    const modalContent = polaroidModal.querySelector(".modal-card-content");
    const closeModalBtn = polaroidModal.querySelector(".close-modal");

    // Start Date: January 9, 2026
    const startDate = new Date(2026, 0, 9, 0, 0, 0);

    // Audio Engine variables
    let audioCtx = null;
    let isPlaying = false;
    let melodyInterval = null;

    // Love Jar Elements
    const loveJar = document.getElementById("love-jar-trigger");
    const notePopup = document.getElementById("note-popup");
    const noteText = document.getElementById("note-text");
    const closeNoteBtn = document.getElementById("close-note-btn");

    const loveReasons = [
        "You are my favorite notification, Nikku. 😊",
        "Every single day with you is a blessing I never knew I needed.",
        "Thank you for being my happiest thought.",
        "I love you more than words can express, and I'll show you every day.",
        "Six months down, a lifetime to go. Happy Anniversary! 💖",
        "Your laugh is my absolute favorite sound in the world.",
        "You're my safe haven, my peace, and my greatest adventure.",
        "I fall in love with you a little bit more every single day.",
        "Meeting you was fate, but falling in love with you was completely natural.",
        "No matter where we go, as long as I'm with you, I am home.",
        "You make my heart smile in ways nobody else can.",
        "Thank you for the warm hugs, deep talks, and endless support.",
        "With you, I can be 100% myself, and that is the greatest gift.",
        "You hold my hand for a short time, but you hold my heart forever.",
        "You are my today, my tomorrow, and all of my forevers. ♾️",
        "Your sweet smile makes even the hardest days beautiful.",
        "I love how we can talk for hours about everything and nothing.",
        "You are the best partner, listener, and best friend I could ever ask for.",
        "Every little memory we share is a treasure locked in my heart."
    ];

    // --- Envelope Unlock ---
    openBtn.addEventListener("click", () => {
        envelope.classList.add("open");
        
        try {
            playAnniversarySong();
        } catch (audioErr) {
            console.warn("Audio playback failed on click:", audioErr);
        }
        
        setTimeout(() => {
            introScreen.classList.remove("active");
            appContainer.classList.remove("hidden");
            void appContainer.offsetWidth; // Trigger reflow
            appContainer.classList.add("show");
            
            // Recalculate layout/canvases
            resizeCanvases();
        }, 1500);
    });

    // --- Cursor Trail Particle System ---
    window.addEventListener("mousemove", (e) => {
        if (Math.random() > 0.85) {
            spawnSparkle(e.clientX, e.clientY);
        }
    });

    window.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches[0] && Math.random() > 0.85) {
            spawnSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    function spawnSparkle(x, y) {
        const span = document.createElement("span");
        span.className = "sparkle-particle";
        const icons = ["💖", "✨", "❤️", "🥰", "🌟"];
        span.textContent = icons[Math.floor(Math.random() * icons.length)];
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
        document.body.appendChild(span);

        setTimeout(() => span.remove(), 800);
    }

    // --- Tab Switcher Logic ---
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetTab = item.getAttribute("data-tab");
            
            navItems.forEach(nav => nav.classList.remove("active"));
            tabContents.forEach(tab => tab.classList.remove("active"));
            
            item.classList.add("active");
            document.getElementById(targetTab).classList.add("active");
            
            // Specific action per tab triggers
            if (targetTab === "tab-garden") {
                resizeCanvases();
            } else if (targetTab === "tab-game") {
                resizeGameCanvas();
            }
        });
    });

    // --- Polaroid Zoom Dialog ---
    polaroidCards.forEach(card => {
        card.addEventListener("click", () => {
            modalContent.innerHTML = card.innerHTML;
            polaroidModal.classList.add("active");
        });
    });

    closeModalBtn.addEventListener("click", () => polaroidModal.classList.remove("active"));
    polaroidModal.addEventListener("click", (e) => {
        if (e.target === polaroidModal) polaroidModal.classList.remove("active");
    });

    // --- Countdown & Clock System ---
    function updateAnniversaryClock() {
        const now = new Date();
        if (now < startDate) return;

        // Years & Months Calculation
        let years = now.getFullYear() - startDate.getFullYear();
        let months = now.getMonth() - startDate.getMonth();
        let monthsTotal = years * 12 + months;

        // Adjust if today's day of the month is less than start day
        if (now.getDate() < startDate.getDate()) {
            monthsTotal--;
        }

        // Get milestone target date
        const milestoneDate = new Date(startDate);
        milestoneDate.setMonth(milestoneDate.getMonth() + monthsTotal);

        const remainderMs = now - milestoneDate;

        const days = Math.floor(remainderMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainderMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainderMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainderMs % (1000 * 60)) / 1000);

        monthsVal.textContent = monthsTotal.toString().padStart(2, '0');
        daysVal.textContent = days.toString().padStart(2, '0');
        hoursVal.textContent = hours.toString().padStart(2, '0');
        minutesVal.textContent = minutes.toString().padStart(2, '0');
        secondsVal.textContent = seconds.toString().padStart(2, '0');

        // Done clock tick
    }

    updateAnniversaryClock();
    setInterval(updateAnniversaryClock, 1000);

    // --- Love Jar ---
    loveJar.addEventListener("click", () => {
        if (loveJar.classList.contains("shaking")) return;
        
        loveJar.classList.add("shaking");
        spawnJarHeart();

        setTimeout(() => {
            loveJar.classList.remove("shaking");
            const idx = Math.floor(Math.random() * loveReasons.length);
            noteText.textContent = loveReasons[idx];
            notePopup.classList.add("active");
        }, 500);
    });

    closeNoteBtn.addEventListener("click", () => notePopup.classList.remove("active"));
    notePopup.addEventListener("click", (e) => {
        if (e.target === notePopup) notePopup.classList.remove("active");
    });

    function spawnJarHeart() {
        const rect = loveJar.getBoundingClientRect();
        const heart = document.createElement("div");
        heart.innerHTML = "💖";
        heart.style.position = "fixed";
        heart.style.left = `${rect.left + rect.width/2 - 12}px`;
        heart.style.top = `${rect.top}px`;
        heart.style.fontSize = "26px";
        heart.style.pointerEvents = "none";
        heart.style.zIndex = "150";
        heart.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.style.transform = `translate(${(Math.random() - 0.5) * 80}px, -140px) scale(1.6)`;
            heart.style.opacity = "0";
        }, 10);
        setTimeout(() => heart.remove(), 800);
    }

    // --- Love Coupons ---
    const couponCards = document.querySelectorAll(".coupon-card");
    couponCards.forEach(card => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("redeemed")) {
                card.classList.add("redeemed");
                triggerConfetti(card);
            }
        });
    });

    function triggerConfetti(target) {
        const rect = target.getBoundingClientRect();
        const colors = ["#ff4d8d", "#ff9fb2", "#fff", "#e5a9a9", "#ff0066"];
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${rect.left + rect.width / 2}px`;
            confetti.style.top = `${rect.top + rect.height / 2}px`;
            confetti.style.setProperty("--x-offset", `${(Math.random() - 0.5) * 200}px`);
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 2000);
        }
    }


    // --- Background Stars Canvas ---
    const bgCanvas = document.getElementById("background-canvas");
    const bgCtx = bgCanvas.getContext("2d");
    let bgParticles = [];

    function initBgParticles() {
        bgParticles = [];
        const count = window.innerWidth < 480 ? 30 : 60;
        for (let i = 0; i < count; i++) {
            bgParticles.push({
                x: Math.random() * bgCanvas.width,
                y: Math.random() * bgCanvas.height,
                size: Math.random() * 1.8 + 0.8,
                speedY: Math.random() * 0.15 + 0.05,
                opacity: Math.random() * 0.5 + 0.3,
                type: Math.random() > 0.88 ? 'heart' : 'star',
                angle: Math.random() * 100
            });
        }
    }

    function animateBgParticles() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgParticles.forEach(p => {
            p.y -= p.speedY;
            p.angle += 0.01;
            p.x += Math.sin(p.angle) * 0.15;

            if (p.y < -10) {
                p.y = bgCanvas.height + 10;
                p.x = Math.random() * bgCanvas.width;
            }

            if (p.type === 'heart') {
                bgCtx.fillStyle = `rgba(255, 77, 141, ${p.opacity})`;
                drawHeartShape(bgCtx, p.x, p.y, p.size * 3);
            } else {
                bgCtx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                bgCtx.beginPath();
                bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                bgCtx.fill();
            }
        });
        requestAnimationFrame(animateBgParticles);
    }

    function drawHeartShape(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size/2, y - size/2, x - size, y + size/3, x, y + size);
        ctx.bezierCurveTo(x + size, y + size/3, x + size/2, y - size/2, x, y);
        ctx.closePath();
        ctx.fill();
    }


    // --- Canvas 2: Interactive Garden Section (Slow growing flowers) ---
    const gardenCanvas = document.getElementById("garden-canvas");
    const gardenCtx = gardenCanvas.getContext("2d");
    let gardenFlowers = [];

    // Slow blooming flower definition
    class SlowFlower {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            
            // Stem variables
            this.stemLength = 0;
            this.maxStemLength = Math.random() * 40 + 30;
            this.stemWidth = Math.random() * 1.5 + 1.5;
            this.stemGrown = false;
            
            // Bloom variables
            this.bloomScale = 0;
            this.bloomSpeed = 0.015; // Slow bloom
            this.maxSize = Math.random() * 16 + 12;
            
            // Visual params
            this.color = `hsl(${Math.random() * 50 + 325}, 100%, 72%)`; // Soft pink/magenta range
            this.petals = Math.floor(Math.random() * 3) + 5; // 5 to 7 petals
            this.lifespan = 1.0; // Decay alpha
            this.grown = false;
            
            // Tiny pollen stars that rise when fully grown
            this.pollens = [];
        }

        update() {
            if (!this.stemGrown) {
                // Grow stem first
                this.stemLength += 0.8;
                if (this.stemLength >= this.maxStemLength) {
                    this.stemGrown = true;
                }
            } else if (this.bloomScale < 1) {
                // Bloom petals slowly
                this.bloomScale += this.bloomSpeed;
            } else {
                this.grown = true;
                
                // Spawn pollen sparkles occasionally
                if (Math.random() > 0.95 && this.pollens.length < 8) {
                    this.pollens.push({
                        x: (Math.random() - 0.5) * 15,
                        y: -this.maxStemLength,
                        speedY: Math.random() * 0.4 + 0.1,
                        alpha: 1.0,
                        size: Math.random() * 1.5 + 1
                    });
                }
                
                // Slowly decay flower after full bloom
                this.lifespan -= 0.002;
            }

            // Update floating pollen particles
            this.pollens.forEach((p, idx) => {
                p.y -= p.speedY;
                p.alpha -= 0.01;
                if (p.alpha <= 0) {
                    this.pollens.splice(idx, 1);
                }
            });
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.lifespan);
            
            // Draw Stem
            ctx.strokeStyle = "#4da66a"; // Glowing green stem
            ctx.lineWidth = this.stemWidth;
            ctx.lineCap = "round";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#4da66a";
            
            ctx.beginPath();
            // Start from slightly below tap and grow upwards to target coordinate
            ctx.moveTo(this.x, this.y + this.maxStemLength);
            ctx.quadraticCurveTo(
                this.x + Math.sin(this.stemLength * 0.05) * 5, 
                this.y + this.maxStemLength - this.stemLength / 2, 
                this.x, 
                this.y + this.maxStemLength - this.stemLength
            );
            ctx.stroke();

            // Only draw flower bud/blossom at the tip of the stem
            if (this.stemGrown) {
                const fx = this.x;
                const fy = this.y;
                const currentSize = this.bloomScale * this.maxSize;

                // Blossom Petals
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;

                for (let i = 0; i < this.petals; i++) {
                    ctx.beginPath();
                    ctx.ellipse(
                        fx, 
                        fy, 
                        currentSize * 0.35, 
                        currentSize, 
                        (i * Math.PI * 2) / this.petals, 
                        0, 
                        Math.PI * 2
                    );
                    ctx.fill();
                }

                // Flower Center
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(fx, fy, currentSize * 0.22, 0, Math.PI * 2);
                ctx.fillStyle = "#fff8bd"; // gold/yellow center
                ctx.fill();
            }

            // Draw floating pollen sparkles
            this.pollens.forEach(p => {
                ctx.fillStyle = `rgba(255, 235, 120, ${p.alpha})`;
                ctx.shadowBlur = 4;
                ctx.shadowColor = "#ffeb78";
                ctx.beginPath();
                ctx.arc(this.x + p.x, this.y + p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
        }
    }

    function animateGarden() {
        gardenCtx.clearRect(0, 0, gardenCanvas.width, gardenCanvas.height);
        
        // Remove instructions if user has planted flowers
        const instructions = document.querySelector(".garden-instructions");
        if (gardenFlowers.length > 0 && instructions) {
            instructions.style.display = "none";
        }

        gardenFlowers.forEach((flower, idx) => {
            flower.update();
            flower.draw(gardenCtx);
            if (flower.lifespan <= 0) {
                gardenFlowers.splice(idx, 1);
            }
        });

        requestAnimationFrame(animateGarden);
    }

    // Tap events on Garden
    function handleGardenTap(e) {
        const rect = gardenCanvas.getBoundingClientRect();
        let clientX, clientY;

        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Project coordinate into local canvas scale (CSS coordinates align with context scale)
        const x = clientX - rect.left;
        const y = clientY - rect.top - 20; // offset slightly for stem height

        if (gardenFlowers.length < 50) {
            gardenFlowers.push(new SlowFlower(x, y));
        }
    }

    gardenCanvas.addEventListener("click", handleGardenTap);
    gardenCanvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleGardenTap(e);
    });


    // --- Canvas 3: Catch My Love Mini-Game ---
    const gameCanvas = document.getElementById("game-canvas");
    const gameCtx = gameCanvas.getContext("2d");
    const scoreDisplay = document.getElementById("game-score");
    const highScoreDisplay = document.getElementById("game-high-score");
    const finalScore = document.getElementById("final-score");
    
    // Screens overlay
    const gameStartOverlay = document.getElementById("game-start-overlay");
    const gameOverOverlay = document.getElementById("game-over-overlay");
    const gameWinOverlay = document.getElementById("game-win-overlay");
    
    // Buttons
    const startGameBtn = document.getElementById("start-game-btn");
    const restartGameBtn = document.getElementById("restart-game-btn");
    const winRestartBtn = document.getElementById("win-restart-btn");

    let score = 0;
    let highScore = localStorage.getItem("nikku_high_score") || 0;
    highScoreDisplay.textContent = highScore;

    let gameState = "idle"; // idle, playing, gameover, win
    let gameHearts = [];
    let gameLoopId = null;
    let basket = {
        x: 150,
        y: 0, // set dynamically on resize
        width: 70,
        height: 38
    };
    let lastItemSpawn = 0;
    let targetWinScore = 20;
    let playerLives = 3;

    function resizeGameCanvas() {
        const container = gameCanvas.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        gameCanvas.width = width * 2;
        gameCanvas.height = height * 2;
        gameCtx.scale(2, 2);

        // Adjust basket vertical offset
        basket.y = height - 50;
        basket.x = (width - basket.width) / 2;
    }

    class FallingItem {
        constructor(canvasWidth) {
            this.width = 20;
            this.height = 20;
            this.x = Math.random() * (canvasWidth - this.width);
            this.y = -20;
            
            // Randomize speed and weights
            const roll = Math.random();
            if (roll < 0.65) {
                this.type = "heart";
                this.speed = Math.random() * 2 + 2;
                this.color = "#ff4d8d";
                this.points = 1;
            } else if (roll < 0.85) {
                this.type = "star";
                this.speed = Math.random() * 2.5 + 3.0;
                this.color = "#fffb85";
                this.points = 2;
            } else {
                this.type = "bomb"; // rain raindrop
                this.speed = Math.random() * 2 + 3.5;
                this.color = "#4ba3e3";
                this.points = -1;
            }
        }

        update() {
            this.y += this.speed;
        }

        draw(ctx) {
            ctx.save();
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;

            if (this.type === "heart") {
                const size = 18;
                ctx.beginPath();
                ctx.moveTo(this.x + size/2, this.y);
                ctx.bezierCurveTo(this.x, this.y - size/3, this.x - size/4, this.y + size/2, this.x + size/2, this.y + size * 0.95);
                ctx.bezierCurveTo(this.x + size * 1.25, this.y + size/2, this.x + size, this.y - size/3, this.x + size/2, this.y);
                ctx.closePath();
                ctx.fill();
            } else if (this.type === "star") {
                // Draw tiny star
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    ctx.lineTo(
                        this.x + 10 + Math.cos(((18 + i * 72) * Math.PI) / 180) * 10,
                        this.y + 10 + Math.sin(((18 + i * 72) * Math.PI) / 180) * 10
                    );
                    ctx.lineTo(
                        this.x + 10 + Math.cos(((54 + i * 72) * Math.PI) / 180) * 4,
                        this.y + 10 + Math.sin(((54 + i * 72) * Math.PI) / 180) * 4
                    );
                }
                ctx.closePath();
                ctx.fill();
            } else {
                // Draw dark blue falling raindrop (negative score/damage)
                ctx.beginPath();
                ctx.moveTo(this.x + 8, this.y);
                ctx.lineTo(this.x + 13, this.y + 12);
                ctx.arc(this.x + 8, this.y + 12, 5, 0, Math.PI);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function checkCollision(item, basket) {
        return (
            item.y + 15 >= basket.y &&
            item.y <= basket.y + basket.height &&
            item.x + 15 >= basket.x &&
            item.x <= basket.x + basket.width
        );
    }

    function spawnGameItems() {
        const timeNow = Date.now();
        // Dynamic spawn speed based on progression
        const rate = Math.max(450, 1000 - score * 30);
        
        if (timeNow - lastItemSpawn > rate) {
            gameHearts.push(new FallingItem(gameCanvas.width / 2));
            lastItemSpawn = timeNow;
        }
    }

    function runGameLoop() {
        if (gameState !== "playing") return;

        const w = gameCanvas.width / 2;
        const h = gameCanvas.height / 2;

        gameCtx.clearRect(0, 0, w, h);

        // Draw Lives and UI
        gameCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
        gameCtx.font = "11px Inter";
        gameCtx.fillText(`Target: ${targetWinScore}`, 10, 20);

        // Draw Player Hearts/Lives icons
        let liveHearts = "";
        for (let i = 0; i < playerLives; i++) liveHearts += "❤️";
        gameCtx.fillText(`Lives: ${liveHearts}`, w - 75, 20);

        // Draw basket
        gameCtx.save();
        gameCtx.shadowBlur = 10;
        ctxBasketGradient(gameCtx, basket.x, basket.y, basket.width, basket.height);
        gameCtx.restore();

        // Update & Render items
        gameHearts.forEach((item, index) => {
            item.update();
            item.draw(gameCtx);

            // Check basket collision
            if (checkCollision(item, basket)) {
                if (item.type === "bomb") {
                    playerLives--;
                    triggerMiniShake();
                    if (playerLives <= 0) {
                        endGame("over");
                    }
                } else {
                    score += item.points;
                    scoreDisplay.textContent = score;
                    
                    // Trigger confetti explosion on score
                    if (score >= targetWinScore) {
                        endGame("win");
                    }
                }
                gameHearts.splice(index, 1);
                return;
            }

            // Missed items
            if (item.y > h) {
                if (item.type === "heart") {
                    // Missed hearts lose lives too
                    playerLives--;
                    triggerMiniShake();
                    if (playerLives <= 0) {
                        endGame("over");
                    }
                }
                gameHearts.splice(index, 1);
            }
        });

        spawnGameItems();
        gameLoopId = requestAnimationFrame(runGameLoop);
    }

    // Draws custom glass basket path
    function ctxBasketGradient(ctx, x, y, width, height) {
        ctx.fillStyle = "rgba(255, 77, 141, 0.25)";
        ctx.strokeStyle = "rgba(255, 77, 141, 0.7)";
        ctx.lineWidth = 2.5;
        
        ctx.beginPath();
        // Top rim
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        // Right wall curving in
        ctx.quadraticCurveTo(x + width - 5, y + height/2, x + width - 10, y + height);
        // Bottom curve
        ctx.lineTo(x + 10, y + height);
        // Left wall curving in
        ctx.quadraticCurveTo(x + 5, y + height/2, x, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ribbons inside
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 10);
        ctx.lineTo(x + width - 10, y + height - 10);
        ctx.moveTo(x + width - 10, y + 10);
        ctx.lineTo(x + 10, y + height - 10);
        ctx.stroke();
    }

    function triggerMiniShake() {
        gameCanvas.classList.add("shaking");
        setTimeout(() => gameCanvas.classList.remove("shaking"), 300);
    }

    function startCatchGame() {
        score = 0;
        playerLives = 3;
        gameHearts = [];
        scoreDisplay.textContent = score;
        gameState = "playing";

        gameStartOverlay.classList.add("hidden");
        gameOverOverlay.classList.add("hidden");
        gameWinOverlay.classList.add("hidden");

        resizeGameCanvas();
        runGameLoop();
    }

    function endGame(status) {
        gameState = status;
        cancelAnimationFrame(gameLoopId);

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("nikku_high_score", highScore);
            highScoreDisplay.textContent = highScore;
        }

        if (status === "win") {
            gameWinOverlay.classList.remove("hidden");
            // Huge confetti shower for Nikku
            triggerVictoryConfetti();
        } else {
            finalScore.textContent = score;
            gameOverOverlay.classList.remove("hidden");
        }
    }

    function triggerVictoryConfetti() {
        const colors = ["#ff4d8d", "#ff9fb2", "#fffeb5", "#e5a9a9", "#ff0080"];
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const conf = document.createElement("div");
                conf.className = "confetti";
                conf.style.background = colors[Math.floor(Math.random() * colors.length)];
                conf.style.left = `${Math.random() * window.innerWidth}px`;
                conf.style.top = `-10px`;
                conf.style.setProperty("--x-offset", `${(Math.random() - 0.5) * 150}px`);
                document.body.appendChild(conf);
                setTimeout(() => conf.remove(), 2500);
            }, i * 30);
        }
    }

    // Touch event basket drag
    function moveBasket(clientX) {
        if (gameState !== "playing") return;
        const rect = gameCanvas.getBoundingClientRect();
        // Project coordinates to Canvas scale
        const localX = (clientX - rect.left) * (gameCanvas.width / 2 / rect.width);
        // Center basket on cursor
        basket.x = Math.max(0, Math.min(gameCanvas.width / 2 - basket.width, localX - basket.width / 2));
    }

    // Desktop
    gameCanvas.addEventListener("mousemove", (e) => moveBasket(e.clientX));
    
    // Mobile touch
    gameCanvas.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches[0]) {
            moveBasket(e.touches[0].clientX);
        }
    });

    startGameBtn.addEventListener("click", startCatchGame);
    restartGameBtn.addEventListener("click", startCatchGame);
    winRestartBtn.addEventListener("click", startCatchGame);


    // --- Global Window Sizing handlers ---
    function resizeCanvases() {
        // Bg canvas scale
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        initBgParticles();

        // Garden canvas scale
        const gContainer = gardenCanvas.parentElement;
        if (gContainer) {
            const w = gContainer.clientWidth;
            gardenCanvas.width = w * 2;
            gardenCanvas.height = w * 2;
            gardenCtx.scale(2, 2);
        }
    }

    window.addEventListener("resize", () => {
        resizeCanvases();
        resizeGameCanvas();
    });

    resizeCanvases();
    animateBgParticles();
    animateGarden();


    // --- Music Player System ---
    let song = null;

    function playAnniversarySong() {
        if (song) return; // Prevent double creation

        try {
            song = new Audio("Taylor Swift - Lover Remix Feat. Shawn Mendes (Lyric Video).mp3");
            song.loop = true;
            song.currentTime = 134; // Play starting from 2:14 (romantic chorus)
            
            const playPromise = song.play();
            if (playPromise !== undefined && typeof playPromise.then === 'function') {
                playPromise.then(() => {
                    isPlaying = true;
                    musicToggle.classList.add("playing");
                    musicToggle.querySelector(".icon-music-on").classList.remove("hidden");
                    musicToggle.querySelector(".icon-music-off").classList.add("hidden");
                }).catch(err => {
                    console.warn("Audio play promise failed:", err);
                });
            } else {
                // Legacy browser support
                isPlaying = true;
                musicToggle.classList.add("playing");
                musicToggle.querySelector(".icon-music-on").classList.remove("hidden");
                musicToggle.querySelector(".icon-music-off").classList.add("hidden");
            }
        } catch (e) {
            console.warn("Audio constructor failed:", e);
        }
    }

    musicToggle.addEventListener("click", () => {
        if (!song) {
            playAnniversarySong();
            return;
        }

        try {
            if (isPlaying) {
                song.pause();
                isPlaying = false;
                musicToggle.classList.remove("playing");
                musicToggle.querySelector(".icon-music-on").classList.add("hidden");
                musicToggle.querySelector(".icon-music-off").classList.remove("hidden");
            } else {
                const playPromise = song.play();
                if (playPromise !== undefined && typeof playPromise.then === 'function') {
                    playPromise.then(() => {
                        isPlaying = true;
                        musicToggle.classList.add("playing");
                        musicToggle.querySelector(".icon-music-on").classList.remove("hidden");
                        musicToggle.querySelector(".icon-music-off").classList.add("hidden");
                    }).catch(err => {
                        console.warn("Audio play promise failed on toggle:", err);
                    });
                } else {
                    isPlaying = true;
                    musicToggle.classList.add("playing");
                    musicToggle.querySelector(".icon-music-on").classList.remove("hidden");
                    musicToggle.querySelector(".icon-music-off").classList.add("hidden");
                }
            }
        } catch (toggleErr) {
            console.warn("Audio toggle operation failed:", toggleErr);
        }
    });
}
