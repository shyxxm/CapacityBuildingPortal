# Project Creation feature

from flask import Blueprint, jsonify, request
from db import cnx
import psycopg2

project_details_api = Blueprint('project_details_api', __name__)
project_notifications_api = Blueprint('project_notifications_api', __name__)

@project_details_api.route("/view_okrs", methods=["POST"])
def view_okrs():
    try:
        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."}), 500

        selected_program_name = request.json.get("programName")
        print(selected_program_name)
        program_name = selected_program_name[0]  # Extracting the program name from the list
        print(program_name)

        # Create a cursor object
        cursor = cnx.cursor()

        # Fetch OKRs and related KPIs for the selected program name
        cursor.execute('''
            SELECT okr."okr_name", okr."okr_year", okr."okr_quarter", kpi."kpi_name", kpi."kpi_desc"
            FROM "OKR_MasterList" AS okr
            JOIN "ProgramOKR_Config" AS config ON okr."okr_id" = config."okr_id"
            JOIN "Programs" AS program ON config."program_id" = program."program_id"
            LEFT JOIN "OKR_KPI_Config" AS okr_kpi ON okr."okr_id" = okr_kpi."okr_id"
            LEFT JOIN "KPI_MasterList" AS kpi ON okr_kpi."kpi_id" = kpi."kpi_id"
            WHERE program."program_name" = %s
        ''', (program_name,))

        # Fetch the data from the table
        okrs = cursor.fetchall()

        # Close the cursor
        cursor.close()

        # Return the OKRs and related KPIs as JSON response
        return jsonify({"okrs": okrs}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    # API to add progress update to the OKR_KPI_Progress table
@project_notifications_api.route("/add_progress", methods=["POST"])
def add_progress():
    try:
        # Get progress data from request
        progress_data = request.json
        project_name = progress_data.get('projectName')[0]  # Extract project name from array
        okr_name = progress_data.get('OKR')
        kpi_name = progress_data.get('KPI')
        progress_status = progress_data.get('progress')
        update_details = progress_data.get('update')
        date_recorded = progress_data.get('date')
        reported_by = progress_data.get('name')  # Add reported_by field

        # Validate input data
        if not project_name or not okr_name or not kpi_name or not progress_status or not update_details or not date_recorded or not reported_by:
            return jsonify({"error": "Missing required fields."}), 400

        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."}), 500

        # Create a cursor object
        cursor = cnx.cursor()

        # Get the config_id using okr_name and kpi_name
        cursor.execute('''
            SELECT okr_kpi.config_id
            FROM "OKR_KPI_Config" AS okr_kpi
            JOIN "OKR_MasterList" AS okr ON okr_kpi."okr_id" = okr."okr_id"
            JOIN "KPI_MasterList" AS kpi ON okr_kpi."kpi_id" = kpi."kpi_id"
            JOIN "ProgramOKR_Config" AS prog_okr ON prog_okr."okr_id" = okr."okr_id"
            JOIN "Programs" AS prog ON prog."program_id" = prog_okr."program_id"
            WHERE prog."program_name" = %s AND okr."okr_name" = %s AND kpi."kpi_name" = %s
        ''', (project_name, okr_name, kpi_name))

        config_id_result = cursor.fetchone()
        
        if not config_id_result:
            return jsonify({"error": "Configuration not found."}), 404

        config_id = config_id_result[0]

        # Insert data into the database
        cursor.execute(
            '''INSERT INTO public."OKR_KPI_Progress" 
               (config_id, project_name, progress_status, update_details, date_recorded, reported_by) 
               VALUES (%s, %s, %s, %s, %s, %s)''',
            (config_id, project_name, progress_status, update_details, date_recorded, reported_by)
        )

        # Commit the transaction
        cnx.commit()

        # Close the cursor
        cursor.close()

        # Return success message
        return jsonify({"message": "Progress added successfully."}), 201

    except Exception as e:
        # Handle other unexpected errors
        return jsonify({"error": str(e)}), 500