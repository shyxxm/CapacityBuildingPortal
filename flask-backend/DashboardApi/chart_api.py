# chart_api.py

from flask import Blueprint, jsonify

chart_api = Blueprint('chart_api', __name__)

@chart_api.route('/chart_data')
def chart_data():
    tooltip_data = [
        ["Centre 1", "Centre 2"],
        ["Centre 3", "Centre 5"],
        ["Centre 5", "Centre 6"],
    ]
    return jsonify(tooltip_data)
