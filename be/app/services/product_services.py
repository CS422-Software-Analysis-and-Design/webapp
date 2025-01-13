from app.services.use_db import use_db
from app.services.scrap_products import scrape_products

"""
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_url TEXT UNIQUE NOT NULL,
    retailer VARCHAR(255) NOT NULL
);
"""

def check_product_exists(name, retailer):
    query = """
    SELECT product_id
    FROM products
    WHERE name = %s AND retailer = %s;
    """
    data = (name, retailer)
    result = use_db(query, data, fetch=True)
    return result and len(result) > 0

def check_product_id_exists(product_id):
    query = """
    SELECT product_id
    FROM products
    WHERE product_id = %s;
    """
    result = use_db(query, (product_id,), fetch=True)
    return result and len(result) > 0

def get_product_id(name:str, retailer:str):
    query = """
    SELECT product_id
    FROM products
    WHERE name = %s AND retailer = %s;
    """
    data = (name, retailer)
    result = use_db(query, data, fetch=True)
    return result[0][0] if result else None

def insert_or_update_product(name: str, price: int, product_url: str, retailer: str, image_url: str):
    if check_product_exists(name, retailer):
        print(f'Product {name} from {retailer} already exists. Updating price and product_url.')
        query = """
        UPDATE products
        SET price = %s, product_url = %s, image_url = %s, updated_at = NOW()
        WHERE name = %s AND retailer = %s
        """
        data = (price, product_url, image_url, name, retailer)
        use_db(query, data)
    else:
        query = """
        INSERT INTO products (name, price, product_url, retailer, image_url)
        VALUES (%s, %s, %s, %s, %s);
        """
        use_db(query, (name, price, product_url, retailer, image_url))
    product_id = get_product_id(name, retailer)
    return product_id

def search_products_with_keyword(key: str, num_per_pages=200, start=0):
    products = scrape_products(key, num_per_pages, start)
    for product in products:
        product_id = insert_or_update_product(product['title'], product['price'], product['product_url'], product['retailer'], product['image'])
        product['product_id'] = product_id
        # rename title to name
        product['name'] = product.pop('title')
        product['image_url'] = product.pop('image')
    return products


def search_product_with_product_id(product_id):
    query = """
    SELECT name, price, product_url, retailer, image_url
    FROM products
    WHERE product_id = %s;
    """
    result = use_db(query, (product_id,), fetch=True)
    if result:
        return {
            'product_id': product_id,
            'name': result[0][0],
            'price': float(result[0][1]),
            'product_url': result[0][2],
            'retailer': result[0][3],
            'image_url': result[0][4]
        }
    return None

def get_lastest_products(top_k):
    query = """
    SELECT product_id, name, price, product_url, retailer, image_url
    FROM products
    ORDER BY created_at DESC
    LIMIT %s;
    """
    data = (top_k,)
    results = use_db(query, data, fetch=True)
    return [{
        'product_id': result[0],
        'name': result[1],
        'price': float(result[2]),
        'product_url': result[3],
        'retailer': result[4],
        'image_url': result[5]
    } for result in results]

def get_recent_products(top_k):
    query = """
    SELECT product_id, name, price, product_url, retailer, image_url
    FROM products
    ORDER BY updated_at DESC
    LIMIT %s;
    """
    data = (top_k,)
    results = use_db(query, data, fetch=True)
    return [{
        'product_id': result[0],
        'name': result[1],
        'price': float(result[2]),
        'product_url': result[3],
        'retailer': result[4],
        'image_url': result[5]
    } for result in results]

"""
CREATE TABLE product_views (
    view_id SERIAL PRIMARY KEY,
    user_id INT NULL,
    product_id INT NOT NULL,
    view_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(100),
    user_agent VARCHAR(255),
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
"""

def view_product(product_id, user_id):
    query = """
    INSERT INTO product_views (user_id, product_id)
    VALUES (%s, %s);
    """
    data = (user_id, product_id)
    use_db(query, data)

def get_top_viewed_products(top_k):
    query = """
    SELECT product_id, COUNT(product_id) AS view_count
    FROM product_views
    GROUP BY product_id
    ORDER BY view_count DESC
    LIMIT %s;
    """
    data = (top_k,)
    results = use_db(query, data, fetch=True)
    return [search_product_with_product_id(result[0]) for result in results]

def get_trending_view_products(top_k):
    query = """
    SELECT product_id, COUNT(product_id) AS view_count
    FROM product_views
    WHERE view_date > NOW() - INTERVAL '7 days'
    GROUP BY product_id
    ORDER BY view_count DESC
    LIMIT %s;
    """
    data = (top_k,)
    results = use_db(query, data, fetch=True)
    return [search_product_with_product_id(result[0]) for result in results]