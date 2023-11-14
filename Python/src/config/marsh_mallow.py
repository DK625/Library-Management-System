from .connect_db import ma


class user_schema(ma.Schema):
    class Meta:
        fields = ("id", "email", "name", "role_id", "points")


class sensor_schema(ma.Schema):
    class Meta:
        fields = ("id", "time", "temperature", "humidity", "light", "dust")


class action_schema(ma.Schema):
    class Meta:
        fields = ("id", "time", "action", "port", "status", "device")


class category_schema(ma.Schema):
    class Meta:
        fields = ("id", "name", "description")


class book_schema(ma.Schema):
    class Meta:
        fields = (
        "id", "bookName", "alternateTitle", "author", "bookCountAvailable", "language", "publisher", "added_date")
