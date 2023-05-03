from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai


# Custom Function Imports
from utils.openai_requests import convert_audio_to_text, get_chat_response
from utils.database import store_messages, reset_messages
from utils.text_to_speech import convert_text_to_speech

# Initiate the App
app = FastAPI()

# CORS-origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
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

@app.get("/reset-messages")
async def reset():
    reset_messages()
    return "Done"

@app.post("/post-audio")
async def post_audio(file: UploadFile = File(...)):

    # Saved file from Frontend
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")

    # Decode Audio
    message_text = convert_audio_to_text(audio_file=audio_input)

    # Guard: Ensure message decode
    if not message_text:
        return HTTPException(status_code=400, detail="Failed to decode audio")

    # Get ChatGPT Response
    chat_response = get_chat_response(message_text)

    if not chat_response:
        return HTTPException(status_code=400, detail="Failed to get chat response")

    # Store message
    store_messages(message_text, chat_response)

    # Convert chat response to audio
    audio_output = convert_text_to_speech(chat_response)

    # Guard: Ensure Convert chat response
    if not audio_output:
        return HTTPException(status_code=400, detail="Failed to convert chat response")

    # Create a generator that yields chunks of data
    def iterfile():
        yield audio_output

    return StreamingResponse(iterfile(), media_type="application/octet-stream")

# @app.post("/post-audio/")
# async def post_audio(file: UploadFile = File(...)): 
#     print("Hello")