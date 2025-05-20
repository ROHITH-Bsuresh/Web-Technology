import requests
import random
import time

WRITE_API_KEY = "YOUR_WRITE_API_KEY"
URL = f"https://api.thingspeak.com/update?api_key={WRITE_API_KEY}"

while True:
    temperature = round(random.uniform(20.0, 35.0), 2)
    humidity = round(random.uniform(40.0, 90.0), 2)

    response = requests.get(URL + f"&field1={temperature}&field2={humidity}")
    print(f"Sent -> Temperature: {temperature} C, Humidity: {humidity} %, Response: {response.status_code}")
    
    time.sleep(15)  # ThingSpeak allows updates every 15 seconds
