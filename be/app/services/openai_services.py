from app.services.use_db import use_db
from app.settings import Config
from openai import OpenAI
import datetime
import json

"""
CREATE TABLE conversations (
    user_id VARCHAR(255) NOT NULL,
    conversation_id UUID NOT NULL DEFAULT gen_random_uuid(),
    conversation_content JSONB NOT NULL,  -- Stores conversation as a JSON array or object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id)
);
"""

print(f'OpenAI API key: {Config.OPENAI_API_KEY}')
print(f'{Config.__dict__}')
client = OpenAI(
    api_key=Config.OPENAI_API_KEY
)


def update_conversation(conversation_id, role, message):
    updated_at = datetime.datetime.now()

    new_message_json = {
        'role': role,
        'content': message
    }

    query = """
    UPDATE conversations
    SET conversation_content = conversation_content || %s, updated_at = %s
    WHERE conversation_id = %s;
    """

    use_db(query, (json.dumps(new_message_json), updated_at, conversation_id))

def create_conversation(user_id, system_prompt=Config.ASSISTANT_PROMPT):
    """Creates a new conversation and returns the conversation_id."""
    query = """
    INSERT INTO conversations (user_id, conversation_content, created_at)
    VALUES (%s, %s, NOW()) RETURNING conversation_id;
    """
    data = (user_id, json.dumps([{
        'role': 'system',
        'content': system_prompt
    }]))
    
    try:
        result = use_db(query, data, fetch=True, commit_when_fetching=True)  # fetch=True because we want the conversation_id
        if result:
            print(f"Conversation created with ID: {result[0][0]}")
            return result[0][0]
        else:
            print("Insert operation failed: No result returned.")
            return None
    except Exception as e:
        print(f"Error creating conversation: {e}")
        return None

def get_conversation_content(conversation_id):
    query = """
    SELECT conversation_content
    FROM conversations
    WHERE conversation_id = %s;
    """
    data = (conversation_id, )
    result = use_db(query, data, fetch=True)
    return result[0][0]

def get_user_conversations(user_id):
    query = """
    SELECT conversation_id
    FROM conversations
    WHERE user_id = %s;
    """
    results = use_db(query, (user_id,), fetch=True)
    results = [result[0] for result in results]
    return results

def answer_user_message(conversation_id, message):
    """Sends a user message to the chatbot and returns the chatbot's response."""
    update_conversation(conversation_id, 'user', message)
    conversation_content = get_conversation_content(conversation_id)
    print(f'Conversation content: {conversation_content}')
    print(f'Conversation content type: {type(conversation_content)}')
    response = client.chat.completions.create(
        model=Config.ASSISTANT_MODEL,
        messages=conversation_content,
    )

    response_text = response.choices[0].message.content
    update_conversation(conversation_id, 'system', response_text)
    print(f'Response: {response_text}')
    return response_text

def compare_products(products):
    # product_1_name = product_1['name']
    # product_1_retailer = product_1['retailer']
    # product_2_name = product_2['name']
    # product_2_retailer = product_2['retailer']
    # user_content = f"Compare {product_1_name} from {product_1_retailer} and {product_2_name} from {product_2_retailer}. Response as markdown."
    product_name_retailer = [f'{product["name"]} from {product["retailer"]}' for product in products]
    product_name_retailer = ', '.join(product_name_retailer)
    user_content = f'Compare {product_name_retailer}. Response as markdown.'


    response = client.chat.completions.create(
        model=Config.ASSISTANT_MODEL,
        messages=[{
            'role': 'system',
            'content': Config.ASSISTANT_PROMPT
        }, {
            'role': 'user',
            'content': user_content
        }],
    )

    response_text = response.choices[0].message.content

    print(f'Response to the comparison between {product_name_retailer}: {response_text}')

    return response_text

