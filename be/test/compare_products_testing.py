from settings import Config

host = Config.BACKEND_HOST
port = Config.BACKEND_PORT

import requests

def search_products_with_keyword(keyword):
    host = Config.BACKEND_HOST
    port = Config.BACKEND_PORT
    search_products_route = f'http://{host}:{port}/product/{keyword}/hehe/20/0'
    search_products_response = requests.get(search_products_route)
    return search_products_response.json()

def compare_products(compare_id):
    host = Config.BACKEND_HOST
    port = Config.BACKEND_PORT
    route = f'http://{host}:{port}/products/compare'
    data = {
        'id' : compare_id
    }
    response = requests.post(route, json=data)
    return response.json()


products = []

while len(products) < 5:
    products = search_products_with_keyword('iphone')

compare_id = [1, 3, 4]

print(compare_products(compare_id))