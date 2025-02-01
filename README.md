# ☁️ Weather App

## Overview
The Weather App is a fully responsive web application that provides real-time weather data based on user input. It features a Python-Flask backend and a ReactJS frontend, integrating the OpenWeatherMap API to display temperature, humidity, sunrise/sunset times, and other weather conditions.

## Features
- **Real-time Weather Data:** Fetches and displays current weather conditions using the OpenWeatherMap API.
- **Interactive UI:** Built with ReactJS for a seamless and dynamic user experience.
- **Responsive Design:** Optimized for mobile and desktop devices.
- **Cross-Platform Compatibility:** Extensively tested for functionality on different browsers and devices.

## Technologies Used
- **Backend:** Python, Flask
- **Frontend:** ReactJS
- **API Integration:** OpenWeatherMap API
- **Deployment:** Render

## Installation
### Prerequisites
Ensure you have the following installed:
- Python 3.x
- Node.js and npm
- Flask
- ReactJS

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/ankitrijal2054/weather_app.git
   cd weather-app/backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```

## Usage
1. Enter a city or zip code in the search bar.
2. The app fetches and displays real-time weather data.
3. View details such as temperature, humidity, and sunrise/sunset times.

## Visit the Live App
You can check out the deployed Weather App here:
[Weather App Live](https://weather-app-3jmk.onrender.com/)

## Future Improvements
- **Predict upcoming weather using machine learning** to enhance accuracy and provide advanced forecasting.

## Deployment
- The backend is deployed using **Render**.
- The frontend can be hosted using **GitHub Pages** or **Vercel**.

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any questions or suggestions, feel free to reach out!

- **GitHub:** [ankitrijal2054](https://github.com/ankitrijal2054)
- **Email:** ankitrijal2054@gmail.com
