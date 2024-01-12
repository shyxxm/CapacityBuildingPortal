# chart_api.py

from flask import Blueprint, jsonify

chart_api = Blueprint('chart_api', __name__)

@chart_api.route('/chart_data')
def chart_data():
    tooltip_data = [
        ["Centre 1", "Centre 2","Centre 5", "Centre 6"],
        ["Centre 2", "Centre 4","Centre 6","Centrw 1"],
        ["Centre 4", "Centre 6"],
    ]
    print(tooltip_data)
    return jsonify(tooltip_data)
