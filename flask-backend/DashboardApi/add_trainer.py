from flask import Blueprint, jsonify, request
from db import cnx
import psycopg2

add_trainer_api = Blueprint('add_trainer_api', __name__)

@add_trainer_api.route("/add_trainer", methods=['POST'])
def add_trainer():
    try:
        # Get trainer data from request
        trainer_data = request.json
        trainer_name = trainer_data.get('trainer_name')
        trainer_start_date = trainer_data.get('start_date')
        trainer_end_date = trainer_data.get('end_date')

        # Validate input data
        if not trainer_name or not trainer_start_date or not trainer_end_date:
            return jsonify({"error": "Missing required fields."}), 400

        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."}), 500

        # Create a cursor object
        cursor = cnx.cursor()

        # Insert data into the database
        cursor.execute("INSERT INTO public.\"Trainers\" (trainer_name, trainer_start_date, trainer_end_date) VALUES (%s, %s, %s)", (trainer_name, trainer_start_date, trainer_end_date))

        # Commit the transaction
        cnx.commit()

        # Close the cursor
        cursor.close()

        # Return success message
        return jsonify({"message": "trainer added successfully."}), 201

    except psycopg2.IntegrityError as e:
        # Handle database constraint violation errors (e.g., duplicate username)
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        # Handle other unexpected errors
        return jsonify({"error": str(e)}), 500
