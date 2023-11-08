from flask_restful import Resource

from ..controllers import user_controller


class todo_list(Resource):
    def post(self):
        return user_controller.create_new_category()
    def get(self):
        return user_controller.handle_get_all_category()

class todo(Resource):
    def post(self):
        return user_controller.create_new_todo()


class User(Resource):
    def get(self):
        return user_controller.handle_get_all_users()

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

class Sensor(Resource):
    def get(self):
        return user_controller.handle_get_all_sensor()
    def post(self):
        return user_controller.create_data_sensor()

class Action(Resource):
    def get(self):
        return user_controller.handle_get_all_action()
    def post(self):
        return user_controller.handle_create_action()
    
class Limit(Resource):
    def get(self):
        return user_controller.get_earliest_limit()

class Category(Resource):
    def get(self):
        return user_controller.handle_get_all_category()
class Book(Resource):
    def get(self):
        return user_controller.handle_get_all_book()
    def post(self):
        return user_controller.handle_create_book()