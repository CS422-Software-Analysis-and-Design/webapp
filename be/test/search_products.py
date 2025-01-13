import requests
import json
from settings import Config

def search_products_with_keyword(keyword):
    host = Config.BACKEND_HOST
    port = Config.BACKEND_PORT
    search_products_route = f'http://{host}:{port}/product/{keyword}/hehe/20/0'
    search_products_response = requests.get(search_products_route)
    return search_products_response.json()

def search_products_with_id(product_id):
    host = Config.BACKEND_HOST
    port = Config.BACKEND_PORT
    search_products_route = f'http://{host}:{port}/product/{product_id}'
    search_products_response = requests.get(search_products_route)
    return search_products_response.json()

print(search_products_with_keyword('iphone'))
print(search_products_with_id(1))
