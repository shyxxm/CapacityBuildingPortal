# chart_api.py

from flask import Blueprint, jsonify

preTraining_api = Blueprint('preTraining_api', __name__)
skillImplementation_api = Blueprint('skillImplementation_api', __name__)
assessment_api = Blueprint('assessment_api', __name__)
income_api = Blueprint('income_api', __name__)

# Api for Pre-Training Graph
@preTraining_api.route('/preTraining_data')
def preTraining_data():
    tooltip_data = [
        ["Centre 1", "Centre 2","Centre 5"],
        ["Centre 2", "Centre 4","Centre 6"],
        ["Centre 4", "Centre 6"],
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
        ["Centre 2", "Centre 4","Centre 6"],
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
