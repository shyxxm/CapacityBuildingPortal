# Project Creation feature

from flask import Blueprint, jsonify
from db import cnx

project_creation_api = Blueprint('project_creation_api', __name__)

@project_creation_api.route("/view_managers")
def view_managers():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Check if the table exists
        cursor.execute('SELECT first_name FROM public."Managers"')

        # Fetch the data from the table
        data = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Return the data as JSON response
        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)})