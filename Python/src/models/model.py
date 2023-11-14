from sqlalchemy.orm import relationship

from ..config.connect_db import db


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    points = db.Column(db.Integer, default=10)
    fine = db.Column(db.Integer, default=0)
    role_id = db.Column(db.Integer)
    mobile_number = db.Column(db.String(100), nullable=False)
    admission_id = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)

    # 1-n relationship with Transactions
    transactions = relationship('Transactions', back_populates='borrower')


books_categories = db.Table(
    'books_categories',
    db.Column('book_id', db.Integer, db.ForeignKey('books.id')),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'))
)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100))

    # n-n relationship with Books
    books = relationship('Books', secondary=books_categories, back_populates='categories')

    def __init__(self, name, description):
        self.name = name
        self.description = description


class Books(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    available_copies = db.Column(db.Integer, nullable=False)
    remaining_copies = db.Column(db.Integer, nullable=False)
    bookName = db.Column(db.String(100), nullable=False)
    alternateTitle = db.Column(db.String(100))
    author = db.Column(db.String(100))
    language = db.Column(db.String(100))
    publisher = db.Column(db.String(100))
    added_date = db.Column(db.TIMESTAMP, nullable=False)

    # 1-n relationship with Transactions
    transactions = relationship('Transactions', back_populates='book')

    # n-n relationship with Category
    categories = relationship('Category', secondary=books_categories, back_populates='books')

    def __init__(self, bookName, alternateTitle, author, available_copies, language, publisher, added_date):
        self.bookName = bookName
        self.alternateTitle = alternateTitle
        self.author = author
        self.available_copies = available_copies
        self.remaining_copies = available_copies
        self.language = language
        self.publisher = publisher
        self.added_date = added_date


class Transactions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'))
    borrower_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    borrower_name = db.Column(db.String(100), nullable=False)
    book_name = db.Column(db.String(100), nullable=False)
    transaction_type = db.Column(db.String(100), nullable=False)
    from_date = db.Column(db.TIMESTAMP, nullable=False)
    to_date = db.Column(db.TIMESTAMP, nullable=False)
    return_date = db.Column(db.TIMESTAMP)
    status = db.Column(db.String(100), default="Active")
    # 1-n relationship with Users
    borrower = relationship('Users', back_populates='transactions')

    # 1-n relationship with Books
    book = relationship('Books', back_populates='transactions')
