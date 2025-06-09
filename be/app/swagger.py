"""
Swagger documentation configuration for the API.
"""
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask_swagger_ui import get_swaggerui_blueprint

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
        "/search_products": {
            "get": {
                "tags": ["products"],
                "summary": "Search for products",
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
                "parameters": [
                    {
                        "name": "username",
                        "in": "path",
                        "required": True,
                        "description": "Username for signup",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "email",
                        "in": "path",
                        "required": True,
                        "description": "Email for signup",
                        "schema": {"type": "string"}
                    },
                    {
                        "name": "password",
                        "in": "path",
                        "required": True,
                        "description": "Password for signup",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Signup successful",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string"}
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Signup failed",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "status": {"type": "string"}
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
                "summary": "Search products by keyword with filtering and pagination",
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
                        "description": "Filter parameter",
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
                        "description": "Page number",
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
                "parameters": [
                    {
                        "name": "product_id",
                        "in": "path",
                        "required": True,
                        "description": "Product ID",
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
        "/chatbot/create/{user_id}": {
            "post": {
                "tags": ["chatbot"],
                "summary": "Create a new conversation",
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "User ID",
                        "schema": {"type": "string"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Conversation created successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object"
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
                "parameters": [
                    {
                        "name": "user_id",
                        "in": "path",
                        "required": True,
                        "description": "User ID",
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
        }
    },
    "components": {
        "schemas": {
            "Product": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "price": {"type": "integer"},
                    "image": {"type": "string"},
                    "retailer": {"type": "string"},
                    "product_url": {"type": "string"}
                }
            }
        }
    }
}
