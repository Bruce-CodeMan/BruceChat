from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai


# Custom Function Imports
from utils.openai_requests import convert_audio_to_text, get_chat_response

# Initiate the App
app = FastAPI()

# CORS-origins
origins = [
    "http://localhost:5173"
]

# CORS-Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def check_health():
    return {"message": "health"}

@app.get("/post-audio-get/")
async def get_audio():

    # Get saved audio
    audio_input = open("test.m4a", "rb")

    # Decode Audio
    message_text = convert_audio_to_text(audio_file=audio_input)

    # Guard: Ensure message decode
    if not message_text:
        return HTTPException(status_code=400, detail="Failed to decode audio")

    # Get ChatGPT Response
    chat_response = get_chat_response(message_text)

    print(chat_response)
    return "Done"

# @app.post("/post-audio/")
# async def post_audio(file: UploadFile = File(...)): 
#     print("Hello")