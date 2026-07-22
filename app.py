from flask import Flask, render_template, request
import joblib
import string
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import word_tokenize

# Load model and vectorizer
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

# Create Flask app
app = Flask(__name__)

ps = PorterStemmer()

# Text preprocessing function
def transform_text(text):
    text = text.lower()
    text = word_tokenize(text)

    y = []

    for word in text:
        if word.isalnum():
            y.append(word)

    stop_words = set(stopwords.words("english"))

    text = y[:]
    y.clear()

    for word in text:
        if word not in stop_words:
            y.append(word)

    text = y[:]
    y.clear()

    for word in text:
        y.append(ps.stem(word))

    return " ".join(y)


@app.route('/')
def home():
    return render_template('home.html')
@app.route("/analyze")
def analyze():
    return render_template("analyze.html")





@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/predict', methods=['POST'])
def predict():
    message = request.form.get("message", "") 
    file = request.files.get("textfile")
    if file and file.filename != "":
        message = file.read().decode("utf-8")

    # Preprocess
    transformed = transform_text(message)

    # Vectorize
    vector_input = vectorizer.transform([transformed])
 
    # Predict
    prediction = model.predict(vector_input)[0]

    # Probability
    probability = model.predict_proba(vector_input)[0]

    spam_prob = round(probability[1] * 100, 2)
    safe_prob = round(probability[0] * 100, 2)

    confidence = max(spam_prob, safe_prob)

    if prediction == 1:
        result = "Spam"
        prediction_class = "spam"
    else:
        result = "Not Spam"
        prediction_class = "safe"
    words = len(message.split())
    characters = len(message)

    spam_words = [
         "free","win","winner","offer","prize","click",
         "urgent","money","cash","loan","gift","claim",
         "limited","reward","congratulation"
    ]
    detected = []
    for word in message.lower().split():
        if word.strip(".,!?") in spam_words:
            detected.append(word)

    return render_template(
    "result.html",
    prediction=result,
    prediction_class=prediction_class,
    confidence=confidence,
    spam_prob=spam_prob,
    safe_prob=safe_prob,
    message=message,

    characters=characters,
    words=words,
    keyword_count=len(detected),
    keywords=detected
)
if __name__ == "__main__":
    app.run(debug=True)