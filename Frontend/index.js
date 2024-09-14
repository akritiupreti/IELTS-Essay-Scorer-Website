const topic = document.getElementById('topic');
const essay = document.getElementById('essay');
const send = document.getElementById('btn1');
const output = document.getElementById('output1');
const scoreDiv = document.getElementById('score');

function cleanText(text) {
    res = text.replace(/(\r\n|\n|\r)/gm, "").trim();
    console.log(res);
    return(res);
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
                console.log('Success');

                scoreDiv.innerHTML = `
                <p>Task Achievement: ${taskAchievement}/9</p>
                <p>Coherence and Cohesion: ${coherenceCohesion}/9</p>
                <p>Lexical Resource: ${lexicalResource}/9</p>
                <p>Grammatical Range and Accuracy: ${grammaticalRangeAccuracy}/9</p>
                <p><strong>Overall: ${overall}/9</strong></p>
            `;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

send.addEventListener('click', fun1);
