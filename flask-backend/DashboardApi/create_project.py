from flask import Blueprint, jsonify, request
from db import cnx
import psycopg2
from datetime import datetime
import logging

create_project_api = Blueprint('create_project_api', __name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@create_project_api.route("/create_project", methods=['POST'])
def create_project():
    try:
        # Get project data from request
        project_data = request.json
        logging.debug(f"Received project data: {project_data}")
        
        project_description = project_data.get('projectDescription')
        project_name = project_data.get('projectName')
        person_names = project_data.get('personName')
        start_date = datetime.strptime(project_data.get('startDate'), '%d-%m-%Y')
        end_date = datetime.strptime(project_data.get('endDate'), '%d-%m-%Y')
        okr_number = project_data.get('okrNumber')
        okr_values = project_data.get('okrValues')

        # Validate input data
        if not project_description or not project_name or not person_names or not start_date or not end_date or not okr_number or not okr_values:
            return jsonify({"error": "Missing required fields."}), 400

        # Check if the connection is established
        if cnx is None:
            return jsonify({"error": "Database connection is not established."}), 500

        # Create a cursor object
        cursor = cnx.cursor()

        # Insert data into the Programs table
        cursor.execute("""
            INSERT INTO public."Programs" (program_name, program_desc, program_start_date, program_end_date, program_duration)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING program_id
        """, (project_name, project_description, start_date, end_date, (end_date - start_date).days))
        program_id = cursor.fetchone()[0]

        # Link existing managers to the new program
        for person_name_list in person_names:
            for person_name in person_name_list:
                logging.debug(f"Linking Manager: {person_name}")
                cursor.execute("""
                    SELECT manager_id FROM public."Managers" WHERE first_name = %s
                """, (person_name,))
                manager_id = cursor.fetchone()
                if manager_id:
                    cursor.execute("""
                        INSERT INTO public."ManagerPrograms" (manager_id, program_id)
                        VALUES (%s, %s)
                    """, (manager_id[0], program_id))

        # Insert data into the OKR_MasterList and related tables
        for okr_key, okr in okr_values.items():
            logging.debug(f"Processing OKR: {okr_key}")
            okr_name = okr.get('OkrName')
            okr_date = int(okr.get('OkrDate'))
            month_range = okr.get('MonthRange')
            kpi_number = okr.get('KPINumber')
            kpis = okr.get('KPIs')

            cursor.execute("""
                INSERT INTO public."OKR_MasterList" (okr_name, okr_year, okr_quarter)
                VALUES (%s, %s, %s)
                RETURNING okr_id
            """, (okr_name, okr_date, month_range))
            okr_id = cursor.fetchone()[0]

            cursor.execute("""
                INSERT INTO public."ProgramOKR_Config" (program_id, okr_id)
                VALUES (%s, %s)
            """, (program_id, okr_id))

            for kpi_key, kpi_value in kpis.items():
                logging.debug(f"Processing KPI: {kpi_key}, Value: {kpi_value}")
                kpi_name = kpi_value.get('KpiName')
                kpi_date = kpi_value.get('KpiDate')

                cursor.execute("""
                    INSERT INTO public."KPI_MasterList" (kpi_name, kpi_desc, kpi_text_eval, kpi_numeric_eval, kpi_TF_eval, kpi_weeks, date_created)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING kpi_id
                """, (kpi_name, '', False, True, False, kpi_date, start_date))
                kpi_id = cursor.fetchone()[0]

                cursor.execute("""
                    INSERT INTO public."OKR_KPI_Config" (kpi_id, okr_id)
                    VALUES (%s, %s)
                """, (kpi_id, okr_id))

                cursor.execute("""
                    INSERT INTO public."ProgramKPI_Config" (program_id, kpi_id, kpi_threshold)
                    VALUES (%s, %s, %s)
                """, (program_id, kpi_id, ''))

        # Commit the transaction
        cnx.commit()

        # Close the cursor
        cursor.close()

        # Return success message
        return jsonify({"message": "Project added successfully."}), 201

    except psycopg2.IntegrityError as e:
        # Handle database constraint violation errors
        cnx.rollback()  # Rollback transaction on error
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        # Handle other unexpected errors
        cnx.rollback()  # Rollback transaction on error
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": str(e)}), 500
