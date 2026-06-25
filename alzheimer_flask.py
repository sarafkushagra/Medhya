import os
import io
import numpy as np
from dotenv import load_dotenv
from PIL import Image
import onnxruntime as ort
from flask import Flask, request, jsonify
from flask_cors import CORS

# =====================================
# 🔧 Configuration
# =====================================
load_dotenv()

ONNX_PATH = "best_alzheimer_model.onnx"
# Load API key from environment (recommended).
API_KEY = os.environ.get("ALZHEIMER_API_KEY", "dev-key-alzheimer")
if not API_KEY:
    print("[WARNING] ALZHEIMER_API_KEY not set in environment. Requests to /predict will be rejected unless you set the key.")

# =====================================
# 🧩 Model Setup (ONNX Runtime)
# =====================================
CLASS_NAMES = ["Mild Impairment", "Moderate Impairment", "No Impairment", "Very Mild Impairment"]

CLASS_DESCRIPTIONS = {
    "No Impairment": "No visible signs of Alzheimer's disease.",
    "Very Mild Impairment": "Early stage with very slight memory issues or confusion.",
    "Mild Impairment": "Mild cognitive decline, may affect daily activities.",
    "Moderate Impairment": "More noticeable cognitive impairment, requiring assistance."
}

print("[INFO] Loading Alzheimer ONNX model...")
ort_session = ort.InferenceSession(ONNX_PATH)
print("[OK] Alzheimer ONNX model loaded successfully.")

# =====================================
# 🧠 Flask App Setup
# =====================================
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# =====================================
# 🔐 Helper: Verify API Key
# =====================================
def verify_api_key(api_key):
    return api_key == API_KEY

# =====================================
# 🧼 Image Preprocessing
# =====================================
def preprocess_image(image_bytes):
    # Open image and convert to RGB
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # Resize to 224x224 (equivalent to transforms.Resize((224, 224)))
    image = image.resize((224, 224), Image.Resampling.BILINEAR)
    # Convert to numpy array and scale to [0, 1] (equivalent to transforms.ToTensor())
    img_np = np.array(image).astype(np.float32) / 255.0
    # Transpose channels from HWC to CHW
    img_np = np.transpose(img_np, (2, 0, 1))
    # Normalize mean and std (equivalent to transforms.Normalize())
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(3, 1, 1)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(3, 1, 1)
    img_np = (img_np - mean) / std
    # Add batch dimension (equivalent to unsqueeze(0))
    img_np = np.expand_dims(img_np, axis=0)
    return img_np

# =====================================
# 🔮 Prediction Endpoint
# =====================================
@app.route('/predict', methods=['POST'])
def predict():
    # Verify API key
    api_key = request.headers.get('x-api-key')
    if not verify_api_key(api_key):
        return jsonify({"error": "Invalid or missing API Key."}), 401

    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']

        # Validate file type
        if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            return jsonify({"error": "Invalid file type. Please upload an image (jpg/jpeg/png)."}), 400

        # Read image bytes
        image_bytes = file.read()
        image_tensor = preprocess_image(image_bytes)

        # Model prediction using ONNX runtime
        ort_inputs = {ort_session.get_inputs()[0].name: image_tensor}
        ort_outs = ort_session.run(None, ort_inputs)
        predicted = np.argmax(ort_outs[0], axis=1)
        predicted_class = CLASS_NAMES[predicted[0]]
        meaning = CLASS_DESCRIPTIONS.get(predicted_class, "No description available.")

        return jsonify({
            "prediction": predicted_class,
            "meaning": meaning
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =====================================
# 🌐 Root Endpoint
# =====================================
@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to Alzheimer MRI Classifier API 🚀",
        "usage": "POST /predict with an MRI image and 'x-api-key' header."
    })

# =====================================
# 🚀 Run the Server
# =====================================
if __name__ == "__main__":
    print("[INFO] Starting Alzheimer MRI Classifier API server with Flask...")
    import os
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)