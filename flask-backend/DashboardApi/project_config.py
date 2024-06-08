# view_center.py
from flask import Blueprint, jsonify, request
from db import cnx

view_centers_api = Blueprint('view_centers_api', __name__)
add_center_api = Blueprint('add_center_api', __name__)
get_program_id_api = Blueprint('get_program_id_api', __name__)
edit_center_api = Blueprint('edit_center_api', __name__)
delete_center_api = Blueprint('delete_center_api', __name__)
add_course_api = Blueprint('add_course_api', __name__)
edit_course_api = Blueprint('edit_course_api', __name__)
delete_course_api = Blueprint('delete_course_api', __name__)
view_courses_api = Blueprint('view_courses_api', __name__)
view_program_details_api = Blueprint('view_program_details_api', __name__)
get_max_course_id_api = Blueprint('get_max_course_id_api', __name__)
view_all_courses_api = Blueprint('view_all_courses_api', __name__)
get_center_id_by_name_api = Blueprint('get_center_id_by_name_api', __name__)

@view_centers_api.route('/view_center_data')
def view_center_data():
    try:
        cursor = cnx.cursor()
        program_id = request.args.get('program_id')
        query = 'SELECT center_id, center_name, center_location, center_latitude, center_longitude FROM public."ProgramCenters" WHERE program_id = %s'
        cursor.execute(query, (program_id,))
        data = cursor.fetchall()
        cursor.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})


@add_center_api.route('/add_center', methods=['POST'])
def add_center():
    try:
        data = request.json
        center_name = data['center_name']
        center_location = data['center_location']
        center_latitude = data['center_latitude']
        center_longitude = data['center_longitude']
        program_id = data['program_id']  # Ensure program_id is being fetched correctly

        cursor = cnx.cursor()
        query = '''
            INSERT INTO public."ProgramCenters" (center_name, center_location, center_latitude, center_longitude, program_id)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING center_id
        '''
        cursor.execute(query, (center_name, center_location, center_latitude, center_longitude, program_id))
        new_id = cursor.fetchone()[0]
        cnx.commit()
        cursor.close()

        return jsonify({"center_id": new_id, "center_name": center_name, "center_location": center_location, "center_latitude": center_latitude, "center_longitude": center_longitude, "program_id": program_id})
    except Exception as e:
        return jsonify({"error": str(e)})
    
    # view_centers.py

@get_program_id_api.route('/get_program_id')
def get_program_id():
    try:
        program_name = request.args.get('program_name')
        cursor = cnx.cursor()
        query = 'SELECT program_id FROM public."Programs" WHERE program_name = %s'
        cursor.execute(query, (program_name,))
        program_id = cursor.fetchone()
        cursor.close()

        if program_id:
            return jsonify({"program_id": program_id[0]})
        else:
            return jsonify({"error": "Program not found"})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@edit_center_api.route('/edit_center', methods=['POST'])
def edit_center():
    try:
        data = request.json
        center_id = data['center_id']
        center_name = data['center_name']
        center_location = data['center_location']
        center_latitude = data['center_latitude']
        center_longitude = data['center_longitude']

        cursor = cnx.cursor()
        query = '''
            UPDATE public."ProgramCenters"
            SET center_name = %s, center_location = %s, center_latitude = %s, center_longitude = %s
            WHERE center_id = %s
        '''
        cursor.execute(query, (center_name, center_location, center_latitude, center_longitude, center_id))
        cnx.commit()
        cursor.close()

        return jsonify({"message": "Center updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@delete_center_api.route('/delete_center', methods=['DELETE'])
def delete_center():
    try:
        data = request.json
        center_id = data['center_id']

        cursor = cnx.cursor()
        query = 'DELETE FROM public."ProgramCenters" WHERE center_id = %s'
        cursor.execute(query, (center_id,))
        cnx.commit()
        cursor.close()

        return jsonify({"message": "Center deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@view_courses_api.route('/view_course_data')
def view_course_data():
    try:
        cursor = cnx.cursor()
        program_id = request.args.get('program_id')
        query = '''
            SELECT c.course_id, c.course_name, c.course_capacity, c.course_duration, c.course_aim, 
                   pc.course_start_date, pc.course_end_date, array_agg(cc.center_id)
            FROM public."Courses" c
            JOIN public."ProgramCourses" pc ON c.course_id = pc.course_id
            LEFT JOIN public."CenterCourses" cc ON c.course_id = cc.course_id
            WHERE pc.program_id = %s
            GROUP BY c.course_id, pc.course_start_date, pc.course_end_date
        '''
        cursor.execute(query, (program_id,))
        data = cursor.fetchall()
        cursor.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

@add_course_api.route('/add_course', methods=['POST'])
def add_course():
    try:
        data = request.json
        course_name = data['course_name']
        course_capacity = data['course_capacity']
        course_duration = data['course_duration']
        course_aim = data['course_aim']
        course_start_date = data['course_start_date']
        course_end_date = data['course_end_date']
        center_id = data['center_id']
        program_id = data['program_id']

        if not center_id:
            return jsonify({"error": "center_id cannot be empty"}), 400

        cursor = cnx.cursor()
        
        # Insert into Courses table and get the course_id
        query_course = """
        INSERT INTO public."Courses" (course_name, course_capacity, course_duration, course_aim) 
        VALUES (%s, %s, %s, %s) RETURNING course_id
        """
        cursor.execute(query_course, (course_name, course_capacity, course_duration, course_aim))
        course_id = cursor.fetchone()[0]

        # Insert into ProgramCourses table
        query_program_course = """
        INSERT INTO public."ProgramCourses" (program_id, course_id, course_start_date, course_end_date)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query_program_course, (program_id, course_id, course_start_date, course_end_date))

        # Insert into CenterCourses table
        query_center_course = """
        INSERT INTO public."CenterCourses" (center_id, course_id)
        VALUES (%s, %s)
        """
        cursor.execute(query_center_course, (center_id, course_id))

        cnx.commit()
        cursor.close()

        return jsonify({"message": "Course added successfully", "course_id": course_id})
    except Exception as e:
        cnx.rollback()
        return jsonify({"error": str(e)}), 500

@edit_course_api.route('/edit_course', methods=['POST'])
def edit_course():
    try:
        data = request.json
        course_id = data['course_id']
        course_name = data['course_name']
        print(course_name)
        course_capacity = data['course_capacity']
        course_duration = data['course_duration']
        course_aim = data['course_aim']
        course_start_date = data['course_start_date']
        course_end_date = data['course_end_date']
        center_id = data['center_id']

        cursor = cnx.cursor()
        query_course = '''
            UPDATE public."Courses"
            SET course_name = %s, course_capacity = %s, course_duration = %s, course_aim = %s
            WHERE course_id = %s
        '''
        cursor.execute(query_course, (course_name, course_capacity, course_duration, course_aim, course_id))

        query_program_course = '''
            UPDATE public."ProgramCourses"
            SET course_start_date = %s, course_end_date = %s
            WHERE course_id = %s
        '''
        cursor.execute(query_program_course, (course_start_date, course_end_date, course_id))

        query_center_course = '''
            UPDATE public."CenterCourses"
            SET center_id = %s
            WHERE course_id = %s
        '''
        cursor.execute(query_center_course, (center_id, course_id))

        cnx.commit()
        cursor.close()

        return jsonify({"message": "Course updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})

@delete_course_api.route('/delete_course', methods=['DELETE'])
def delete_course():
    try:
        data = request.json
        course_id = data['course_id']

        cursor = cnx.cursor()

        # Delete from ProgramCourses
        query_program_course = 'DELETE FROM public."ProgramCourses" WHERE course_id = %s'
        cursor.execute(query_program_course, (course_id,))

        # Delete from CenterCourses
        query_center_course = 'DELETE FROM public."CenterCourses" WHERE course_id = %s'
        cursor.execute(query_center_course, (course_id,))

        # Delete from Courses
        query_course = 'DELETE FROM public."Courses" WHERE course_id = %s'
        cursor.execute(query_course, (course_id,))

        cnx.commit()
        cursor.close()

        return jsonify({"message": "Course deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})
    
@view_program_details_api.route('/view_program_details', methods=['GET'])
def view_program_details():
    try:

        cursor = cnx.cursor()
        program_id = request.args.get('program_id', 9)  # Default to program_id 9

        query = '''
            SELECT
                p.program_id,
                p.program_name,
                p.program_desc,
                p.program_start_date,
                p.program_end_date,
                p.program_duration,
                pc.center_id,
                pc.center_name,
                pc.center_location,
                pc.center_latitude,
                pc.center_longitude,
                c.course_id,
                c.course_name,
                c.course_capacity,
                c.course_duration,
                c.course_aim,
                pc2.course_start_date,
                pc2.course_end_date
            FROM
                public."Programs" p
            JOIN
                public."ProgramCenters" pc ON p.program_id = pc.program_id
            JOIN
                public."CenterCourses" cc ON pc.center_id = cc.center_id
            JOIN
                public."Courses" c ON cc.course_id = c.course_id
            JOIN
                public."ProgramCourses" pc2 ON p.program_id = pc2.program_id AND c.course_id = pc2.course_id
            WHERE
                p.program_id = %s;
        '''

        cursor.execute(query, (program_id,))
        data = cursor.fetchall()
        cnx.commit()
        cursor.close()

        program_details = {
            "program_id": data[0][0],
            "program_name": data[0][1],
            "program_desc": data[0][2],
            "program_start_date": data[0][3],
            "program_end_date": data[0][4],
            "program_duration": data[0][5],
            "centers": []
        }

        centers = {}
        for row in data:
            center_id = row[6]
            if center_id not in centers:
                centers[center_id] = {
                    "center_id": row[6],
                    "center_name": row[7],
                    "center_location": row[8],
                    "center_latitude": row[9],
                    "center_longitude": row[10],
                    "courses": []
                }

            course = {
                "course_id": row[11],
                "course_name": row[12],
                "course_capacity": row[13],
                "course_duration": row[14],
                "course_aim": row[15],
                "course_start_date": row[16],
                "course_end_date": row[17]
            }
            centers[center_id]["courses"].append(course)

        program_details["centers"] = list(centers.values())

        return jsonify(program_details)
    except Exception as e:
        return jsonify({"error": str(e)})
    
@get_max_course_id_api.route('/get_max_course_id', methods=['GET'])
def get_max_course_id():
    try:
        cursor = cnx.cursor()
        query = 'SELECT MAX(course_id) FROM public."Courses"'
        cursor.execute(query)
        max_course_id = cursor.fetchone()[0] or 0
        cursor.close()
        return jsonify({"max_course_id": max_course_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@view_all_courses_api.route('/view_all_courses', methods=['GET'])
def view_all_courses():
    try:
        cursor = cnx.cursor()
        query = 'SELECT * FROM public."Courses"'
        cursor.execute(query)
        courses = cursor.fetchall()
        cursor.close()
        return jsonify(courses)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@get_center_id_by_name_api.route('/get_center_id_by_name', methods=['GET'])
def get_center_id_by_name():
    center_name = request.args.get('center_name')
    try:
        cursor = cnx.cursor()
        query = 'SELECT center_id FROM public."ProgramCenters" WHERE center_name = %s'
        cursor.execute(query, (center_name,))
        result = cursor.fetchone()
        cursor.close()
        if result:
            return jsonify({"center_id": result[0]})
        else:
            return jsonify({"error": "Center not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500