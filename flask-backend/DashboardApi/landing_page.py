# landing_page.py

from flask import Blueprint, jsonify
from db import cnx

view_manager_api = Blueprint('view_manager_api', __name__)
view_trainer_api = Blueprint('view_trainer_api', __name__)
view_trainee_api = Blueprint('view_trainee_api', __name__)



@view_manager_api.route("/view_manager_data")
def view_manager_data():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Check if the table exists
        cursor.execute('SELECT COUNT(*) FROM public."Managers"')

        # Fetch the data from the table
        data = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Return the data as JSON response
        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)})

@view_trainer_api.route("/view_trainer_data")
def view_trainer_data():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Check if the table exists
        cursor.execute('SELECT COUNT(*) FROM public."Trainers"')

        # Fetch the data from the table
        data = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Return the data as JSON response
        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)})
    
@view_trainee_api.route("/view_trainee_data")
def view_trainee_data():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Check if the table exists
        cursor.execute('SELECT COUNT(*) FROM public."Trainees"')

        # Fetch the data from the table
        data = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Return the data as JSON response
        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)})