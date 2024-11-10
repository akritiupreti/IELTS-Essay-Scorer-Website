from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import numpy as np
import tensorflow as tf
from transformers import TFBertModel, BertTokenizer
from tensorflow.keras.models import load_model
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

bert_model_name = 'bert-base-uncased'
bert_tokenizer = BertTokenizer.from_pretrained(bert_model_name)

with tf.device('/CPU:0'):
    with tf.keras.utils.custom_object_scope({'TFBertModel': TFBertModel}):
        bert_prompt_model = load_model('models/bert_lstm_model_prompt_1.h5')

    with tf.keras.utils.custom_object_scope({'TFBertModel': TFBertModel}):
        bert_essay_model = load_model('models/bert_lstm_model_essay_1.h5')


# Define route to handle the POST request
@app.route('/score', methods=['POST'])
def get_scores():
    data = request.get_json()  # Receive the JSON data from the frontend

    # Extract essay and prompt from the request (for now, we'll just log them)
    prompt = data.get('prompt')
    essay = data.get('essay')

    scores = compute_scores(prompt, essay)

    # Create the response to send back to the frontend
    scores = {
        "taskAchievement": scores[0],
        "coherenceCohesion": scores[1],
        "lexicalResource": scores[2],
        "grammaticalRangeAccuracy": scores[3],
        "overall": scores[4],
        "taskFeedback": "",
        "coherenceFeedback": "",
        "lexicalFeedback": "",
        "grammarFeedback": ""
    }

    response = model.generate_content(
        f'''
        This is an IELTS task 2 essay written by a candidate.
        
        Prompt: {prompt}
        Essay: {essay}
        The candidate received the following scores:
        Task Achievement: {scores["taskAchievement"]}/9
        Coherence and Cohesion: {scores["coherenceCohesion"]}/9
        Lexical Resource: {scores["lexicalResource"]}/9
        Grammatical Range and Accuracy: {scores["grammaticalRangeAccuracy"]}/9
        Overall: {scores["overall"]}/9
    
        Justify the scores by providing appropriate and honest feedback for each scoring dimension. The feedback for each dimension should be no longer than 50 words.
        Dont bold any text. Your response format should be like this:
        taskFeedback: <task achievement feedback>
        coherenceFeedback: <coherence and cohesion feedback>
        lexicalFeedback: <lexical resource feedback>
        grammarFeedback: <grammatical range and accuracy feedback>
        '''
    )

    text = response.text
    scores['taskFeedback'] = text[text.find("taskFeedback:") + len("taskFeedback:") + 1: text.find("coherenceFeedback")]
    scores['coherenceFeedback'] = text[text.find("coherenceFeedback:") + len("coherenceFeedback:") + 1: text.find("lexicalFeedback")]
    scores['lexicalFeedback'] = text[text.find("lexicalFeedback:") + len("lexicalFeedback:") + 1: text.find("grammarFeedback")]
    scores['grammarFeedback'] = text[text.find("grammarFeedback:") + len("grammarFeedback:") + 1:]

    print(response.text)

    return jsonify(scores)  # Send back the scores as a JSON response


def compute_scores(prompt, essay):
    def round_ielts_score(predicted_score):
        return np.round(predicted_score*2)/2

    def remove_empty_lines(essay):
        lines = essay.splitlines()
        cleaned = '\n'.join(line for line in lines if line.strip() != '')
        return cleaned

    prompt = remove_empty_lines(prompt)
    essay = remove_empty_lines(essay)

    prompt_essay = prompt + " " + essay
    input_ids_prompt = bert_tokenizer(
        [prompt_essay],
        padding='max_length',
        truncation=True,
        return_tensors='tf',
        max_length=350
    )['input_ids']

    input_ids_essay = bert_tokenizer(
        [essay],
        padding='max_length',
        truncation=True,
        return_tensors='tf',
        max_length=350
    )['input_ids']

    X_prompt_dict = {
        "input_ids": input_ids_prompt
    }

    X_essay_dict = {
        "input_ids": input_ids_essay
    }

    pred_prompt = bert_prompt_model.predict(X_prompt_dict)
    pred_essay = bert_essay_model.predict(X_essay_dict)

    task_achievement = round_ielts_score(pred_prompt[0][0])
    scores = [round_ielts_score(pred_essay[x][0][0]) for x in range(3)]

    overall = round_ielts_score((task_achievement + sum(scores))/4)
    res = [task_achievement] + scores + [overall]
    res = [float(x) for x in res]

    return res

if __name__ == '__main__':
    app.run(debug=True)
