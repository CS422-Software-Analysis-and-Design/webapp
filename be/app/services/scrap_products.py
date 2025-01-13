from flask import Flask, request
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from selenium import webdriver

app = Flask(__name__)
user_agent = UserAgent(os=['linux', 'macos', 'windows'])

def get_information_from_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')

    products = []
    for item in soup.select('.sh-dgr__grid-result'):
        title = item.select_one('h3.tAxDx').text.strip() if item.select_one('h3.tAxDx') else None
        price = item.select_one('span.a8Pemb.OFFNJ').text.strip() if item.select_one('span.a8Pemb.OFFNJ') else None
        if price:
            # get number only
            price = ''.join([i for i in price if i.isdigit()])
            price = int(price)
        image = item.select_one('div.FM6uVc > div.ArOc1c > img')['src'] if item.select_one('div.FM6uVc > div.ArOc1c > img') else None
        retailer = item.select_one('.aULzUe.IuHnof').text.strip() if item.select_one('.aULzUe.IuHnof') else None
        product_url = 'https://www.google.com' + item.select_one('a.Lq5OHe')['href'] if item.select_one('a.Lq5OHe') else None

        products.append({
            'title': title,
            'price': price,
            'image': image,
            'retailer': retailer,
            'product_url': product_url
        })
    return products
def scrape_google_shopping(url):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run Chrome in headless mode
    options.add_argument('--no-sandbox')  # Disable the sandbox (needed for Docker)
    options.add_argument('--disable-dev-shm-usage')  # Overcome shared memory issues

    driver = webdriver.Chrome(options=options)
    driver.get(url)
    driver.implicitly_wait(0.5)
    html_content = driver.page_source
    driver.quit()
    return get_information_from_html(html_content)

def get_redirect_url(url):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run Chrome in headless mode
    options.add_argument('--no-sandbox')  # Disable the sandbox (needed for Docker)
    options.add_argument('--disable-dev-shm-usage')  # Overcome shared memory issues

    driver = webdriver.Chrome(options=options)
    driver.get(url)
    driver.implicitly_wait(0.5)
    redirect_url = driver.current_url
    driver.quit()
    return redirect_url

def scrape_products(products, num_per_pages=200, start=0):
    query = "+".join(products.split())
    url = f'https://www.google.com/search?q={query}&tbm=shop&num={num_per_pages}&start={start}'
    all_products = scrape_google_shopping(url)
    return all_products
