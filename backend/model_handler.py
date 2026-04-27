import base64
import io
import os
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    # We use gemini-1.5-flash as it is the fastest model for text-based reasoning
    gemini_model = genai.GenerativeModel('gemini-2.5-flash')
    print("✅ Gemini API configured successfully!")
except KeyError:
    print("❌ GEMINI_API_KEY not found in .env file. AI suggestions will be disabled.")
    gemini_model = None


# --- CONFIGURATION ---
MODEL_PATH = 'Potato_leaf_disease_detection.h5' # Ensure this path is correct
class_names = ['Potato Early blight', 'Potato Late blight', 'Potato healthy']

# --- LOAD MODEL ---
try:
    print("Loading AI Model...")
    model = load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None


def get_treatment_recommendation(disease_name):
    """Fetches treatment suggestions from Gemini API."""
    if not gemini_model:
        return "\n\n*(Note: Treatment suggestions are currently unavailable because the Gemini API key is missing.)*"
    
    prompt = f"""
    You are an expert agronomist and plant doctor. 
    An AI image detection model has just diagnosed a crop leaf with '{disease_name}'.
    Provide a brief, practical, and highly actionable recommendation for treatment, including specific types of fungicides or organic remedies if applicable. 
    Format your response clearly using bullet points. Keep it concise.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        return f"\n\n**Recommended Treatment:**\n{response.text}"
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "\n\n*(Sorry, I couldn't fetch treatment suggestions at this moment. Please consult a local agronomist.)*"
    

def predict_leaf_disease(base64_image_string):
    """Decodes base64 image, preprocesses it, and runs the model."""
    if model is None:
        return "Error: AI model is not loaded on the server."
    
    try:
        # 1. Strip the base64 prefix if present (e.g., "data:image/jpeg;base64,...")
        if "," in base64_image_string:
            base64_image_string = base64_image_string.split(",")[1]
            
        # 2. Decode the image string
        image_bytes = base64.b64decode(base64_image_string)
        img = Image.open(io.BytesIO(image_bytes))
        
        # 3. Preprocess the image (Resize to 224x224, ensure RGB, scale pixels)
        img = img.resize((224, 224))
        img = img.convert('RGB')
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # 4. Make Prediction
        prediction = model.predict(img_array)
        predicted_index = np.argmax(prediction)
        predicted_label = class_names[predicted_index]
        
        # 5. Format Output
        if predicted_label == 'Potato healthy':
            return "Analysis complete. The leaf appears to be **Healthy**. Keep up the good work!"
        else:
            base_message = f"Analysis complete. The leaf is Unhealthy.\nDisease detected: **{predicted_label}**."
            
            # Fetch treatment from Gemini
            treatment_advice = get_treatment_recommendation(predicted_label)
            
            # Combine the Keras diagnosis with the Gemini treatment plan
            return base_message + treatment_advice
            
    except Exception as e:
        print(f"Prediction Error: {e}")
        return "Sorry, I ran into an issue analyzing the image. Please ensure it is a valid image file."