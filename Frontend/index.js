const topic = document.getElementById('topic');
const essay = document.getElementById('essay');
const send = document.getElementById('btn1');
const output = document.getElementById('output1');
const scoreDiv = document.getElementById('score');
const wordCountDisplay = document.getElementById('wordCount');
const toggleMode = document.getElementById('toggleMode');

function cleanText(text) {
    res = text.replace(/(\r\n|\n|\r)/gm, "").trim();
    return res;
}

function fun1() {
    const promptText = cleanText(topic.value);
    const essayText = cleanText(essay.value);

    const words = essayText.split(/\s+/).filter(word => word.length > 0).length;

    if (words < 150) {
        output.innerText = "Your essay must be at least 150 words.";
    } else {
        const data = {
            prompt: promptText,
            essay: essayText
        };

        // fetch('http://localhost:5000/score', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         const taskAchievement = data.taskAchievement;
        //         const coherenceCohesion = data.coherenceCohesion;
        //         const lexicalResource = data.lexicalResource;
        //         const grammaticalRangeAccuracy = data.grammaticalRangeAccuracy;
        //         const overall = data.overall;

        //         scoreDiv.innerHTML = `
        //         <p>Task Achievement: ${taskAchievement}/9</p>
        //         <p>Coherence and Cohesion: ${coherenceCohesion}/9</p>
        //         <p>Lexical Resource: ${lexicalResource}/9</p>
        //         <p>Grammatical Range and Accuracy: ${grammaticalRangeAccuracy}/9</p>
        //         <p><strong>Overall: ${overall}/9</strong></p>
        //     `;
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });

        scoreDiv.innerHTML = `
                <p>Task Achievement: 7/9</p>
                <p>Coherence and Cohesion: 5/9</p>
                <p>Lexical Resource: 6/9</p>
                <p>Grammatical Range and Accuracy: 6.5/9</p>
                <p><strong>Overall: 6.5/9</strong></p>
            `;

    }
}

function updateWordCount() {
    const essayText = essay.value.trim();
    const words = essayText.split(/\s+/).filter(word => word.length > 0).length;
    wordCountDisplay.innerText = `Word Count: ${words}`;
}

send.addEventListener('click', fun1);
essay.addEventListener('input', updateWordCount);

// Dark Mode Toggle
toggleMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
    left.classList.toggle('dark-mode');
    right.classList.toggle('dark-mode');
});
