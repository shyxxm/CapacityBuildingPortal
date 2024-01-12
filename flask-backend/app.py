from flask import Flask
from DashboardApi.chart_api import chart_api

app = Flask(__name__)

# Sample Members API
@app.route("/members")
def members():
    return {"members": ["Member1","Member2","Member3","Member4","Member5"]}

# Chart Data API
app.register_blueprint(chart_api)  # Register the Blueprint

if __name__ == "__main__":
    app.run(debug=True)