"""
CREATE TABLE wishlist (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
"""

from app.services.use_db import use_db

def add_to_wishlist(user_id: int, product_id: int):
    query = """
    INSERT INTO wishlist (user_id, product_id)
    VALUES (%s, %s)
    """
    data = (user_id, product_id)
    try:
        use_db(query, data)
        return True
    except Exception as e:
        print(f'Error adding to wishlist user_id={user_id}, product_id={product_id}: {e}')
        return False



def remove_from_wishlist(user_id: int, product_id: int):
    query = """
    DELETE FROM wishlist
    WHERE user_id = %s AND product_id = %s
    """
    data = (user_id, product_id)
    try:
        use_db(query, data)
        return True
    except Exception as e:
        print(f'Error removing from wishlist user_id={user_id}, product_id={product_id}: {e}')
        return False

def retrieve_wishlist(user_id: int):
    query = """
    SELECT product_id
    FROM wishlist
    WHERE user_id = %s
    """
    data = (user_id,)
    try:
        result = use_db(query, data, fetch=True)
        result = [row[0] for row in result]
        return result
    except Exception as e:
        print(f'Error retrieving wishlist for user_id={user_id}: {e}')
        return None