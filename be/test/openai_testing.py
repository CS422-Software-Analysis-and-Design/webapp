import requests
from settings import Config

username = 'username'
password = 'password'
email = 'email'
host = Config.BACKEND_HOST
port = Config.BACKEND_PORT

signup_route = f'http://{host}:{port}/signup/{username}/{email}/{password}'
signup_response = requests.post(signup_route)

login_route = f'http://{host}:{port}/login/{username}/{password}'
login_response = requests.post(login_route)
user_id = login_response.json()['user_id']

conversation_create_route = f'http://{host}:{port}/chatbot/create/{user_id}'
conversation_create_response = requests.post(conversation_create_route)
conversation_id = conversation_create_response.text
print(f'Conversation ID: {conversation_id}')

message = 'Hello, who are you?'
print(f'User message: {message}')
conversation_send_message_route = f'http://{host}:{port}/chatbot/{conversation_id}/send_message/{message}'
conversation_send_message_response = requests.post(conversation_send_message_route)
assistant_response = conversation_send_message_response.json()['response']
print(f'Assistant response: {assistant_response}')


message = 'Uh, can you give me a brief introduction?'
print(f'User message: {message}')
conversation_send_message_route = f'http://{host}:{port}/chatbot/{conversation_id}/send_message/{message}'
conversation_send_message_response = requests.post(conversation_send_message_route)
assistant_response = conversation_send_message_response.json()['response']
print(f'Assistant response: {assistant_response}')

conversation_content_route = f'http://{host}:{port}/chatbot/{conversation_id}/content'
conversation_content_response = requests.get(conversation_content_route)


conversation_content = conversation_content_response.json()
print(f'Conversation content: {conversation_content}')

