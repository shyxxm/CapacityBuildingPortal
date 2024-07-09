from flask import Blueprint, jsonify, request
from db import cnx

view_trainees_api = Blueprint('view_trainees_api', __name__)
delete_trainee_api = Blueprint('delete_trainee_api', __name__)
edit_trainee_api = Blueprint('edit_trainee_api', __name__)
view_programs_courses_api = Blueprint('view_programs_courses_api', __name__)

@view_trainees_api.route("/view_trainees_sort")
def view_trainees_sort():
    try:
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        cursor = cnx.cursor()
        query = '''
            SELECT T.trainee_id, T.trainee_name, T.trainee_join_date, T.trainee_employment,
                   P.program_name, C.course_name, PT.program_id, PT.course_id
            FROM public."Trainee" T
            LEFT JOIN public."ProgramTrainees" PT ON T.trainee_id = PT.trainee_id
            LEFT JOIN public."Programs" P ON PT.program_id = P.program_id
            LEFT JOIN public."Courses" C ON PT.course_id = C.course_id
        '''
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()

        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)})

@delete_trainee_api.route("/delete_trainee", methods=['DELETE'])
def delete_trainee():
    try:
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        trainee_id = request.json.get('trainee_id')
        print(f"Received trainee_id: {trainee_id}")

        if not trainee_id:
            return jsonify({"error": "trainee ID is required."})

        cursor = cnx.cursor()

        check_query = 'SELECT trainee_id FROM public."Trainee" WHERE trainee_id = %s'
        cursor.execute(check_query, (trainee_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            return jsonify({"error": "trainee ID not found."})

        delete_query = 'DELETE FROM public."Trainee" WHERE trainee_id = %s'
        cursor.execute(delete_query, (trainee_id,))
        print(f"Rows affected: {cursor.rowcount}")

        cnx.commit()
        cursor.close()

        return jsonify({"message": "trainee deleted successfully."})

    except Exception as e:
        return jsonify({"error": str(e)})

@edit_trainee_api.route("/edit_trainee", methods=['PUT'])
def edit_trainee():
    try:
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        trainee_id = request.json.get('trainee_id')
        trainee_name = request.json.get('trainee_name')
        trainee_join_date = request.json.get('trainee_join_date')
        trainee_employment = request.json.get('trainee_employment')
        program_id = request.json.get('program_id')
        course_id = request.json.get('course_id')

        if not trainee_id:
            return jsonify({"error": "Trainee ID is required."})
        if not trainee_name or not trainee_join_date or not trainee_employment:
            return jsonify({"error": "All fields (name, join date, employment) are required."})

        cursor = cnx.cursor()

        # Check if the trainee exists
        check_query = 'SELECT trainee_id FROM public."Trainee" WHERE trainee_id = %s'
        cursor.execute(check_query, (trainee_id,))
        result = cursor.fetchone()
        if not result:
            cursor.close()
            return jsonify({"error": "Trainee ID not found."})

        # Update the trainee details
        update_query = '''
            UPDATE public."Trainee"
            SET trainee_name = %s, trainee_join_date = %s, trainee_employment = %s
            WHERE trainee_id = %s
        '''
        cursor.execute(update_query, (trainee_name, trainee_join_date, trainee_employment, trainee_id))

        # Update the program and course in ProgramTrainees
        update_program_query = '''
            INSERT INTO public."ProgramTrainees" (trainee_id, program_id, course_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (trainee_id) 
            DO UPDATE SET program_id = EXCLUDED.program_id, course_id = EXCLUDED.course_id
        '''
        cursor.execute(update_program_query, (trainee_id, program_id, course_id))

        cnx.commit()
        cursor.close()

        print(f"Updated trainee_id: {trainee_id} with program_id: {program_id} and course_id: {course_id}")

        return jsonify({"message": "Trainee updated successfully."})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)})
    
@view_programs_courses_api.route("/view_programs_courses", methods=['GET'])
def view_programs_courses():
    try:
        if cnx is None:
            return jsonify({"error": "Database connection is not established."})

        cursor = cnx.cursor()
        query = '''
        SELECT 
            P.program_id, 
            P.program_name, 
            C.course_id, 
            C.course_name
        FROM 
            public."ProgramCourses" PC
        JOIN 
            public."Programs" P ON PC.program_id = P.program_id
        JOIN 
            public."Courses" C ON PC.course_id = C.course_id
        '''
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()

        programs_courses = {}
        for row in data:
            program_id = row[0]
            program_name = row[1]
            course_id = row[2]
            course_name = row[3]

            if program_id not in programs_courses:
                programs_courses[program_id] = {
                    "program_name": program_name,
                    "courses": []
                }

            programs_courses[program_id]["courses"].append({
                "course_id": course_id,
                "course_name": course_name
            })

        return jsonify({"programs_courses": programs_courses})

    except Exception as e:
        return jsonify({"error": str(e)})

