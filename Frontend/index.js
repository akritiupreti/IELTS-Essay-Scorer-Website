const topic = document.getElementById('topic');
const essay = document.getElementById('essay');
const send = document.getElementById('btn1');
const output = document.getElementById('output1');
const scoreDiv = document.getElementById('score');
const wordCountDisplay = document.getElementById('wordCount');
const toggleMode = document.getElementById('toggleMode');

// Sample essay topic and content
const sampleTopic = "The Importance of Education";
const sampleEssay = "Education is one of the most important aspects of life. It shapes individuals and equips them with the knowledge and skills necessary to navigate the world. A well-educated population is essential for the development of society, as it fosters critical thinking, creativity, and innovation.";

// Function to clean text input
function cleanText(text) {
    return text.replace(/(\r\n|\n|\r)/gm, "").trim();
}

// Function to handle the scoring process
function fun1() {
    const promptText = cleanText(topic.value);
    const essayText = cleanText(essay.value);

    const words = essayText.split(/\s+/).filter(word => word.length > 0).length;

    if (words < 150) {
        output.innerText = "Your essay must be at least 150 words.";
    } else {
        // Show the right box
        const rightBox = document.getElementById('rightBox');
        rightBox.classList.remove('hidden'); // Remove the 'hidden' class to display the box

        const data = {
            prompt: promptText,
            essay: essayText
        };

        // Simulated static scores
        scoreDiv.innerHTML = `
            <p>Task Achievement: 7/9</p>
            <p>Coherence and Cohesion: 5/9</p>
            <p>Lexical Resource: 6/9</p>
            <p>Grammatical Range and Accuracy: 6.5/9</p>
            <p><strong>Overall: 6.5/9</strong></p>
        `;
    }
}

// Function to update word count
function updateWordCount() {
    const essayText = essay.value.trim();
    const words = essayText.split(/\s+/).filter(word => word.length > 0).length;
    wordCountDisplay.innerText = `Word Count: ${words}`;
}

// Function to populate sample essay and topic
function populateSample() {
    topic.value = sampleTopic;
    essay.value = sampleEssay;
}

// Event listeners
send.addEventListener('click', fun1);
essay.addEventListener('input', updateWordCount);

// Add event listener for "Try It" button
document.getElementById('tryIt').addEventListener('click', populateSample);

// Dark Mode Toggle
toggleMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
    left.classList.toggle('dark-mode');
    right.classList.toggle('dark-mode');
});
