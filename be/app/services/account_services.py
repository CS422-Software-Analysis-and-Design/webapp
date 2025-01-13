from app.services.use_db import use_db
from hashlib import sha256

"""
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

def check_user(username: str):
    try:
        query = """
        SELECT username
        FROM users
        WHERE username = %s;
        """
        result = use_db(query, (username,), fetch=True)
        if result and len(result) > 0:
            return True
        return False
    except Exception as e:
        print(f'Error in check_user: {str(e)}')
        return False

def check_user_password(username: str, password: str):
    query = """
    SELECT password_hash
    FROM users
    WHERE username = %s;
    """
    result = use_db(query, (username,), fetch=True)
    if result:
        return result[0][0] == password
    return False
def login(username: str, hashing_password: str):
    if check_user_password(username, hashing_password):
        return "cookies"
    return None

def sign_up(username: str, password: str, email: str):
    if len(username) == 0 or len(password) == 0:
        return "Username and password must not be empty"
    if len(email) == 0:
        return "Email must not be empty"
    # hash_password = hashing_password(password)
    if check_user(username):
        return "Username already exists"
    query = """
    INSERT INTO users (username, password_hash, email)
    VALUES (%s, %s, %s);
    """
    try:
        use_db(query, (username, password, email))
        return "Success"
    except Exception as e:
        return str(e)

def user_id_from_username(username: str):
    return get_user_info(username)['user_id']

def get_user_info(username: str):
    query = """
    SELECT *
    FROM users
    WHERE username = %s;
    """
    data = (username,)
    result = use_db(query, data, fetch=True)
    if result:
        user_id = result[0][0]
        username = result[0][1]
        first_name = result[0][2]
        last_name = result[0][3]
        email = result[0][4]
        phone = result[0][6]
        address_line1 = result[0][7]
        address_line2 = result[0][8]
        city = result[0][9]
        state = result[0][10]
        postal_code = result[0][11]
        country = result[0][12]
        created_at = result[0][13]
        updated_at = result[0][14]
        return {
            'user_id': user_id,
            'username': username,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'phone': phone,
            'address_line1': address_line1,
            'address_line2': address_line2,
            'city': city,
            'state': state,
            'postal_code': postal_code,
            'country': country,
            'created_at': created_at,
            'updated_at': updated_at
        }
    return None

def update_user_information(user_id, first_name, last_name, email, phone, address_line1, address_line2, city, state, postal_code, country):
    query = """
    UPDATE users
    SET first_name = %s, last_name = %s, email = %s, phone = %s, address_line1 = %s, address_line2 = %s, city = %s, state = %s, postal_code = %s, country = %s, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = %s;
    """
    data = (first_name, last_name, email, phone, address_line1, address_line2, city, state, postal_code, country, user_id)
    try:
        use_db(query, data)
        return "Success"
    except Exception as e:
        return str(e)

def change_password(username, old_password, new_password):
    if check_user_password(username, old_password):
        query = """
        UPDATE users
        SET password_hash = %s, updated_at = CURRENT_TIMESTAMP
        WHERE username = %s;
        """
        data = (new_password, username)
        try:
            use_db(query, data)
            return "Success"
        except Exception as e:
            return str(e)
    return "Invalid password"