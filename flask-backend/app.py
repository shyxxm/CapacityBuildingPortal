from flask import Flask, jsonify
from DashboardApi.chart_api import income_api, preTraining_api, skillImplementation_api, assessment_api
import psycopg2
import time
from DashboardApi.landing_page import view_manager_api, view_trainer_api, view_trainee_api, view_program_count_api, view_program_name_api, view_center_count_api, view_course_count_api
from DashboardApi.project_creation import project_creation_api
from DashboardApi.project_details import project_details_api
from flask_cors import CORS

from DashboardApi.add_manager import add_manager_api
from DashboardApi.add_trainer import add_trainer_api
from DashboardApi.add_trainee import add_trainee_api
from DashboardApi.login import login_api
from DashboardApi.view_managers import view_managers_api,delete_manager_api, edit_manager_api
from DashboardApi.view_trainers import view_trainers_api, delete_trainer_api, edit_trainer_api
from DashboardApi.view_trainees import view_trainees_api, delete_trainee_api, edit_trainee_api, view_programs_courses_api
from DashboardApi.create_project import create_project_api
from DashboardApi.text_analysis import text_analysis_api

from DashboardApi.project_config import view_centers_api, add_center_api, get_program_id_api, edit_center_api, delete_center_api, add_course_api, edit_course_api, delete_course_api, view_courses_api, view_program_details_api,get_max_course_id_api, view_all_courses_api, get_center_id_by_name_api







from db import cnx

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

cnx = None  # Define cnx as a global variable

# Sample Members API
@app.route("/members")
def members():
    print("hello")
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
app.register_blueprint(project_details_api)
app.register_blueprint(delete_manager_api)
app.register_blueprint(edit_manager_api)
app.register_blueprint(delete_trainer_api)
app.register_blueprint(edit_trainer_api)
app.register_blueprint(add_center_api)
app.register_blueprint(view_centers_api)
app.register_blueprint(get_program_id_api)
app.register_blueprint(edit_center_api)
app.register_blueprint(delete_center_api)
app.register_blueprint(view_courses_api)
app.register_blueprint(edit_course_api)
app.register_blueprint(delete_course_api)
app.register_blueprint(add_course_api)
app.register_blueprint(project_creation_api)
app.register_blueprint(view_program_details_api)
app.register_blueprint(get_max_course_id_api)
app.register_blueprint(view_all_courses_api)
app.register_blueprint(get_center_id_by_name_api)
app.register_blueprint(view_center_count_api)
app.register_blueprint(view_course_count_api)
app.register_blueprint(add_trainee_api)

app.register_blueprint(delete_trainee_api)
app.register_blueprint(edit_trainee_api)
app.register_blueprint(view_trainees_api)
app.register_blueprint(view_programs_courses_api)




if __name__ == "__main__":
    app.run(debug=True)
