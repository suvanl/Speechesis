// SERVICE WORKERS

// Make sure service workers are supported
if ("serviceWorker" in navigator) {
	console.log("[SW]: Service workers supported.");
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("../../sw.js")
			.then(() => console.log("[SW]: Service worker registered."))
			.catch(err => console.error(`[SW]: Error: ${err}`));
	});
}

// MAIN APPLICATION

const synth = speechSynthesis;

const body = document.querySelector("body");
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");

let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    voices.forEach(voice => {
        const option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute("data-name", voice.name);
        option.setAttribute("data-lang", voice.lang);
        voiceSelect.appendChild(option);
    });
};

getVoices();

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

const speak = () => {
    // Return if already speaking
    if (synth.speaking) return console.error("[Error]: Already speaking.");

    if (textInput.value !== "") {
        // // Background animation
        // body.style.background = "#141414 url(assets/img/wave.gif)";
        // body.style.backgroundRepeat = "repeat-x";
        // body.style.backgroundSize = "100% 100%";

        // Speech synthesis
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        // Speech end event
        speakText.onend = () => {
            // console.log("[Info]: Finished speaking.");
            body.style.background = "#141414";
        };

        // Speech error event
        speakText.onerror = () => {
            console.error("[Error]: An error occurred whilst speaking.");
            body.style.background = "#141414";
        };

        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");
        
        voices.forEach(voice => {
            if (voice.name === selectedVoice) speakText.voice = voice;
        });

        // Rate and pitch
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak
        synth.speak(speakText);
    }
};

// Event Listeners

// Text form submit
textForm.addEventListener("submit", e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

// Rate value change
rate.addEventListener("change", () => rateValue.textContent = rate.value);

// Pitch value change
pitch.addEventListener("change", () => pitchValue.textContent = pitch.value);

// Voice select change
voiceSelect.addEventListener("change", () => speak());
