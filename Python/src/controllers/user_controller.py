import json
from datetime import datetime, timedelta

import jwt
from flask import Flask, current_app, jsonify, request

from ..config.connect_db import db
from ..config.marsh_mallow import user_schema
from ..controllers.verify_and_authorization import Middleware
from ..models.model import Users
from ..services import user_service

users_schema = user_schema(many=True)


def sign_up():
    data = json.loads(request.data)
    if data and ("name" in data) and ("email" in data) and ("password" in data) and ("comfirm_password" in data):
        name = data["name"]
        email = data["email"]
        password = data["password"]
        confirm_password = data["comfirm_password"]
        user_data = user_service.handle_user_sign_up(name, email, password, confirm_password)
        response = jsonify(
            {
                "err_code": user_data["err_code"],
                "message": user_data["err_message"],
            }
        )
        response.status_code = 200
        return response
    response = jsonify(
        {
            "err_code": "1",
            "message": "Missing inputs parameter!",
        }
    )
    response.status_code = 404
    return response


def handle_loging():
    data = json.loads(request.data)
    if data and ("email" in data) and ("password" in data):
        email = data["email"]
        password = data["password"]
        user_data = user_service.handle_user_login(email, password)
        if user_data["err_code"] == 0:
            # token = jwt.encode(
            #     {
            #         "email": email,
            #         "exp": datetime.utcnow() + timedelta(minutes=30000),
            #     },
            #     current_app.config["SECRET_KEY"],
            # )
            is_admin = False
            if user_data['role_id'] == 1:
                is_admin = True
            response = jsonify(
                {
                    # "token": token,
                    "isAdmin": is_admin,
                    "err_code": user_data["err_code"],
                    "err_message": user_data["err_message"],
                }
            )
            response.status_code = 200
            return response
        response = jsonify(
            {
                "err_code": user_data["err_code"],
                "message": user_data["err_message"],
            }
        )
        response.status_code = 200
        return response
    response = jsonify({"err_code": "1", "message": "Missing inputs parameter!"})
    response.status_code = 404
    return response


def create_new_category():
    data = json.loads(request.data)
    try:
        current_user = Middleware()
        user_data = user_service.create_new_list(data, current_user["email"])
        return jsonify(
            {
                "message": user_data,
            }
        )
    except:
        return jsonify(
            {
                "err_message": "not logged in yet",
            }
        )


def create_new_todo():
    data = json.loads(request.data)

    # current_user = Middleware()
    # user_data = user_service.create_new_todo(data, current_user["email"])
    # return jsonify(
    #         {
    #             "message": user_data,
    #         }
    #     )

    try:
        current_user = Middleware()
        # name current_user, name todo_list
        user_data = user_service.create_new_todo(data, current_user["email"])
        return jsonify(
            {
                "message": user_data,
            }
        )
    except:
        return jsonify(
            {
                "err_message": "not logged in yet",
            }
        )




def handle_get_all_users():
    try:
        data = Middleware()
        if data and ("id" in data) and ("role_id" in data):
            user_data = user_service.get_all_users(data)
            return jsonify({"err_code": 0, "err_message": "OK", "users": user_data})
        return jsonify({"err_code": "1", "err_message": "Missing inputs parameter!"})
    except:
        return jsonify({"err_message": "not logged in yet"})


def handle_edit_users():
    try:
        current_user = Middleware()
        data = json.loads(request.data)
        if (data and ("first_name" in data) and ("last_name" in data) and ("address" in data)) and ("id" in data):
            message = user_service.update_user_data(data, current_user)
            response = jsonify({"message": message})
            response.status_code = 202
            return response
        return jsonify({"err_code": "1", "err_message": "Missing inputs parameter!"})
    except:
        return jsonify({"err_message": "not logged in yet"})


def handle_delete_users():
    try:
        current_user = Middleware()
        data = json.loads(request.data)
        if data and ("role_id" in current_user) and "id" in data:
            message = user_service.delete_user(data["id"], current_user)
            response = jsonify({"message": message})
            response.status_code = 202
            return response
        return jsonify({"err_code": "1", "err_message": "Missing inputs parameter!"})
    except:
        return jsonify({"err_message": "not logged in yet"})


def handle_get_all_sensor():
    try:
        sensor_data = user_service.get_all_sensor()
        return jsonify({"err_code": 0, "err_message": "OK", "sensor_data": sensor_data})
    except Exception as e:
        return jsonify({"error": str(e)})
    
def create_data_sensor():
    try:
        data = json.loads(request.data)
        sensor_data = user_service.create_sensor_data(data)
        return jsonify(
            {
                "message": sensor_data,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)})

def handle_get_all_category():
    try:
        category_data = user_service.get_all_category()
        return jsonify({"err_code": 0, "err_message": "OK", "category_detail": category_data})
    except Exception as e:
        return jsonify({"error": str(e)})
    
def handle_get_all_book():
    try:
        book_data = user_service.get_all_books_with_category()
        return jsonify({"err_code": 0, "err_message": "OK", "book_detail": book_data})
    except Exception as e:
        return jsonify({"error": str(e)})
    
def handle_create_action():
    try:
        data = json.loads(request.data)
        action_history = user_service.handle_create_action(data)
        return jsonify(
            {
                "message": action_history,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)})
    
def handle_create_book():
    try:
        data = json.loads(request.data)
        book_data = user_service.handle_create_book(data)
        return jsonify(
            {
                "message": book_data,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)})
    
def get_earliest_limit():
    try:
        data = user_service.get_earliest_limit()
        return jsonify({"err_code": 0, "err_message": "OK", "limit": data})
    except Exception as e:
        return jsonify({"error": str(e)})
    