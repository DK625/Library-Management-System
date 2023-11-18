from flask_restful import Resource

from ..controllers import user_controller


class User(Resource):
    def get(self):
        return user_controller.handle_get_all_member()

    def post(self):
        return user_controller.handle_create_new_users()

    def put(self):
        return user_controller.handle_edit_users()

    def delete(self):
        return user_controller.handle_delete_users()


class Login(Resource):
    def post(self):
        return user_controller.handle_loging()


class sign_up(Resource):
    def post(self):
        return user_controller.sign_up()


class Category(Resource):
    def get(self):
        return user_controller.handle_get_all_category()


class Book(Resource):
    def get(self):
        return user_controller.handle_get_all_book()

    def post(self):
        return user_controller.handle_create_book()

    def put(self):
        return user_controller.update_book()


class Transaction(Resource):
    def get(self):
        return user_controller.get_recent_transactions()

    def post(self):
        return user_controller.create_transactions()

    def put(self):
        return user_controller.return_book()


class Recharge(Resource):
    def put(self):
        return user_controller.recharge_account()


class Point(Resource):
    def put(self):
        return user_controller.update_point()
