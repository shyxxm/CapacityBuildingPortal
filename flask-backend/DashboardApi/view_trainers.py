# view_manager.py

from flask import Blueprint, jsonify
from db import cnx

view_trainers_api = Blueprint('view_trainers_api', __name__)




@view_trainers_api.route("/view_trainers_sort")
def view_trainers_sort():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Select only the required columns: id, first_name, username
        query = 'SELECT trainer_id, trainer_name, trainer_start_date, trainer_end_date FROM public."Trainers"'

        # Execute the query
        cursor.execute(query)

        # Fetch the data from the table
        data = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Return the data as JSON response
        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)})