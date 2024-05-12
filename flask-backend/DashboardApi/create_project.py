from flask import Blueprint, jsonify, request
from db import cnx
import psycopg2

create_project_api = Blueprint('create_project_api', __name__)

@create_project_api.route("/create_project", methods=['POST'])
def create_project():
    data = request.json
    print("Received Data:", data)  # Print received data to console
    # Here you can process the received data
    return jsonify({'message': 'Data received successfully'})

