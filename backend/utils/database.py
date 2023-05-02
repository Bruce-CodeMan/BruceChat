import json
import random

# Get recent messages
def get_recent_messages():

    # Define the file name and learn instruction
    file_name = "stored_data.json"
    learn_instruction = {
        "role": "system",
        "content": """You are interviewing the user for a job as a retail assitant. 
                        Ask short questions that are relevant to the junior position.
                        Your name is Bruce, The user is called Lee.
                        Keep your answers to under 30 words"""
    }

    # Initialize messages
    messages = []

    # Add a random element
    x = random.uniform(0, 1)
    if x < 0.5:
        learn_instruction["content"] += "Your response will include some dry humour"
    else:
        learn_instruction["content"] += "Your response will include a rather chalenging questions"
    
    # Append instruction to message
    messages.append(learn_instruction)

    # Get the last message
    try:
        with open(file=file_name) as f:
            data = json.load(f)

            # Append last 5 items of data
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)
    except Exception as e:
        pass

    return messages