from flask import Flask, request
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from selenium import webdriver
from serpapi import GoogleSearch

app = Flask(__name__)
user_agent = UserAgent(os=['linux', 'macos', 'windows'])

def search_google_products(query):
    params = {
        "engine": "google",
        "q": query,
        "tbm": "shop",  # Google Shopping tab
        "api_key": "dec57482862f68e86b112bf3cce311209b6bb0bf28a2a00f51d9c99d49780a8b"
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    products = []
    for item in results.get("shopping_results", []):
        product = {
            "title": item.get("title"),
            "price": item.get("extracted_price"),
            "image": item.get("thumbnail"),
            "retailer": item.get("source"),
            "product_url": item.get("product_link"),
            "currency": "USD"
        }
        products.append(product)
    return products

def scrape_products(products, num_per_pages=200, start=0):
    query = " ".join(products.split())
    url = f'https://www.google.com/search?q={query}&udm=28&num={num_per_pages}&start={start}'
    return search_google_products(query)
