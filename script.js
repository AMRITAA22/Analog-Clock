

const tick = new Audio('tick.mp3');
tick.volume = 0.2;
window.onload = () => {
    const body = document.querySelector('body'),
        hourHand = document.querySelector('.hour'),
        minuteHand = document.querySelector('.minute'),
        secondHand = document.querySelector('.second'),
        modeSwitch = document.querySelector('.mode-switch'),
        timezoneSelect = document.getElementById('timezone-select');

    let currentZone = 'local';

    if (localStorage.getItem('mode') === 'Dark Mode') {
        body.classList.add('dark');
        modeSwitch.textContent = 'Light Mode';
    } else {
        modeSwitch.textContent = 'Dark Mode';
    }

    modeSwitch.addEventListener('click', () => {
        body.classList.toggle('dark');
        const isDarkMode = body.classList.contains('dark');
        modeSwitch.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('mode', isDarkMode ? 'Dark Mode' : 'Light Mode');
    });

    timezoneSelect.addEventListener('change', () => {
        currentZone = timezoneSelect.value;
        updateTime();
    });

    // Load time zones dynamically from Intl API (no need for external API)
    if (typeof Intl.supportedValuesOf === 'function') {
        const timezones = Intl.supportedValuesOf('timeZone');
        timezones.forEach(zone => {
            const option = document.createElement('option');
            option.value = zone;
            option.textContent = zone;
            timezoneSelect.appendChild(option);
        });
    } else {
        // fallback
        const fallbackZones = ['Asia/Kolkata', 'Europe/London', 'America/New_York', 'Asia/Tokyo', 'Australia/Sydney'];
        fallbackZones.forEach(zone => {
            const option = document.createElement('option');
            option.value = zone;
            option.textContent = zone;
            timezoneSelect.appendChild(option);
        });
    }

    const updateTime = () => {
        let now = new Date();

        if (currentZone !== 'local') {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: currentZone,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            });
            const parts = formatter.formatToParts(now);
            const hours = parseInt(parts.find(p => p.type === 'hour').value);
            const minutes = parseInt(parts.find(p => p.type === 'minute').value);
            const seconds = parseInt(parts.find(p => p.type === 'second').value);

            now.setHours(hours, minutes, seconds);
        }

        setHands(now);
    };

    function setHands(date) {
        const seconds = date.getSeconds();
        const minutes = date.getMinutes();
        const hours = date.getHours();

        const secToDeg = (seconds / 60) * 360;
        const minToDeg = ((minutes + seconds / 60) / 60) * 360;
        const hrToDeg = ((hours % 12 + minutes / 60) / 12) * 360;

        secondHand.style.transform = `rotate(${secToDeg}deg)`;
        minuteHand.style.transform = `rotate(${minToDeg}deg)`;
        hourHand.style.transform = `rotate(${hrToDeg}deg)`;
    }

    setInterval(updateTime, 1000);
    updateTime();
};