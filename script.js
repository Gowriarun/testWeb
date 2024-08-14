const audioPlayer = document.getElementById('audio-player');
const canvas = document.getElementById('audio-visualizer');
const ctx = canvas.getContext('2d');
const button = document.querySelector('.button-56');

let isPlaying = false;
let audioContext, analyser, source, bufferLength, dataArray;

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        button.textContent = "Pause";
        if (!isPlaying) {
            initVisualizer();
        }
        isPlaying = true;
    } else {
        audioPlayer.pause();
        button.textContent = "Play";
    }
}

function initVisualizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    drawVisualizer();
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = canvas.width / 2;
    const barWidth = (canvas.width / bufferLength) * 2.5;

    ctx.save();
    ctx.translate(radius, radius);
    dataArray.forEach((value, index) => {
        const angle = (index / bufferLength) * 2 * Math.PI;
        const barHeight = value / 2;

        ctx.rotate(angle);
        ctx.fillStyle = `rgb(${value + 100}, 50, 50)`;
        ctx.fillRect(0, -radius, barWidth, barHeight);
    });
    ctx.restore();
}
