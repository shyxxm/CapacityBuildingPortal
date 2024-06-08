# view_manager.py

from flask import Blueprint, jsonify, request
from db import cnx

view_managers_api = Blueprint('view_managers_api', __name__)
delete_manager_api = Blueprint('delete_manager_api', __name__)
edit_manager_api = Blueprint('edit_manager_api', __name__)

@view_managers_api.route("/view_managers_sort")
def view_managers_sort():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Select only the required columns: id, first_name, username
        query = 'SELECT manager_id, first_name, username FROM public."Managers"'

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

@delete_manager_api.route("/delete_manager", methods=['DELETE'])
def delete_manager():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Get the manager_id from the request body
        manager_id = request.json.get('manager_id')
        print(f"Received manager_id: {manager_id}")

        # Check if manager_id is provided
        if not manager_id:
            return jsonify({"error": "Manager ID is required."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Check if the manager_id exists in the database
        check_query = 'SELECT manager_id FROM public."Managers" WHERE manager_id = %s'
        cursor.execute(check_query, (manager_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            return jsonify({"error": "Manager ID not found."})

        # Delete the manager from the table
        delete_query = 'DELETE FROM public."Managers" WHERE manager_id = %s'
        cursor.execute(delete_query, (manager_id,))
        print(f"Rows affected: {cursor.rowcount}")

        # Commit the transaction
        cnx.commit()

        # Close the cursor
        cursor.close()

        # Return a success response
        return jsonify({"message": "Manager deleted successfully."})

    except Exception as e:
        return jsonify({"error": str(e)})

@edit_manager_api.route("/edit_manager", methods=['PUT'])
def edit_manager():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        # Get the manager details from the request body
        manager_id = request.json.get('manager_id')
        first_name = request.json.get('manager_name')
        username = request.json.get('manager_username')

        # Check if all required fields are provided
        if not manager_id or not first_name or not username:
            return jsonify({"error": "Manager ID, first name, and username are required."})

        # Create a cursor object
        cursor = cnx.cursor()

        # Check if the manager_id exists in the database
        check_query = 'SELECT manager_id FROM public."Managers" WHERE manager_id = %s'
        cursor.execute(check_query, (manager_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            return jsonify({"error": "Manager ID not found."})

        # Update the manager details
        update_query = '''
            UPDATE public."Managers"
            SET first_name = %s, username = %s
            WHERE manager_id = %s
        '''
        cursor.execute(update_query, (first_name, username, manager_id))
        print(f"Rows affected: {cursor.rowcount}")

        # Commit the transaction
        cnx.commit()

        # Close the cursor
        cursor.close()

        # Return a success response
        return jsonify({"message": "Manager updated successfully."})

    except Exception as e:
        return jsonify({"error": str(e)})
