from flask import Blueprint, jsonify, request, render_template
from project import db, bcrypt
from project.api.models import  User
from sqlalchemy import exc, or_

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/auth/register', methods=['POST'])
def register_user():
    post_data = request.get_json()
    response_object = {
        'code': 'fail',
        'message': 'Invalid payload.'
    }
    if not post_data:
        jsonify(response_object), 400

    username = post_data.get('username')
    email = post_data.get('email')
    password = post_data.get('password')
    try:
        user = User.query.filter(
            or_(User.username == username, User.email == email)).first()
        if not user:
            new_user = User(
                username=username,
                email=email,
                password=password
            )
            db.session.add(new_user)
            db.session.commit()
            # generate auth token
            auth_token = new_user.encode_auth_token(new_user.id)
            response_object['code'] = 'success'
            response_object['message'] = 'Successfully registered.'
            response_object['auth_token'] = auth_token.decode()
            return jsonify(response_object), 201
        else:
            response_object['message'] = 'Sorry, That user already exists.'
            return jsonify(response_object), 400
    except (exc.IntegrityError, ValueError) as e:
        db.session.rollback()
        return jsonify(response_object), 400

@auth_blueprint.route('/auth/login', methods=['POST'])
def login_user():
    # get post data
    post_data = request.get_json()
    response_object = {
        'code': 'fail',
        'message': 'Invalid payload.'
    }
    if not post_data:
        return jsonify(response_object), 400
    email = post_data.get('email')
    password = post_data.get('password')
    try:
        # fetch the user data
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            auth_token = user.encode_auth_token(user.id)
            if auth_token:
                response_object['code'] = 'success'
                response_object['message'] = 'Successfully logged in.'
                response_object['auth_token'] = auth_token.decode()
                return jsonify(response_object), 200
        else:
            response_object['message'] = 'User does not exist.'
            return jsonify(response_object), 404
    except Exception as e:
        response_object['message'] = 'Try again.'
        return jsonify(response_object), 500

@auth_blueprint.route('/auth/logout', methods=['GET'])
def logout():
    # get auth token
    auth_header = request.headers.get('Authorization')
    response_object = {
        'code': 'fail',
        'message': 'Provide a valid auth token.'
    }
    if auth_header:
        auth_token = auth_header.split(' ')[1]
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            response_object['code'] = 'success'
            response_object['message'] = 'Successfully logged out.'
            return jsonify(response_object), 200
        else:
            response_object['message'] = resp
            return jsonify(response_object), 401
    else:
        return jsonify(response_object), 403

@auth_blueprint.route('/auth/status', methods=['GET'])
def get_user_status():
    # get auth token
    auth_header = request.headers.get('Authorization')
    response_object = {
        'code': 'fail',
        'message': 'Provide a valid auth token.'
    }
    if auth_header:
        auth_token = auth_header.split(' ')[1]
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            user = User.query.filter_by(id=resp).first()
            response_object['code'] = 'success'
            response_object['message'] = 'Success.'
            response_object['result'] = user.to_json()
            return jsonify(response_object), 200
        response_object['message'] = resp
        return jsonify(response_object), 401
    else:
        return jsonify(response_object), 401


