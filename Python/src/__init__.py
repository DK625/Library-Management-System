import os

from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from .config.config import config
from .config.connect_db import db
from .route.web import Login, User, Category, Book, Transaction, Recharge, sign_up


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

    api.add_resource(Category, "/api/allcategories")
    api.add_resource(Book, "/api/books")
    api.add_resource(User, "/api/get_all_member")
    api.add_resource(Transaction, "/api/transactions")
    api.add_resource(Recharge, "/api/recharge")
    return app
