from flask import Blueprint, jsonify, request
from db import cnx
import psycopg2

add_trainee_api = Blueprint('add_trainee_api', __name__)

@add_trainee_api.route("/add_trainee", methods=['POST'])
def add_trainee():
    try:
        # Get trainee data from request
        trainee_data = request.json
        trainee_name = trainee_data.get('trainee_name')
        trainee_join_date = trainee_data.get('join_date')
        trainee_employment = trainee_data.get('trainee_employment')  # Corrected this line

        # Validate input data
        if not trainee_name or not trainee_join_date or not trainee_employment:
            return jsonify({"error": "Missing required fields."}), 400

        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."}), 500

        # Create a cursor object
        cursor = cnx.cursor()

        # Insert data into the database
        cursor.execute("INSERT INTO public.\"Trainee\" (trainee_name, trainee_join_date, trainee_employment) VALUES (%s, %s, %s)", (trainee_name, trainee_join_date, trainee_employment))

        # Commit the transaction
        cnx.commit()

        # Close the cursor
        cursor.close()

        # Return success message
        return jsonify({"message": "Trainee added successfully."}), 201

    except psycopg2.IntegrityError as e:
        # Handle database constraint violation errors (e.g., duplicate username)
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        # Handle other unexpected errors
        return jsonify({"error": str(e)}), 500
