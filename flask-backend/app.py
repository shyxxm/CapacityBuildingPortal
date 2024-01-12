from flask import Flask
from DashboardApi.chart_api import income_api,preTraining_api,skillImplementation_api,assessment_api

app = Flask(__name__)

# Sample Members API
@app.route("/members")
def members():
    return {"members": ["Member1","Member2","Member3","Member4","Member5"]}

# Chart Data API
app.register_blueprint(income_api)  # Register the Blueprint

app.register_blueprint(preTraining_api)  # Register the Blueprint

app.register_blueprint(skillImplementation_api)  # Register the Blueprint

app.register_blueprint(assessment_api)  # Register the Blueprint


if __name__ == "__main__":
    app.run(debug=True)