# Project Creation feature

from flask import Blueprint, jsonify, request
from db import cnx

project_details_api = Blueprint('project_details_api', __name__)

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
