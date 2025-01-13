import requests
from settings import Config

username = 'username'
password = 'password'
email = 'email'

# url = f'http://127.0.0.1:5002'
url = f'http://{Config.BACKEND_HOST}:{Config.BACKEND_PORT}'
login_route = f'/login/{username}/{password}'
signup_route = f'/signup/{username}/{email}/{password}'

def login():
    response = requests.post(url + login_route)
    return response.json()

def signup():
    response = requests.post(url + signup_route)
    return response.json()

def change_password(old_password, new_password):
    change_password_route = f'/change-password/{username}/{old_password}/{new_password}'
    response = requests.post(url + change_password_route)
    return response.json()

def get_account_info():
    response = requests.get(url + f'/account/{username}')
    return response.json()

user_id = login()['user_id']

def update_user_info(email, phone, city):
    route = f'/account/update/{user_id}'
    response = requests.post(url + route, json={'email': email, 'phone': phone, 'city': city})
    return response.json()


response = signup()
# assert response['status'] == 'created', f'Signup response: {response}'

# print(f'Sign up successful: {response}')

response = signup()
assert response['status'] == 'duplicate username', f'Signup response: {response}'

print(f'Sign up failed: {response}')

response = login()
assert response['cookies'] is not None, f'Login response: {response}'

print(f'Login successful: {response}')
print(f'Change password: {change_password(password, "new_password")}')
print(f'Change to old password: {change_password("new_password", password)}')
print(f'Account info: {get_account_info()}')
print(f'Update user info: {update_user_info("new_email", "new_phone", "new_city")}')
print(f'Account info: {get_account_info()}')

