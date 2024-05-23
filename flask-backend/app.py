from flask import Flask, jsonify
from DashboardApi.chart_api import income_api, preTraining_api, skillImplementation_api, assessment_api
import psycopg2
import time
from DashboardApi.landing_page import view_manager_api, view_trainer_api, view_trainee_api, view_program_count_api, view_program_name_api
from DashboardApi.project_creation import project_creation_api
from DashboardApi.add_manager import add_manager_api
from DashboardApi.add_trainer import add_trainer_api
from DashboardApi.login import login_api
from DashboardApi.view_managers import view_managers_api
from DashboardApi.view_trainers import view_trainers_api
from DashboardApi.create_project import create_project_api
from DashboardApi.text_analysis import text_analysis_api





from db import cnx

app = Flask(__name__)
cnx = None  # Define cnx as a global variable

# Sample Members API
@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3", "Member4"]}

@app.route("/tables")
def view_tables():
    global cnx  # Access the global cnx variable
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Check if the table exists
        cursor.execute('SELECT * FROM public."Managers"')

        # Fetch the data from the table
        data = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Return the data as JSON response
        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)})

# Chart Data API
app.register_blueprint(income_api)  # Register the Blueprint
app.register_blueprint(preTraining_api)  # Register the Blueprint
app.register_blueprint(skillImplementation_api)  # Register the Blueprint
app.register_blueprint(assessment_api)  # Register the Blueprint
# Register blueprint for landing page
app.register_blueprint(view_program_name_api)
app.register_blueprint(view_manager_api)
app.register_blueprint(view_trainer_api)
app.register_blueprint(view_trainee_api)
app.register_blueprint(view_program_count_api)
app.register_blueprint(add_manager_api)
app.register_blueprint(add_trainer_api)
app.register_blueprint(login_api)
app.register_blueprint(view_managers_api)
app.register_blueprint(view_trainers_api)
app.register_blueprint(create_project_api)
app.register_blueprint(text_analysis_api)








if __name__ == "__main__":
    app.run(debug=True)
