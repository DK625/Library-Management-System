from datetime import datetime
from importlib_metadata import email

from sqlalchemy.orm import deferred

from ..config.connect_db import db
from sqlalchemy import Numeric


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role_id = db.Column(db.Integer)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password


class ToDoList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100))
    email = db.Column(db.String(100))

    def __init__(self, name, description, email):
        self.name = name
        self.description = description
        self.email = email


class ToDo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100))
    due_date = db.Column(db.String(100))
    # status = db.Column(db.String(100), defauct="Unfinished")
    status = db.Column(db.String(100))
    email = db.Column(db.String(100))
    list_name = db.Column(db.String(100))

    def __init__(self, title, description, due_date, status, email, list_name):
        self.title = title
        self.description = description
        self.due_date = due_date
        self.status = status
        self.email = email
        self.list_name = list_name

class Sensor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.TIMESTAMP, nullable=False)
    temperature = db.Column(Numeric(10, 2), nullable=False)
    humidity = db.Column(Numeric(10, 2), nullable=False)
    light = db.Column(Numeric(10, 2), nullable=False)
    dust = db.Column(Numeric(10, 2), nullable=False)

    def __init__(self, time, temperature, humidity, light, dust):
        self.time = time
        self.temperature = temperature
        self.humidity = humidity
        self.light = light
        self.dust = dust

class Action(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.TIMESTAMP, nullable=False)
    action = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(100), nullable=True)
    device = db.Column(db.String(100), nullable=True)

    def __init__(self, time, action, status, device):
        self.time = time
        self.action = action
        self.status = status
        self.device = device

books_categories = db.Table(
    'books_categories',
    db.Column('book_id', db.Integer, db.ForeignKey('books.id')),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'))
)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100))
    books = db.relationship('Books', secondary=books_categories, back_populates='categories')

    def __init__(self, name, description):
        self.name = name
        self.description = description

class Books(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bookName = db.Column(db.String(100), nullable=False)
    alternateTitle = db.Column(db.String(100))
    author = db.Column(db.String(100))
    bookCountAvailable = db.Column(db.String(100))
    language = db.Column(db.String(100))
    publisher = db.Column(db.String(100))
    added_date = db.Column(db.TIMESTAMP, nullable=False)
    categories = db.relationship('Category', secondary=books_categories, back_populates='books')

    def __init__(self, bookName, alternateTitle, author, bookCountAvailable, language, publisher, added_date):
        self.bookName = bookName
        self.alternateTitle = alternateTitle
        self.author = author
        self.bookCountAvailable = bookCountAvailable
        self.language = language
        self.publisher = publisher
        self.added_date = added_date

