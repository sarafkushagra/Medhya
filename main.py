import os
import io
import numpy as np
import onnxruntime as ort
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Header, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# ================================
# Configuration
# ================================
load_dotenv()
# API key for the EEG prediction API. Set this in your environment or an .env file as EEG_API_KEY
API_KEY = "test-key"  # Hardcoded for testing
if not API_KEY:
    print("[WARNING] EEG_API_KEY not set in environment. Requests to /predict will be rejected unless you set the key.")
UPLOAD_DIR = "uploads"
ONNX_PATH = "best_eeg_model.onnx"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ================================
# Model Serving (ONNX Runtime)
# ================================
print("[INFO] Loading EEG ONNX model...")
ort_session = ort.InferenceSession(ONNX_PATH)
print("[OK] EEG ONNX model loaded successfully.")

# ================================
# Helper Functions
# ================================
def verify_api_key(api_key: str):
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API Key.")

def preprocess_eeg_data(df):
    from sklearn.preprocessing import StandardScaler
    
    if "y" in df.columns:
        df = df.drop(columns=["y"])
    X = df.select_dtypes(include=["float64", "int64"]).values.astype("float32")
    scaler = StandardScaler()
    X = scaler.fit_transform(X)
    X = X.reshape(len(X), 1, X.shape[1])
    return X

def predict_eeg(X):
    ort_inputs = {ort_session.get_inputs()[0].name: X}
    ort_outs = ort_session.run(None, ort_inputs)
    predicted = np.argmax(ort_outs[0], axis=1)
    # Convert from 0-indexed back to 1-indexed (1-5)
    preds = (predicted + 1).tolist()
    return preds

LABEL_MEANINGS = {
    1: "Healthy brain activity",
    2: "Mild epileptic activity",
    3: "Moderate epileptic activity",
    4: "Severe epileptic activity",
    5: "Seizure state",
}

# ================================
# FastAPI App
# ================================
eeg_app = FastAPI(
    title="EEG Prediction API (with API Key)",
    description="Upload EEG CSV data for epileptic seizure classification. Requires API Key in headers.",
    version="1.0.1"
)

# Add CORS middleware
eeg_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@eeg_app.get("/")
def root():
    return {"message": "EEG Prediction API is running 🚀"}

@eeg_app.get("/api/health")
def health_check():
    return {"status": "OK", "message": "EEG Prediction API is healthy"}

@eeg_app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    api_key: str = Header(None, alias="x-api-key")  # 👈 expect API key in header
):
    verify_api_key(api_key)

    try:
        # Save uploaded CSV
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        save_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{file.filename}")
        contents = await file.read()
        with open(save_path, "wb") as f:
            f.write(contents)

        print(f"[OK] File saved: {save_path}")

        # Read & predict
        import pandas as pd
        df = pd.read_csv(io.BytesIO(contents))
        X = preprocess_eeg_data(df)
        preds = predict_eeg(X)
        results = [{"prediction": int(p), "meaning": LABEL_MEANINGS.get(p, "Unknown")} for p in preds]

        return JSONResponse(
            content={
                "file_saved_as": os.path.basename(save_path),
                "num_records": len(results),
                "results": results,
            }
        )

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8002))
    uvicorn.run(eeg_app, host="0.0.0.0", port=port)