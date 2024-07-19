from flask import Blueprint, jsonify, request
from db import cnx

login_api = Blueprint('login_api', __name__)

@login_api.route("/login", methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        # Get username and password from request
        login_data = request.json
        username = login_data.get('username')
        password = login_data.get('password')

        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."}), 500

        # Create a cursor object
        cursor = cnx.cursor()

        # Check if the username and password match a record in the Managers table
        cursor.execute('SELECT manager_id, first_name, username FROM public."Managers" WHERE username = %s AND password = %s', (username, password))
        manager = cursor.fetchone()

        # Close the cursor
        cursor.close()

        if manager:
            # If manager is found, extract the necessary information
            manager_id = manager[0]
            first_name = manager[1]
            username = manager[2]

            return jsonify({"message": "Login successful.", "firstName": first_name, "username": username, "managerId": manager_id}), 200
        else:
            # If manager is not found, return error message
            return jsonify({"error": "Invalid username or password."}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
