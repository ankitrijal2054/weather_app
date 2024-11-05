import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Set API key for OpenWeather
WEATHER_API_KEY = os.environ.get('WEATHER_API_KEY')

@app.route('/')
def home():
    return "Weather API is live!"

@app.route('/weather', methods=['GET'])
def get_weather():
    zip_code = request.args.get('zip')

    if not WEATHER_API_KEY:
        return jsonify({"error": "API key not set"}), 500
    
    if not zip_code:
        return jsonify({"error": "Provide a zip code"}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?zip={zip_code}&appid={WEATHER_API_KEY}&units=imperial"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-zipcode", methods=["POST"])
def get_zipcode():
    data = request.json
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    try:
        # Fetch the postal code using BigDataCloud API
        response = requests.get(
            "https://api.bigdatacloud.net/data/reverse-geocode-client",
            params={
                "latitude": latitude,
                "longitude": longitude,
                "localityLanguage": "en"
            }
        )
        response.raise_for_status()
        location_data = response.json()
        
        # Extract the postcode or handle the case where it might be absent
        location_zip = location_data.get("postcode")
        
        if not location_zip:
            return jsonify({"error": "Unable to retrieve zip code for the provided location"}), 404

        return jsonify({"zipcode": location_zip})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_location_data', methods=['GET'])
def get_location_data_api():
    zip_code = request.args.get('zip')
    if not zip_code:
        return jsonify({"error": "ZIP code is required"}), 400

    try:
        response = requests.get(f"http://api.zippopotam.us/us/{zip_code}")
        response.raise_for_status()
        data = response.json()
        
        location_data = {
            "city": data["places"][0]["place name"],
            "state": data["places"][0]["state"],
            "country": data["country"]
        }
        return jsonify(location_data)

    except requests.exceptions.RequestException:
        return jsonify({"error": "Please enter a valid ZIP code"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
