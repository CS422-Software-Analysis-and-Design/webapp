from settings import Config
import requests

host = Config.BACKEND_HOST
port = Config.BACKEND_PORT
username = 'admin'
password = 'password'

def get_user_id():
    login_route = f'http://{host}:{port}/login/{username}/{password}'
    login_response = requests.post(login_route)
    user_id = login_response.json()['user_id']
    return user_id

def add_to_wish_list(user_id, product_id):
    add_to_wish_list_route = f'http://{host}:{port}/wish-list/add/{user_id}/{product_id}'
    add_to_wish_list_response = requests.post(add_to_wish_list_route)
    return add_to_wish_list_response

def get_wish_list(user_id):
    get_wish_list_route = f'http://{host}:{port}/wish-list/user/{user_id}'
    get_wish_list_response = requests.get(get_wish_list_route)
    return get_wish_list_response.json()

def remove_from_wish_list(user_id, product_id):
    remove_from_wish_list_route = f'http://{host}:{port}/wish-list/remove/{user_id}/{product_id}'
    remove_from_wish_list_response = requests.post(remove_from_wish_list_route)
    return remove_from_wish_list_response

user_id = get_user_id()
add_to_wish_list(user_id, 1)
add_to_wish_list(user_id, 2)
add_to_wish_list(user_id, 3)
remove_from_wish_list(user_id, 2)
print(get_wish_list(user_id))