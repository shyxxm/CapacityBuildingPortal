from flask import Blueprint, jsonify, request
from db import cnx
import psycopg2

get_project_updates_api = Blueprint('get_project_updates_api', __name__)

@get_project_updates_api.route("/get_project_updates", methods=["POST"])
def get_project_updates():
    try:
        # Get the username from the request
        username = request.json.get('username')
        if not username:
            return jsonify({"error": "Username is required."}), 400

        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."}), 500

        # Create a cursor object
        cursor = cnx.cursor()

        # Query to get the manager_id using the username
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
            return jsonify({"updates": []}), 200

        # Query to fetch project updates for the projects managed by the manager
        query = '''
            SELECT okr_kpi_progress.progress_id, okr_kpi_progress.project_name, okr_kpi_progress.progress_status, okr_kpi_progress.update_details, okr_kpi_progress.date_recorded, okr_kpi_progress.responded, okr_kpi_progress.reported_by, okr.okr_name, kpi.kpi_name
            FROM public."OKR_KPI_Progress" AS okr_kpi_progress
            JOIN public."OKR_KPI_Config" AS okr_kpi_config ON okr_kpi_progress.config_id = okr_kpi_config.config_id
            JOIN public."ProgramOKR_Config" AS prog_okr ON okr_kpi_config.okr_id = prog_okr.okr_id
            JOIN public."OKR_MasterList" AS okr ON okr_kpi_config.okr_id = okr.okr_id
            JOIN public."KPI_MasterList" AS kpi ON okr_kpi_config.kpi_id = kpi.kpi_id
            WHERE prog_okr.program_id IN %s
        '''

        cursor.execute(query, (manager_project_ids,))
        project_updates = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Format the result as a list of dictionaries
        updates = []
        for update in project_updates:
            try:
                date_recorded = update[4].strftime('%Y-%m-%d') if update[4] else None
            except AttributeError:
                date_recorded = None

            updates.append({
                "id": update[0],  # Use progress_id as unique id
                "project_name": update[1],
                "progress_status": update[2],
                "update_details": update[3],
                "date_recorded": date_recorded,
                "responded": "Yes" if update[5] else "No",
                "reported_by": update[6],
                "okr_name": update[7],
                "kpi_name": update[8]
            })

        # Return the project updates as a JSON response
        return jsonify({"updates": updates}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500