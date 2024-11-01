from flask import Flask, request, jsonify
import requests

app = Flask(__name__)
WEATHER_API_KEY = 'your_openweathermap_api_key'  # Replace with your API key

@app.route('/weather', methods=['GET'])
def get_weather():
    zip_code = request.args.get('zip')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if zip_code:
        url = f"http://api.openweathermap.org/data/2.5/weather?zip={zip_code}&appid={WEATHER_API_KEY}&units=imperial"
    elif lat and lon:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=imperial"
    else:
        return jsonify({"error": "Provide a zip code or coordinates"}), 400

    response = requests.get(url)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
