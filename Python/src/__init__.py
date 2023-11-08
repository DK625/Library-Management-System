import os

from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from .config.config import config
from .config.connect_db import db
from .route.web import Login, User, Sensor, Action, Limit, Category, Book, sign_up, todo_list, todo

def create_app():
    app = Flask(__name__)
    api = Api(app)
    app.config.from_mapping(config)
    db.init_app(app)
    with app.app_context():
        db.create_all()

    CORS(app, supports_credentials=True)
    api.add_resource(sign_up, "/api/sign_up")
    api.add_resource(Login, "/api/login")
    api.add_resource(todo_list, "/api/todo_list")
    api.add_resource(todo, "/api/todo")
    api.add_resource(User, "/api/users")

    api.add_resource(Sensor, "/api/data_sensor")
    api.add_resource(Action, "/api/action_history")
    api.add_resource(Limit, "/api/get_limit")
    api.add_resource(Category, "/api/allcategories")
    api.add_resource(Book, "/api/books")
    return app
