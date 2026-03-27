# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pickle
# import re
# import string
# import numpy as np
# from scipy.sparse import hstack
# import os

# # ------------------ APP INIT ------------------ #
# app = Flask(__name__)
# CORS(app)  # IMPORTANT for React / Node integration

# # ------------------ LOAD MODEL FILES ------------------ #
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# rf_model = pickle.load(open(os.path.join(BASE_DIR, "rf_sms_model.pkl"), "rb"))
# tfidf = pickle.load(open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb"))
# sender_encoder = pickle.load(open(os.path.join(BASE_DIR, "sender_encoder.pkl"), "rb"))

# # ------------------ TEXT CLEANING ------------------ #
# def clean_text(text):
#     text = str(text).lower()
#     text = re.sub(r"http\S+|www\S+|https\S+", "", text)
#     text = re.sub(r"\d+", "", text)
#     text = text.translate(str.maketrans("", "", string.punctuation))
#     text = re.sub(r"\s+", " ", text).strip()
#     return text

# # ------------------ HEALTH CHECK ------------------ #
# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({
#         "status": "Flask ML API running",
#         "endpoint": "/predict"
#     })

# # ------------------ PREDICTION API ------------------ #
# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         data = request.get_json()

#         message = data.get("message", "")
#         sender_id = data.get("sender_id", "")
#         link_present = data.get("link_present", 0)

#         if message.strip() == "":
#             return jsonify({"error": "Message is required"}), 400

#         # Clean & vectorize text
#         cleaned_text = clean_text(message)
#         text_vector = tfidf.transform([cleaned_text])

#         # Encode sender
#         sender_encoded = (
#             sender_encoder.transform([sender_id])[0]
#             if sender_id in sender_encoder.classes_
#             else 0
#         )

#         # Combine features
#         features = hstack([
#             text_vector,
#             np.array([[link_present, sender_encoded]])
#         ])

#         # Predict
#         prediction = rf_model.predict(features)[0]
#         probability = rf_model.predict_proba(features)[0][prediction]

#         return jsonify({
#             "prediction": "Spam" if prediction == 1 else "Ham",
#             "confidence": round(float(probability) * 100, 2)
#         })

#     except Exception as e:
#         return jsonify({
#             "error": "Prediction failed",
#             "details": str(e)
#         }), 500

# # ------------------ RUN SERVER ------------------ #
# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 5000))
#     app.run(host="0.0.0.0", port=port, debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import string
import numpy as np
from scipy.sparse import hstack
import os

# ------------------ APP INIT ------------------ #
app = Flask(__name__)
CORS(app)

# ------------------ LOAD MODEL FILES ------------------ #
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

rf_model = pickle.load(open(os.path.join(BASE_DIR, "rf_sms_model.pkl"), "rb"))
tfidf = pickle.load(open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb"))
sender_encoder = pickle.load(open(os.path.join(BASE_DIR, "sender_encoder.pkl"), "rb"))

# ------------------ TEXT CLEANING ------------------ #
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text).strip()
    return text

# ------------------ HEALTH CHECK ------------------ #
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Flask ML API running",
        "endpoint": "/predict"
    })

# ------------------ PREDICTION API ------------------ #
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        message = data.get("message", "")
        sender_id = data.get("sender_id", "")
        link_present = data.get("link_present", 0)

        if message.strip() == "":
            return jsonify({"error": "Message is required"}), 400

        cleaned_text = clean_text(message)
        text_vector = tfidf.transform([cleaned_text])

        sender_encoded = (
            sender_encoder.transform([sender_id])[0]
            if sender_id in sender_encoder.classes_
            else 0
        )

        features = hstack([
            text_vector,
            np.array([[link_present, sender_encoded]])
        ])

        prediction = rf_model.predict(features)[0]
        probability = rf_model.predict_proba(features)[0][prediction]

        return jsonify({
            "prediction": "Spam" if prediction == 1 else "Safe",
            "confidence": round(float(probability) * 100, 2)
        })

    except Exception as e:
        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
