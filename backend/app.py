import json
import time
import uuid
from datetime import datetime
from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import redis
import sys

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size=10000000)
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# --- 1. REDIS CONNECTION CHECK ---
try:
    redis_client.ping()
    print("✅ Successfully connected to Redis!")
except redis.ConnectionError:
    print("❌ Failed to connect to Redis. Make sure your Redis server is running.")
    sys.exit(1)

# --- 2. SEED PERMANENT ROOMS ---
def seed_permanent_rooms():
    permanent_rooms = [
        {
            'chatId': 'agro_ai_room', 
            'username': 'AgroAI Assistant', 
            'lastMessage': 'Hello! How can I help with your crops?', 
            'isSeen': 'True',
            'avatar': './avatar.png'
        },
        {
            'chatId': 'plant_doc_room', 
            'username': 'Plant Doctor', 
            'lastMessage': 'Upload a leaf image for diagnosis.', 
            'isSeen': 'True',
            'avatar': './avatar.png'
        }
    ]
    
    for room in permanent_rooms:
        if not redis_client.sismember('chats', room['chatId']):
            redis_client.sadd('chats', room['chatId'])
            redis_client.hset(f"chat:{room['chatId']}", mapping=room)
    print("✅ Permanent rooms seeded.")

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    # Send the list of chats as soon as a client connects
    handle_get_chats()

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")

# --- CHAT LIST (ROOMS) LOGIC ---
@socketio.on('get_chats')
def handle_get_chats():
    chat_ids = redis_client.smembers('chats')
    chats = []
    for cid in chat_ids:
        chat_data = redis_client.hgetall(f"chat:{cid}")
        if not chat_data: continue # Skip if empty
        chat_data['isSeen'] = chat_data.get('isSeen') == 'True'
        chat_data['user'] = {
            'username': chat_data.pop('username', 'Unknown User'),
            'avatar': chat_data.pop('avatar', './avatar.png')
        }
        chats.append(chat_data)
    
    emit('update_chats', chats)

@socketio.on('create_chat')
def handle_create_chat(data):
    chat_id = str(uuid.uuid4())
    new_chat = {
        'chatId': chat_id,
        'lastMessage': 'New chat created. Start typing!',
        'isSeen': 'True',
        'username': data.get('username', 'New User'),
        'avatar': './avatar.png'
    }
    redis_client.sadd('chats', chat_id)
    redis_client.hset(f"chat:{chat_id}", mapping=new_chat)
    handle_get_chats()

# --- MESSAGING & AI LOGIC ---
@socketio.on('join_chat')
def handle_join_chat(data):
    room = data.get('chatId')
    join_room(room)
    
    messages = redis_client.lrange(f"messages:{room}", 0, -1)
    parsed_messages = [json.loads(m) for m in messages]
    emit('chat_history', parsed_messages)

@socketio.on('send_message')
def handle_send_message(data):
    room = data.get('chatId')
    
    user_message = {
        'senderId': data.get('senderId', 'current_user_id'),
        'text': data.get('text', ''),
        'img': data.get('img', None),
        'createdAt': datetime.now().isoformat()
    }
    
    redis_client.rpush(f"messages:{room}", json.dumps(user_message))
    
    last_msg_text = user_message['text'] if user_message['text'] else 'Uploaded an image 📷'
    redis_client.hset(f"chat:{room}", 'lastMessage', last_msg_text)
    
    emit('receive_message', user_message, room=room)
    
    socketio.start_background_task(target=generate_ai_response, room=room, received_data=user_message)

def generate_ai_response(room, received_data):
    time.sleep(1.5) 
    ai_text = "I received your message. How can I help further?"
    
    if received_data.get('img'):
        ai_text = "Analyzing your crop image... It looks like early signs of Late Blight. I recommend applying a fungicide."
        
    ai_reply = {
        'senderId': 'ai_bot', 
        'text': ai_text,
        'img': None,
        'createdAt': datetime.now().isoformat()
    }
    
    redis_client.rpush(f"messages:{room}", json.dumps(ai_reply))
    redis_client.hset(f"chat:{room}", 'lastMessage', ai_text)
    redis_client.hset(f"chat:{room}", 'isSeen', 'False')
    
    socketio.emit('receive_message', ai_reply, room=room)
    
    with app.test_request_context():
        chat_ids = redis_client.smembers('chats')
        chats = []
        for cid in chat_ids:
            chat_data = redis_client.hgetall(f"chat:{cid}")
            chat_data['isSeen'] = chat_data.get('isSeen') == 'True'
            chat_data['user'] = {
                'username': chat_data.pop('username', 'Unknown User'),
                'avatar': chat_data.pop('avatar', './avatar.png')
            }
            chats.append(chat_data)
        socketio.emit('update_chats', chats)


if __name__ == '__main__':
    seed_permanent_rooms() # Seed rooms before starting server
    socketio.run(app, debug=True, port=5000)