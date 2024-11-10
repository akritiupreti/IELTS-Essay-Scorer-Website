const topic = document.getElementById('topic');
const essay = document.getElementById('essay');
const send = document.getElementById('btn1');
const output = document.getElementById('output1');
const scoreDiv = document.getElementById('score');
const wordCountDisplay = document.getElementById('wordCount');
const toggleMode = document.getElementById('toggleMode');

// Sample essay topic and content
const sampleTopic = cleanText(document.getElementById('sampleTopic').textContent);
const sampleEssay = cleanText(document.getElementById('sampleEssay').textContent);

// Function to clean text input
function cleanText(text) {
    text = text.replace(/(\r\n|\n|\r)/gm, "").trim();
    text = text.replace(/\s{2,}/g, ' ');
    return text
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

        fetch('http://localhost:5000/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                const taskAchievement = data.taskAchievement;
                const coherenceCohesion = data.coherenceCohesion;
                const lexicalResource = data.lexicalResource;
                const grammaticalRangeAccuracy = data.grammaticalRangeAccuracy;
                const overall = data.overall;

                const taskFeedback = data.taskFeedback;
                const coherenceFeedback = data.coherenceFeedback;
                const lexicalFeedback = data.lexicalFeedback;
                const grammarFeedback = data.grammarFeedback;

                console.log('Success');

                scoreDiv.innerHTML = `
                <div class="score">
                    <p>Task Achievement: ${taskAchievement}/9</p>
                    <p>${taskFeedback}</p>
                </div>
                <div class="score">
                    <p>Coherence and Cohesion: ${coherenceCohesion}/9</p>
                    <p>${coherenceFeedback}</p>
                </div>
                <div class="score">
                    <p>Lexical Resource: ${lexicalResource}/9</p>
                    <p>${lexicalFeedback}</p>
                </div>
                <div class="score">
                    <p>Grammatical Range and Accuracy: ${grammaticalRangeAccuracy}/9</p>
                    <p>${grammarFeedback}</p>
                </div>
                <p><h2>Overall: ${overall}/9</h2></p>
            `;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
