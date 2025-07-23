const textarea = document.querySelector(".text-box"),
      voiceList = document.querySelector("#voiceList"),
      speechBtn = document.querySelector(".convert-button");

const synth = window.speechSynthesis;
let isSpeaking = false;

// Populate voice list
function populateVoices() {
    voiceList.innerHTML = ""; // Clear existing
    const voices = synth.getVoices();
    voices.forEach(voice => {
        const selected = voice.name === "Google US English" ? "selected" : "";
        const option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    });
}

// Ensure voices load after synthesis is ready
synth.addEventListener("voiceschanged", populateVoices);

// Convert text to speech
function textToSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = synth.getVoices().find(voice => voice.name === voiceList.value);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    synth.speak(utterance);
}

// Button click handler
speechBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (!text) return;

    if (!synth.speaking) {
        textToSpeech(text);
        speechBtn.innerText = "Pause Speech";
        isSpeaking = true;
    } else {
        if (isSpeaking) {
            synth.pause();
            speechBtn.innerText = "Resume Speech";
        } else {
            synth.resume();
            speechBtn.innerText = "Pause Speech";
        }
        isSpeaking = !isSpeaking;
    }

    // Reset button after speech ends
    const interval = setInterval(() => {
        if (!synth.speaking && !synth.paused) {
            speechBtn.innerText = "Convert to Speech";
            isSpeaking = false;
            clearInterval(interval);
        }
    }, 200);
});
