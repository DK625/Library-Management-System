from unicodedata import name
from flask import jsonify
from numpy import tile
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from sqlalchemy import func, select, distinct, desc
from sqlalchemy.orm import aliased

from ..config.connect_db import db
from ..config.marsh_mallow import user_schema, sensor_schema, action_schema, category_schema, book_schema
from ..models.model import Users, Category, Books, Transactions

users_schema = user_schema(many=True)
sensor_schema = sensor_schema(many=True)
action_schema = action_schema(many=True)
category_schema = category_schema(many=True)
book_schema = book_schema(many=True)


def handle_user_login(email, password):
    try:
        user = Users.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                return {"id": user.id, "role_id": user.role_id, "err_code": 0, "err_message": "Login success"}
            return {"err_code": 3, "err_message": "Wrong password"}
        return {"err_code": 2, "err_message": "User not found"}
    except IndentationError:
        return {"err_message": "Can not handle login!"}


def handle_user_sign_up(data):
    user_name = data["name"]
    email = data["email"]
    password = data["password"]
    confirm_password = data["comfirm_password"]
    role_id = data["role_id"]
    mobile_number = data["mobile_number"]
    admission_id = data["admission_id"]
    gender = data["gender"]
    dob = data["dob"]
    address = data["address"]
    new_user = Users.query.filter_by(email=email).first()
    if new_user:
        return {"err_code": 1, "err_message": "Your email is already in used, plz try another email!"}
    elif password != confirm_password:
        return {"err_code": 2, "err_message": "Password doesn not match! Try again!"}
    else:
        password = generate_password_hash(password, method="sha256")
        new_user = Users(
            name=user_name, email=email, password=password, role_id=role_id,
            mobile_number=mobile_number, admission_id=admission_id, gender=gender,
            dob=dob, address=address
        )
        db.session.add(new_user)
        db.session.commit()
        user_data = {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email,
            'points': new_user.points,
            "mobile_number": new_user.mobile_number,
            "admission_id": new_user.admission_id,
            "gender": new_user.gender,
            "dob": new_user.dob,
            "address": new_user.address,
            "member_type": "Admin" if new_user.role_id == 1 else "Student",
        }
        return user_data


def handle_create_book(data):
    # Kiểm tra xem tên sách đã tồn tại trong cơ sở dữ liệu chưa
    if data.get('isAdmin') == None or data["isAdmin"] == False:
        return {"error": "You are not admin!"}

    existing_book = Books.query.filter_by(bookName=data["bookName"]).first()
    if existing_book:
        # Nếu sách đã tồn tại, báo lỗi hoặc trả về thông báo
        return {"error": "The book name already exists in the database."}  # Trả về status code 400 (Bad Request)
    else:
        # Nếu tên sách chưa tồn tại, tạo sách mới
        new_book = Books(
            bookName=data.get("bookName"),
            alternateTitle=data.get("alternateTitle", None),
            author=data.get("author", None),
            available_copies=data.get("available_copies", None),
            language=data.get("language", None),
            publisher=data.get("publisher", None),
            added_date=datetime.now()
        )

        # Tạo danh sách các đối tượng danh mục dựa trên danh sách ID truyền vào từ payload
        categories = Category.query.filter(Category.id.in_(data["categories"])).all()

        # Gán danh mục cho cuốn sách
        new_book.categories = categories

        db.session.add(new_book)
        db.session.commit()
        book_data = {
            "id": new_book.id,
            "bookName": new_book.bookName,
            "alternateTitle": new_book.alternateTitle,
            "author": new_book.author,
            "available_copies": new_book.available_copies,
            "language": new_book.language,
            "publisher": new_book.publisher,
            "added_date": new_book.added_date.strftime("%Y-%m-%d %H:%M:%S"),
            "category_name": [category.name for category in new_book.categories]
        }
        return book_data


def update_book(data, current_user):
    try:
        if current_user["role_id"] != "admin":
            return {
                "err_message": "not allowed to edit books",
            }
        book_id = data['book_id']
        remaining_copies = data['remaining_copies']
        book = Books.query.filter_by(id=book_id).first()
        if book:
            book.remaining_copies = remaining_copies
            db.session.commit()
            return {"err_code": 0, "err_message": "Update succeeds"}
        return {"err_code": 1, "err_message": "Book is not found!"}
    except IndentationError:
        db.session.rollback()
        return {"err_message": "Can not edit book!"}


def get_all_users(data, type_member):
    if data["role_id"] == "admin":
        if type_member == 'all':
            users = Users.query.all()
        else:
            users = Users.query.filter_by(role_id=0).all()
        users_data = []

        for user in users:
            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'points': user.points,
                'fine': user.fine,
                "mobile_number": user.mobile_number,
                "admission_id": user.admission_id,
                "gender": user.gender,
                "dob": user.dob,
                "address": user.address,
                "member_type": "Admin" if user.role_id == 1 else "Student",
                'transactions': [
                    {
                        'id': transaction.id,
                        'book_name': transaction.book_name,
                        'transaction_type': transaction.transaction_type,
                        'from_date': transaction.from_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'to_date': transaction.to_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'return_date': transaction.return_date.strftime(
                            '%Y-%m-%d %H:%M:%S') if transaction.return_date else None,
                        'status': transaction.status
                    }
                    for transaction in user.transactions
                ],
            }
            users_data.append(user_data)

        return users_data
    else:
        user = Users.query.filter_by(id=data["id"]).first()

        if user:
            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'points': user.points,
                'fine': user.fine,
                "mobile_number": user.mobile_number,
                "admission_id": user.admission_id,
                "gender": user.gender,
                "dob": user.dob,
                "address": user.address,
                'transactions': [
                    {
                        'id': transaction.id,
                        'book_name': transaction.book_name,
                        'transaction_type': transaction.transaction_type,
                        'from_date': transaction.from_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'to_date': transaction.to_date.strftime('%Y-%m-%d %H:%M:%S'),
                        'return_date': transaction.return_date.strftime(
                            '%Y-%m-%d %H:%M:%S') if transaction.return_date else None,
                    }
                    for transaction in user.transactions
                ],
            }
            users_data = [user_data]
            return users_data
        else:
            return {'error': 'User not found', 'status': 404}


def update_user_data(data, currentUser):
    try:
        if currentUser["role_id"] != "admin" and currentUser["id"] != data["id"]:
            return {
                "role_id": currentUser["role_id"],
                "current_id": currentUser["id"],
                "id": data["id"],
                "err_code": 2,
                "err_message": "not allowed to edit other user",
            }
        user = Users.query.filter_by(id=data["id"]).first()
        if user:
            user.first_name = data["first_name"]
            user.last_name = data["last_name"]
            user.address = data["address"]
            db.session.commit()
            return {"err_code": 0, "err_message": "Update succeeds"}
        return {"err_code": 1, "err_message": "User is not found!"}
    except IndentationError:
        db.session.rollback()
        return {"err_message": "Can not edit user!"}


def delete_user(id, currentUser):
    try:
        if currentUser["role_id"] != "admin" and currentUser["id"] != id:
            return {
                "role_id": currentUser["role_id"],
                "currentId": currentUser["id"],
                "id": id,
                "err_code": 2,
                "err_message": "not allowed to delete other user",
            }
        user = Users.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return {"err_code": 0, "err_message": "The user is deleted"}
        return {"err_code": 2, "err_message": "The user is not exist"}
    except IndentationError:
        db.session.rollback()
        return {"err_message": "Can not delete user!"}


def get_all_category():
    category = Category.query.all()
    return category_schema.dump(category)


def get_all_books_with_category():
    books = Books.query.all()
    books_data = []

    for book in books:
        book_data = {
            "id": book.id,
            "bookName": book.bookName,
            "alternateTitle": book.alternateTitle,
            "author": book.author,
            "available_copies": book.available_copies,
            "remaining_copies": book.remaining_copies,
            "language": book.language,
            "publisher": book.publisher,
            "category_name": [category.name for category in book.categories],
            "added_date": book.added_date.strftime("%Y-%m-%d %H:%M:%S")
        }
        books_data.append(book_data)

    return books_data


def get_recent_transactions(user_id=None):
    # recent_transactions = Transactions.query.order_by(Transactions.from_date.desc()).limit(5).all()
    if user_id:
        recent_transactions = Transactions.query.filter_by(borrower_id=user_id).order_by(
            Transactions.from_date.desc()).all()
    else:
        recent_transactions = Transactions.query.order_by(Transactions.from_date.desc()).all()

    transactions_data = []

    for transaction in recent_transactions:
        transaction_data = {
            "book_id": transaction.book_id,
            "borrower_id": transaction.borrower_id,
            "borrower_name": transaction.borrower_name,
            "book_name": transaction.book_name,
            "transaction_type": transaction.transaction_type,
            "from_date": transaction.from_date,
            "to_date": transaction.to_date,
            "return_date": transaction.return_date,
            "id": transaction.id,
            "status": transaction.status
        }
        transactions_data.append(transaction_data)

    return transactions_data


def create_transactions(data, current_user):
    book_id = data['bookId']
    borrower_id = data['borrowerId']
    transaction_type = data['transactionType']
    from_date = data['fromDate']
    to_date = data['toDate']

    if current_user.get('role_id') is None or current_user["role_id"] != 'admin':
        return {"error": "You are not admin!"}

    existing_book = Books.query.filter_by(id=book_id).first()
    if existing_book is None:
        return {"error": "The book name don't exists in the database."}
    existing_user = Users.query.filter_by(id=borrower_id).first()
    if existing_user is None:
        return {"error": "User not found!"}
    new_transaction = Transactions(
        book_id=book_id,
        borrower_id=borrower_id,
        borrower_name=existing_user.name,
        book_name=existing_book.bookName,
        transaction_type=transaction_type,
        from_date=from_date,
        to_date=to_date,
    )

    db.session.add(new_transaction)
    db.session.commit()
    transaction_data = {
        "book_id": book_id,
        "borrower_id": borrower_id,
        "borrower_name": existing_user.name,
        "book_name": existing_book.bookName,
        "transaction_type": transaction_type,
        "from_date": from_date,
        "to_date": to_date,
        "status": new_transaction.status
    }
    return transaction_data


def return_book(transaction_id, current_user):
    if current_user.get('role_id') is None or current_user["role_id"] != 'admin':
        return {"error": "You are not admin!"}
    transaction = Transactions.query.filter_by(id=transaction_id).first()
    if not transaction:
        return {"err_message": "Transaction is not found!"}

    return_date = datetime.now()
    # update issued book
    transaction.status = "Closed"
    transaction.return_date = return_date
    db.session.commit()

    # create new transaction: reversed book
    book_id = transaction.book_id
    borrower_id = transaction.borrower_id
    borrower_name = transaction.borrower_name
    book_name = transaction.book_name
    transaction_type = "Reserved"
    from_date = transaction.from_date
    to_date = transaction.to_date

    new_transaction = Transactions(
        book_id=book_id,
        borrower_id=borrower_id,
        borrower_name=borrower_name,
        book_name=book_name,
        transaction_type=transaction_type,
        from_date=from_date,
        to_date=to_date,
        return_date=return_date
    )

    db.session.add(new_transaction)
    db.session.commit()

    # Change point when revered book
    points = transaction.borrower.points
    if return_date <= to_date:
        points += 1
    else:
        days_difference = (return_date - to_date).days
        points -= days_difference
    fine = transaction.borrower.fine
    if points < 0:
        fine = -points * 1000
    transaction.borrower.points = points
    transaction.borrower.fine = fine
    db.session.commit()

    # Change remaining copies of book
    transaction.book.remaining_copies += 1
    db.session.commit()

    # return all transactions
    return get_recent_transactions()


def recharge_account(data, user_id, current_user):
    if current_user.get('role_id') is None or current_user["role_id"] != 'admin':
        return {"error": "You are not admin!"}
    user = Users.query.filter_by(id=user_id).first()
    if not user:
        return {"err_message": "User is not found!"}
    point = user.points
    fine = user.fine
    if data['type'] == 'money':
        fine -= data['value']
        if fine < 0:
            point += (-fine / 1000)
            fine = 0
    elif data['type'] == 'point':
        point += data['value']
    user.points = point
    user.fine = fine
    db.session.commit()
    return get_all_users({'role_id': 'admin'}, 'all')


def update_point(user_id, current_user):
    if current_user["role_id"] != 'admin' and int(user_id) != current_user['id']:
        return {"error": "You are not allow read other's point!"}
    if current_user["role_id"] != 'admin':
        user = Users.query.filter_by(id=user_id).first()
        if not user:
            return {"err_message": "User is not found!"}
        point = user.points
        fine = user.fine
        previous_point = point
        previous_fine = fine
        over_dues = 0
        transactions = Transactions.query.filter_by(
            borrower_id=user_id, transaction_type='Issued', status='Active').all()
        for transaction in transactions:
            if datetime.now() > transaction.time_check_point:
                time_difference = datetime.now() - transaction.time_check_point
                over_dues += time_difference.days
                if time_difference.days > 0:
                    transaction.time_check_point = datetime.now()
                    db.session.commit()
        # mỗi khi check point xong (khi thời gian quá hạn lớn hơn 1 ngày) thì cập nhật lại thòi gian đã checkpoint để lần sau check tiếp
        if point <= 0:
            point -= over_dues
            fine += over_dues * 1000
        # nếu ban đầu point nhỏ hơn bằng 0, nghĩa là đã có tiền phạt thì cứ qua 1 ngày trừ 1 điểm và trừ 1k
        else:
            point -= over_dues
            if point < 0:
                fine += (-point) * 1000
        # nếu ban đầu point lớn hơn 0, nghĩa là chưa có tiền phạt thì qua 1 ngày trừ 1 điểm, tiền phạt chỉ được tính khi point đã âm
        # ví dụ id = 4, point = 10, fine = 5000, đã quá 15 ngày thì point = -5, fine = 10000

        user.points = point
        user.fine = fine
        db.session.commit()
        return {
            "user_id": user_id,
            "name": user.name,
            "previous_point": previous_point,
            "previous_fine": previous_fine,
            "next_point": point,
            "next_fine": fine
        }

    update_points = []
    users = Users.query.all()
    for user in users:
        point = user.points
        fine = user.fine
        previous_point = point
        previous_fine = fine
        over_dues = 0
        transactions = Transactions.query.filter_by(
            borrower_id=user.id, transaction_type='Issued', status='Active').all()
        for transaction in transactions:
            if datetime.now() > transaction.time_check_point:
                time_difference = datetime.now() - transaction.time_check_point
                over_dues += time_difference.days
                if time_difference.days > 0:
                    transaction.time_check_point = datetime.now()
                    db.session.commit()
        if point <= 0:
            point -= over_dues
            fine += over_dues * 1000
        else:
            point -= over_dues
            if point < 0:
                fine += (-point) * 1000

        user.points = point
        user.fine = fine
        db.session.commit()
        update_points.append({
            "user_id": user.id,
            "name": user.name,
            "previous_point": previous_point,
            "previous_fine": previous_fine,
            "next_point": point,
            "next_fine": fine
        })
    return update_points
