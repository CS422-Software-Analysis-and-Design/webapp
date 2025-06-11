import requests
from settings import Config

host = Config.BACKEND_HOST
port = Config.BACKEND_PORT

# First, get some product IDs
search_route = f'http://{host}:{port}/search_products?key=smartphone'
search_response = requests.get(search_route)
products = search_response.json()

if not products:
    print("No products found. Please try with a different search term.")
    exit(1)

# Get the first product ID
product_id = products[0]['product_id']
print(f"Testing with product ID: {product_id}")
print(f"Product name: {products[0]['title']}")

# Get the product description
description_route = f'http://{host}:{port}/product/{product_id}/description'
description_response = requests.get(description_route)

# Print the response
print(f"Status code: {description_response.status_code}")
if description_response.status_code == 200:
    result = description_response.json()
    print(f"Status: {result['status']}")
    print(f"Attempt: {result['attempt']}")
    print("\nProduct Description:")
    print(result['message'])
else:
    print("Error:", description_response.json())
