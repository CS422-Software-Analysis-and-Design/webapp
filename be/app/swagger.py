"""
Swagger documentation configuration for the API.
"""
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask_swagger_ui import get_swaggerui_blueprint
import json
import os

# Create an APISpec
spec = APISpec(
    title="Shopping API",
    version="1.0.0",
    openapi_version="3.0.2",
    plugins=[MarshmallowPlugin()],
)

# Define Swagger blueprint configuration
SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI
API_URL = '/static/swagger.json'  # URL to access API docs 

# Create Swagger UI blueprint
swagger_ui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Shopping API"
    }
)

# Swagger template for API documentation
swagger_template = {
    "openapi": "3.0.2",
    "info": {
        "title": "Shopping API",
        "description": "API for shopping application with product search, user accounts, and chatbot functionality",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "/",
            "description": "Main server"
        }
    ],
    "tags": [
        {
            "name": "general",
            "description": "General operations"
        },
        {
            "name": "products",
            "description": "Product operations"
        },
        {
            "name": "accounts",
            "description": "User account operations"
        },
        {
            "name": "chatbot",
            "description": "Chatbot operations"
        },
        {
            "name": "wishlist",
            "description": "Wishlist operations"
        }
    ],
    "paths": {
        "/": {
            "get": {
                "tags": ["general"],
                "summary": "API landing page",
                "description": "Returns a welcome message with API information",
                "responses": {
                    "200": {
                        "description": "Successful response with HTML welcome message"
                    }
                }
            }
        },
        "/search_products": {
            "get": {
                "tags": ["products"],
                "summary": "Search for products",
                "description": "Search for products using a keyword",
                "parameters": [
                    {
                        "name": "key",
                        "in": "query",
                        "required": True,
                        "description": "Search keyword",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "num",
                        "in": "query",
                        "required": False,
                        "description": "Number of results per page",
                        "schema": {"type": "integer", "default": 200}
                    },
                    {
                        "name": "start",
                        "in": "query",
                        "required": False,
                        "description": "Starting index for pagination",
                        "schema": {"type": "integer", "default": 0}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Product"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/login/{username}/{hashing_password}": {
            "post": {
                "tags": ["accounts"],
                "summary": "User login",
                "description": "Authenticate a user with username and password",
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": True,
                        "description": "Username for login",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "hashing_password",
                        "in": "path",
                        "required": True,
                        "description": "Hashed password for login",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Login successful",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "cookies": {"type": "string"},
                                        "user_id": {"type": "integer"}
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Login failed",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/signup/{username}/{email}/{password}": {
            "post": {
                "tags": ["accounts"],
                "summary": "User signup",
                "description": "Register a new user account",
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": True,
                        "description": "Username for the new account",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "email",
                        "in": "path",
                        "required": True,
                        "description": "Email for the new account",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "password",
                        "in": "path",
                        "required": True,
                        "description": "Password for the new account",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Account created successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "created"}
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Account creation failed",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "duplicate username"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/product/{keyword}/{filter}/{len}/{page}": {
            "get": {
                "tags": ["products"],
                "summary": "Search products with keyword",
                "description": "Search for products with keyword, filter, and pagination",
                "parameters": [
                    {
                        "name": "keyword",
                        "in": "path",
                        "required": True,
                        "description": "Search keyword",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "filter",
                        "in": "path",
                        "required": True,
                        "description": "Filter criteria",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "len",
                        "in": "path",
                        "required": True,
                        "description": "Number of results per page",
                        "schema": {"type": "integer"}
                    },
                    {
                        "name": "page",
                        "in": "path",
                        "required": True,
                        "description": "Page number for pagination",
                        "schema": {"type": "integer"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Product"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/product/{product_id}": {
            "get": {
                "tags": ["products"],
                "summary": "Get product by ID",
                "description": "Retrieve a product by its ID and record a view",
                "parameters": [
                    {
                        "name": "product_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the product to retrieve",
                        "schema": {"type": "integer"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Product"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/list-db-content": {
            "get": {
                "tags": ["general"],
                "summary": "List database content",
                "description": "List all tables and their content in the database",
                "responses": {
                    "200": {
                        "description": "Successful response with database content"
                    }
                }
            }
        },
        "/change-password/{username}/{old_password}/{new_password}": {
            "post": {
                "tags": ["accounts"],
                "summary": "Change user password",
                "description": "Change a user's password with verification",
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": True,
                        "description": "Username of the account",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "old_password",
                        "in": "path",
                        "required": True,
                        "description": "Current password for verification",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "new_password",
                        "in": "path",
                        "required": True,
                        "description": "New password to set",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Password changed successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "changed"}
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Password change failed",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "failed"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/account/{username}": {
            "get": {
                "tags": ["accounts"],
                "summary": "Get account information",
                "description": "Retrieve account information for a username",
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": True,
                        "description": "Username of the account",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response with user information",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/User"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/chatbot/create/{user_id}": {
            "post": {
                "tags": ["chatbot"],
                "summary": "Create a new conversation",
                "description": "Create a new chatbot conversation for a user",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the user",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response with new conversation information"
                    }
                }
            }
        },
        "/chatbot/conversation_list/{user_id}": {
            "get": {
                "tags": ["chatbot"],
                "summary": "Get user's conversations",
                "description": "Retrieve a list of chatbot conversations for a user",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the user",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response with list of conversations"
                    }
                }
            }
        },
        "/chatbot/{conversation_id}/content": {
            "get": {
                "tags": ["chatbot"],
                "summary": "Get conversation content",
                "description": "Retrieve the content of a specific conversation",
                "parameters": [
                    {
                        "name": "conversation_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the conversation",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response with conversation content"
                    }
                }
            }
        },
        "/chatbot/{conversation_id}/send_message/{message}": {
            "post": {
                "tags": ["chatbot"],
                "summary": "Send message to conversation",
                "description": "Send a message to a specific conversation and get a response",
                "parameters": [
                    {
                        "name": "conversation_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the conversation",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "message",
                        "in": "path",
                        "required": True,
                        "description": "Message to send",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response with chatbot answer",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "response": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/products/lastest": {
            "get": {
                "tags": ["products"],
                "summary": "Get latest products",
                "description": "Retrieve the latest 10 products added to the database",
                "responses": {
                    "200": {
                        "description": "Successful response with latest products",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Product"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/products/recent": {
            "get": {
                "tags": ["products"],
                "summary": "Get recent products",
                "description": "Retrieve the 10 most recently viewed products",
                "responses": {
                    "200": {
                        "description": "Successful response with recent products",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Product"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/product/{product_id}/{user_id}": {
            "post": {
                "tags": ["products"],
                "summary": "View product with user tracking",
                "description": "Record a product view by a specific user and retrieve the product",
                "parameters": [
                    {
                        "name": "product_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the product to view",
                        "schema": {"type": "integer"}
                    },
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the user viewing the product",
                        "schema": {"type": "integer"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response with product information",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Product"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/products/top_frequency": {
            "get": {
                "tags": ["products"],
                "summary": "Get top viewed products",
                "description": "Retrieve the 10 most frequently viewed products",
                "responses": {
                    "200": {
                        "description": "Successful response with top viewed products",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Product"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/products/trending": {
            "get": {
                "tags": ["products"],
                "summary": "Get trending products",
                "description": "Retrieve the 10 trending products based on recent views",
                "responses": {
                    "200": {
                        "description": "Successful response with trending products",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Product"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/account/update/{user_id}": {
            "post": {
                "tags": ["accounts"],
                "summary": "Update user information",
                "description": "Update personal information for a user account",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the user to update",
                        "schema": {"type": "integer"}
                    }
                ],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "first_name": {"type": "string"},
                                    "last_name": {"type": "string"},
                                    "email": {"type": "string"},
                                    "phone": {"type": "string"},
                                    "address_line1": {"type": "string"},
                                    "address_line2": {"type": "string"},
                                    "city": {"type": "string"},
                                    "state": {"type": "string"},
                                    "postal_code": {"type": "string"},
                                    "country": {"type": "string"}
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "User information updated successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "updated"}
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Update failed",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "failed"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/wish-list/add/{user_id}/{product_id}": {
            "post": {
                "tags": ["wishlist"],
                "summary": "Add product to wishlist",
                "description": "Add a product to a user's wishlist",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the user",
                        "schema": {"type": "integer"}
                    },
                    {
                        "name": "product_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the product to add",
                        "schema": {"type": "integer"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Product added to wishlist successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "added"}
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Failed to add product to wishlist",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "failed"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/wish-list/remove/{user_id}/{product_id}": {
            "post": {
                "tags": ["wishlist"],
                "summary": "Remove product from wishlist",
                "description": "Remove a product from a user's wishlist",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the user",
                        "schema": {"type": "integer"}
                    },
                    {
                        "name": "product_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the product to remove",
                        "schema": {"type": "integer"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Product removed from wishlist successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "removed"}
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Failed to remove product from wishlist",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "failed"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/wish-list/user/{user_id}": {
            "get": {
                "tags": ["wishlist"],
                "summary": "Get user's wishlist",
                "description": "Retrieve all products in a user's wishlist",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "ID of the user",
                        "schema": {"type": "integer"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response with wishlist products",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Product"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/products/compare": {
            "post": {
                "tags": ["products"],
                "summary": "Compare products",
                "description": "Compare multiple products using AI analysis",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "type": "array",
                                        "items": {
                                            "type": "integer"
                                        },
                                        "description": "Array of product IDs to compare"
                                    }
                                },
                                "required": ["id"]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Successful comparison",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "success"},
                                        "message": {"type": "string", "description": "Markdown-formatted comparison result"},
                                        "attempt": {"type": "integer"}
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Comparison failed",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string", "example": "failed"},
                                        "message": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "Product": {
                "type": "object",
                "properties": {
                    "product_id": {"type": "integer"},
                    "title": {"type": "string"},
                    "price": {"type": "number"},
                    "image": {"type": "string"},
                    "retailer": {"type": "string"},
                    "product_url": {"type": "string"},
                    "description": {"type": "string"}
                }
            },
            "User": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "integer"},
                    "username": {"type": "string"},
                    "email": {"type": "string"},
                    "first_name": {"type": "string"},
                    "last_name": {"type": "string"},
                    "phone": {"type": "string"},
                    "address_line1": {"type": "string"},
                    "address_line2": {"type": "string"},
                    "city": {"type": "string"},
                    "state": {"type": "string"},
                    "postal_code": {"type": "string"},
                    "country": {"type": "string"}
                }
            }
        }
    }
}

# Write the swagger JSON to a file
def write_swagger_json():
    """Write the swagger template to a static JSON file for the Swagger UI to consume."""
    static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
    os.makedirs(static_dir, exist_ok=True)
    
    swagger_json_path = os.path.join(static_dir, 'swagger.json')
    
    # Convert Python True/False to JSON true/false
    swagger_str = json.dumps(swagger_template, indent=2)
    swagger_str = swagger_str.replace(': True', ': true')
    swagger_str = swagger_str.replace(': False', ': false')
    
    with open(swagger_json_path, 'w') as f:
        f.write(swagger_str)

# Automatically write the swagger.json file when this module is imported
write_swagger_json()
