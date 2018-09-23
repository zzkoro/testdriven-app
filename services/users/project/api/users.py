from flask import Blueprint, jsonify

users_blueprint = Blueprint('usres', __name__)

@users_blueprint.route('/users/ping', method=['GET'])
def ping_pong():
    return jsonify({
        'status': 'success',
        'message': 'pong!'

    })