from flask import Blueprint, jsonify, request
from db import cnx
import psycopg2

add_manager_api = Blueprint('add_manager_api', __name__)

@add_manager_api.route("/add_manager", methods=['POST'])
def add_manager():
    try:
        # Get manager data from request
        manager_data = request.json
        first_name = manager_data.get('first_name')
        username = manager_data.get('username')
        password = manager_data.get('password')

        # Validate input data
        if not first_name or not username or not password:
            return jsonify({"error": "Missing required fields."}), 400

        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."}), 500

        # Create a cursor object
        cursor = cnx.cursor()

        # Insert data into the database
        cursor.execute("INSERT INTO public.\"Managers\" (username, first_name, password) VALUES (%s, %s, %s)", (username, first_name, password))

        # Commit the transaction
        cnx.commit()

        # Close the cursor
        cursor.close()

        # Return success message
        return jsonify({"message": "Manager added successfully."}), 201

    except psycopg2.IntegrityError as e:
        # Handle database constraint violation errors (e.g., duplicate username)
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        # Handle other unexpected errors
        return jsonify({"error": str(e)}), 500
