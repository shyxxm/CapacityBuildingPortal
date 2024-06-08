from flask import Blueprint, jsonify, request
from db import cnx

view_trainers_api = Blueprint('view_trainers_api', __name__)
delete_trainer_api = Blueprint('delete_trainer_api', __name__)
edit_trainer_api = Blueprint('edit_trainer_api', __name__)

@view_trainers_api.route("/view_trainers_sort")
def view_trainers_sort():
    try:
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        cursor = cnx.cursor()
        query = 'SELECT trainer_id, trainer_name, trainer_start_date, trainer_end_date FROM public."Trainers"'
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()

        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)})

@delete_trainer_api.route("/delete_trainer", methods=['DELETE'])
def delete_trainer():
    try:
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        trainer_id = request.json.get('trainer_id')
        print(f"Received trainer_id: {trainer_id}")

        if not trainer_id:
            return jsonify({"error": "Trainer ID is required."})

        cursor = cnx.cursor()

        check_query = 'SELECT trainer_id FROM public."Trainers" WHERE trainer_id = %s'
        cursor.execute(check_query, (trainer_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            return jsonify({"error": "Trainer ID not found."})

        delete_query = 'DELETE FROM public."Trainers" WHERE trainer_id = %s'
        cursor.execute(delete_query, (trainer_id,))
        print(f"Rows affected: {cursor.rowcount}")

        cnx.commit()
        cursor.close()

        return jsonify({"message": "Trainer deleted successfully."})

    except Exception as e:
        return jsonify({"error": str(e)})

@edit_trainer_api.route("/edit_trainer", methods=['PUT'])
def edit_trainer():
    try:
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        trainer_id = request.json.get('trainer_id')
        trainer_name = request.json.get('trainer_name')
        trainer_start_date = request.json.get('trainer_start_date')
        trainer_end_date = request.json.get('trainer_end_date')

        if not trainer_id:
            return jsonify({"error": "Trainer ID is required."})
        if not trainer_name or not trainer_start_date or not trainer_end_date:
            return jsonify({"error": "All fields (name, start date, end date) are required."})

        cursor = cnx.cursor()

        check_query = 'SELECT trainer_id FROM public."Trainers" WHERE trainer_id = %s'
        cursor.execute(check_query, (trainer_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            return jsonify({"error": "Trainer ID not found."})

        update_query = '''
            UPDATE public."Trainers"
            SET trainer_name = %s, trainer_start_date = %s, trainer_end_date = %s
            WHERE trainer_id = %s
        '''
        cursor.execute(update_query, (trainer_name, trainer_start_date, trainer_end_date, trainer_id))
        print(f"Rows affected: {cursor.rowcount}")

        cnx.commit()
        cursor.close()

        return jsonify({"message": "Trainer updated successfully."})

    except Exception as e:
        return jsonify({"error": str(e)})
