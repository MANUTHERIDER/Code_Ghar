document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target section ID
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate the offset for the fixed navbar
                const navbarHeight = document.querySelector('.main-nav').offsetHeight;
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Analog Clocks Implementation ---

    // Function to draw a single analog clock
    function drawClock(canvasId, timezoneOffset) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const clockSize = 170; // Matches the updated CSS canvas size
        
        // Ensure canvas dimensions are set for proper drawing
        canvas.width = clockSize;
        canvas.height = clockSize;

        const radius = clockSize / 2;
        ctx.translate(radius, radius); // Move origin to center of canvas

        function drawFace(ctx, radius) {
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = '#FFC06F'; /* Gold accent color for clock border */
            ctx.lineWidth = radius * 0.03;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
            ctx.fillStyle = '#4A4A4A'; /* Dark grey for center dot */
            ctx.fill();
        }

        function drawNumbers(ctx, radius) {
            ctx.font = radius * 0.15 + "px 'Open Sans'"; /* Use Open Sans for numbers */
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = '#4A4A4A'; /* Dark grey for numbers */
            for (let num = 1; num <= 12; num++) {
                let ang = num * Math.PI / 6;
                ctx.rotate(ang);
                ctx.translate(0, -radius * 0.85);
                ctx.rotate(-ang);
                ctx.fillText(num.toString(), 0, 0);
                ctx.rotate(ang);
                ctx.translate(0, radius * 0.85);
                ctx.rotate(-ang);
            }
        }

        function drawTime(ctx, radius, currentTime) {
            let hour = currentTime.getHours();
            let minute = currentTime.getMinutes();
            let second = currentTime.getSeconds();

            // Hour hand
            hour = hour % 12;
            hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
            drawHand(ctx, hour, radius * 0.5, radius * 0.07, '#4A4A4A'); /* Dark grey hour hand */

            // Minute hand
            minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
            drawHand(ctx, minute, radius * 0.8, radius * 0.07, '#4A4A4A'); /* Dark grey minute hand */

            // Second hand
            second = (second * Math.PI / 30);
            drawHand(ctx, second, radius * 0.9, radius * 0.02, '#E57373'); /* Red accent second hand */
        }

        function drawHand(ctx, pos, length, width, color) {
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.lineCap = "round";
            ctx.strokeStyle = color;
            ctx.moveTo(0, 0);
            ctx.rotate(pos);
            ctx.lineTo(0, -length);
            ctx.stroke();
            ctx.rotate(-pos);
        }

        function updateClock() {
            ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC time in milliseconds
            const targetTime = new Date(utc + (3600000 * timezoneOffset)); // Target timezone time

            drawFace(ctx, radius);
            drawNumbers(ctx, radius);
            drawTime(ctx, radius, targetTime);
        }

        setInterval(updateClock, 1000);
        updateClock(); // Initial draw
    }

    // Initialize clocks for the specified timezones
    // Note: For precise DST handling, a library like moment-timezone is better. These are fixed offsets.
    // New York: UTC-4 (assuming EDT for current date), London: UTC+1 (assuming BST), Tokyo: UTC+9, Delhi: UTC+5.5, Sydney: UTC+10 (AEST)
    drawClock('clock-nyc', -4); // New York (EDT)
    drawClock('clock-lon', 1);  // London (BST)
    drawClock('clock-tok', 9);  // Tokyo (JST)
    drawClock('clock-del', 5.5); // Delhi (IST)
    drawClock('clock-syd', 10); // Sydney (AEST) - Australia/Sydney for May 30, 2025
});