# chart_api.py


from flask import Blueprint, jsonify, request
from db import cnx

preTraining_api = Blueprint('preTraining_api', __name__)
skillImplementation_api = Blueprint('skillImplementation_api', __name__)
assessment_api = Blueprint('assessment_api', __name__)
income_api = Blueprint('income_api', __name__)

respond_notifications_api = Blueprint('respond_notifications_api', __name__)

get_notifications_api = Blueprint('get_notifications_api', __name__)

# Api for Pre-Training Graph
@preTraining_api.route('/preTraining_data')
def preTraining_data():
    tooltip_data = [
        ["Centre 1", "Pre-Training","Ongoing","18/1/23","19/1/23"],
        ["Centre 2", "Centre 4","Centre 6"],
        ["Centre 4"],
        ["Centre 1", "Centre 6"],
        ["Centre 2", "Centre 2"],
        ["Centre 3", "Centre 6"],
        ["Centre 6", "Centre 1"],
        ["Centre 8", "Centre 1", "Centre 2", "Centre 5"],
    ]
    return jsonify(tooltip_data)

# Api for Skill Implementation Graph
@skillImplementation_api.route('/skillImplementation_Data')
def skillImplementation_Data():
    tooltip_data = [
        ["Centre 1", "Centre 2","Centre 5"],
        ["Centre 2"],
        ["Centre 4", "Centre 6"],
        ["Centre 1", "Centre 6"],
        ["Centre 2", "Centre 4"],
    ]
    return jsonify(tooltip_data)

# Api for Skill Implementation Graph
@assessment_api.route('/assessment_data')
def assessment_data():
    tooltip_data = [
        ["Centre 1", "Centre 2","Centre 5"],
        ["Centre 2", "Centre 4","Centre 6"],
        ["Centre 4", "Centre 6"],
        ["Centre 1", "Centre 6"],
        ["Centre 2", "Centre 4"],
    ]
    return jsonify(tooltip_data)

# Api for Income Generation Graph
@income_api.route('/income_data')
def income_data():
    tooltip_data = [
        ["Centre 1", "Centre 2","Centre 5"],
        ["Centre 2", "Centre 4","Centre 6"],
        ["Centre 4", "Centre 6"],
    ]
    return jsonify(tooltip_data)

# Api for fetching notifications
@get_notifications_api.route('/get_notifications', methods=['POST'])
def get_notifications():
    try:
        # Extract username from the request
        username = request.json.get('username')

        if not username:
            return jsonify({"error": "Username is required."}), 400

        # Create a cursor object
        cursor = cnx.cursor()

        # Get the manager_id using the username
        cursor.execute('''
            SELECT manager_id 
            FROM public."Managers" 
            WHERE username = %s
        ''', (username,))
        
        manager_result = cursor.fetchone()
        
        if not manager_result:
            return jsonify({"error": "Manager not found."}), 404

        manager_id = manager_result[0]

        # Query to get the projects managed by the manager
        cursor.execute('''
            SELECT p.program_id 
            FROM "ManagerPrograms" mp 
            JOIN "Programs" p ON mp.program_id = p.program_id 
            WHERE mp.manager_id = %s
        ''', (manager_id,))
        
        manager_projects = cursor.fetchall()
        manager_project_ids = tuple([row[0] for row in manager_projects])
        
        if not manager_project_ids:
            return jsonify({"notifications": []}), 200

        # Query recent progress updates that haven't been responded to for the manager's projects
        cursor.execute('''
            SELECT progress_id, project_name, progress_status, update_details, date_recorded 
            FROM public."OKR_KPI_Progress" 
            WHERE responded = FALSE 
            AND config_id IN (
                SELECT config_id 
                FROM "OKR_KPI_Config" 
                WHERE okr_id IN (
                    SELECT okr_id 
                    FROM "ProgramOKR_Config" 
                    WHERE program_id IN %s
                )
            ) 
            ORDER BY date_recorded DESC 
            LIMIT 10
        ''', (manager_project_ids,))
        notifications = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Return the notifications
        notifications_list = [
            {
                "progress_id": notification[0],
                "project_name": notification[1],
                "progress_status": notification[2],
                "update_details": notification[3],
                "date_recorded": notification[4].strftime('%Y-%m-%d')
            }
            for notification in notifications
        ]

        return jsonify({"notifications": notifications_list}), 200

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": str(e)}), 500

# Api for marking notifications as responded
@respond_notifications_api.route('/respond_notification', methods=['POST'])
def respond_notification():
    try:
        notification_id = request.json.get('progress_id')

        if not notification_id:
            return jsonify({"error": "Missing required fields."}), 400

        cursor = cnx.cursor()

        # Update the responded status
        cursor.execute(
            '''UPDATE public."OKR_KPI_Progress" 
               SET responded = TRUE 
               WHERE progress_id = %s''',
            (notification_id,)
        )

        # Commit the transaction
        cnx.commit()

        cursor.close()

        # Return success message
        return jsonify({"message": "Notification responded successfully."}), 200

    except Exception as e:
        # Handle other unexpected errors
        return jsonify({"error": str(e)}), 500
