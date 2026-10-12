document.addEventListener("DOMContentLoaded", () => {
    const giftBox = document.getElementById("giftbox-img");
    const revealContainer = document.getElementById("reveal-container");
    const giftReveal = document.getElementById("gift-reveal-img");
    const giftWrap = document.getElementById("gift-wrap");
    const bgMusic = document.getElementById("bg-music");
    const uiContainer = document.getElementById("ui-container");
    const returnBtn = document.getElementById("return-btn");
    const volumeSlider = document.getElementById("volume-slider");
    const muteBtn = document.getElementById("mute-btn");
    const jellyContainer = document.getElementById("jelly-spawn-container");
    const waterTide = document.getElementById("water-tide");
    const moon = document.getElementById("moon");

    bgMusic.volume = 0.25;
    let jellyIntervals = [];
    let greenJellyActive = false;

    // 1. Click Gift Box to Open
    giftBox.addEventListener("click", () => {
        bgMusic.play().catch(error => {
            console.log("Audio playback prevented by browser:", error);
        });

        giftBox.classList.add("fade-out");
        giftWrap.style.animation = "none";
        giftWrap.style.boxShadow = "none";

        setTimeout(() => {
            giftBox.classList.add("hidden");
            revealContainer.classList.remove("hidden");
            uiContainer.classList.remove("hidden");
            if (waterTide) waterTide.classList.remove("hidden");
            if (moon) moon.classList.remove("hidden");

            setTimeout(() => {
                giftReveal.classList.add("visible");
                uiContainer.classList.add("visible");
                if (waterTide) waterTide.classList.add("visible");
                if (moon) moon.classList.add("visible");
                
                // Start the jellyfish generator
                startJellySpawner();
            }, 50);
        }, 1000);
    });

    // Jellyfish Spawner Ecosystem Rules
    function startJellySpawner() {
        // Rule 1: bj1 (Blue Jellies)
        let blueInterval = setInterval(() => {
            spawnJelly("bj1.png", 35, 11);
        }, 1000);
        jellyIntervals.push(blueInterval);

        // Rule 2: gj1 (Green Jelly)
        let greenSpawner = setInterval(() => {
            if (!greenJellyActive) {
                greenJellyActive = true;
                spawnJelly("gj1.png", 45, 11, 0, () => {
                    greenJellyActive = false;
                });
            }
        }, 3000);
        jellyIntervals.push(greenSpawner);
    }

    // Helper function to spawn individual jellyfish smoothly
    function spawnJelly(filename, baseSize, durationSec, horizontalDrift = 0, onComplete = null) {
        const jelly = document.createElement("img");
        jelly.src = filename;
        jelly.classList.add("floating-jelly");

        const randomX = Math.random() * 85 + 5;
        jelly.style.left = `${randomX}%`;

        const scale = Math.random() * 0.4 + 0.8;
        const drift = (Math.random() * 60 - 30) + horizontalDrift;
        
        jelly.style.setProperty('--scale', scale);
        jelly.style.setProperty('--drift', `${drift}px`);
        jelly.style.width = `${baseSize}px`;
        jelly.style.animationDuration = `${durationSec}s`;

        jellyContainer.appendChild(jelly);

        const timeoutId = setTimeout(() => {
            jelly.remove();
            if (onComplete) onComplete();
        }, durationSec * 1000);

        jellyIntervals.push(timeoutId);
    }

    // 2. Volume Slider Control
    volumeSlider.addEventListener("input", (e) => {
        const val = e.target.value;
        bgMusic.volume = val;
        bgMusic.muted = (val == 0);
        muteBtn.textContent = val == 0 ? "🔇" : "🔊";
    });

    // 3. Mute / Unmute Button
    muteBtn.addEventListener("click", () => {
        bgMusic.muted = !bgMusic.muted;
        if (bgMusic.muted) {
            muteBtn.textContent = "🔇";
            volumeSlider.value = 0;
        } else {
            muteBtn.textContent = "🔊";
            volumeSlider.value = bgMusic.volume;
        }
    });

    // 4. Return Button Functionality (Reset everything)
    returnBtn.addEventListener("click", () => {
        bgMusic.pause();
        bgMusic.currentTime = 0;

        jellyIntervals.forEach(interval => {
            clearInterval(interval);
            clearTimeout(interval);
        });
        jellyIntervals = [];
        jellyContainer.innerHTML = "";
        greenJellyActive = false;

        uiContainer.classList.remove("visible");
        giftReveal.classList.remove("visible");
        if (waterTide) waterTide.classList.remove("visible");
        if (moon) moon.classList.remove("visible");

        setTimeout(() => {
            uiContainer.classList.add("hidden");
            revealContainer.classList.add("hidden");
            if (waterTide) waterTide.classList.add("hidden");
            if (moon) moon.classList.add("hidden");

            giftBox.classList.remove("hidden", "fade-out");
            giftWrap.style.animation = "";
            giftWrap.style.boxShadow = "";
        }, 1000);
    });
});