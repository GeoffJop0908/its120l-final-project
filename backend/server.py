from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from flask_marshmallow import Marshmallow

class Base(DeclarativeBase):
  pass

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqldb://root:h6ty78u6CD-$@localhost/mydb"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(model_class=Base)
ma = Marshmallow(app)
db.init_app(app)
CORS(app, origins=["http://localhost:5173"])

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    email = db.Column(db.String(100), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'email')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

@app.route("/add", methods=['POST'])
def add():
    username = request.json["username"]
    email = request.json["email"]

    users = User(username, email)
    db.session.add(users)
    db.session.commit()
    
    return user_schema.jsonify(users)

@app.route("/list", methods=['GET'])
def get():
    all_users = User.query.all()
    results = users_schema.dump(all_users)
    return jsonify(results)

@app.route("/update/<id>", methods=['PUT'])
def update(id):
    user = User.query.get(id)

    username = request.json["username"]
    email = request.json["email"]

    user.username = username
    user.email = email

    db.session.commit()
    return user_schema.jsonify(user)

@app.route("/delete/<id>", methods=['DELETE'])
def delete(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return user_schema.jsonify(user)

@app.route("/details/<id>", methods=['GET'])
def details(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)

if __name__ == "__main__":
    app.run(debug=True)