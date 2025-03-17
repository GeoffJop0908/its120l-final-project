from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from flask_marshmallow import Marshmallow
import pickle
from sqlalchemy.dialects.mysql import LONGTEXT, JSON
import ollama

# from langchain_community.llms import Ollama
# from flask import Flask, render_template, request
# from langchain_community.vectorstores import FAISS
# from langchain.memory import ConversationBufferMemory
# from langchain.chains import ConversationalRetrievalChain
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader

# # Chatbot RAG Stuff

# loader = DirectoryLoader("./data/", glob="*.pdf", loader_cls=PyPDFLoader)
# documents = loader.load()

# # Split the documents into chunks
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
# text_chunks = text_splitter.split_documents(documents)

# # Creating the Embeddings and Vector Store
# embeddings = HuggingFaceEmbeddings(
#     model_name="sentence-transformers/all-MiniLM-L6-v2",
#     model_kwargs={"device": "cuda:0"},
# )

# vector_store = FAISS.from_documents(text_chunks, embeddings)

# # Load the model
# llm = Ollama(model="llama3.2:3b")

# # load the memory
# memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# # create the chain
# chain = ConversationalRetrievalChain.from_llm(
#     llm=llm,
#     chain_type="stuff",
#     retriever=vector_store.as_retriever(search_kwargs={"k": 2}),
#     memory=memory,
# )

# Load Models for Recommendation System

with open("models/tfidf_vectorizer.pkl", "rb") as f:
    tfidf = pickle.load(f)

with open("models/tfidf_matrix.pkl", "rb") as f:
    tfidf_matrix = pickle.load(f)

# Function Definitions for Recommendation System

import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('stopwords')
nltk.download('wordnet')

def clean_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'[^a-z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text

stop_words = set(stopwords.words('english'))

def remove_stopwords(text):
    return ' '.join([word for word in text.split() if word not in stop_words])

lemmatizer = WordNetLemmatizer()

def lemmatize_text(text):
    return ' '.join([lemmatizer.lemmatize(word) for word in text.split()])

def recommend_products(user_query, tfidf_matrix, top_n=50):
    # Transform the user query using the same TF-IDF vectorizer
    user_tfidf = tfidf.transform([user_query])
    
    # Compute cosine similarities between the user query and all product features
    cosine_similarities = cosine_similarity(user_tfidf, tfidf_matrix).flatten()
    
    # Get indices of the top_n products with the highest similarity scores
    top_indices = cosine_similarities.argsort()[-top_n:][::-1]
    # Retrieve the corresponding 'parent_asin's
    top_indices = (top_indices + 1).tolist()
    
    return top_indices

def preprocess(text):
    text = clean_text(text)
    text = remove_stopwords(text)
    text = lemmatize_text(text)
    return text

# Flask stuff

class Base(DeclarativeBase):
  pass

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqldb://root:h6ty78u6CD-$@localhost/mydb"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(model_class=Base)
ma = Marshmallow(app)
db.init_app(app)
CORS(app, origins=["http://localhost:5173"])

# Model Definition

class PetProducts(db.Model):
    __tablename__ = "pet_products"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(LONGTEXT)
    average_rating = db.Column(db.Numeric(7, 1))
    rating_number = db.Column(db.Integer)
    store = db.Column(LONGTEXT)
    parent_asin = db.Column(db.String(45))
    features = db.Column(LONGTEXT)
    description = db.Column(LONGTEXT)
    details = db.Column(LONGTEXT)
    images = db.Column(JSON)

class ProdSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'average_rating', 'rating_number', 'store', 'parent_asin', 'features', 'description', 'details')

prod_schema = ProdSchema()
prods_schema = ProdSchema(many=True)

@app.route("/recommendations", methods=['POST'])
def recommend():
    user_query = request.json["query"]
    
    if not user_query:
        return jsonify({"error": "Query parameter is missing"})

    # Get recommended product IDs
    recommended_ids = recommend_products(user_query, tfidf_matrix)

    # Query database for product details
    recommended_products = PetProducts.query.filter(PetProducts.id.in_(recommended_ids)).all()
    print(recommend_products)

    # Convert results to JSON
    result = [
        {"id": product.id,
    "title": product.title,
    "average_rating": product.average_rating,
    "rating_number": product.rating_number,
    "store": product.store,
    "parent_asin": product.parent_asin,
    "features": product.features,
    "description": product.description,
    "details": product.details,
    "images": product.images}
        for product in recommended_products
    ]

    return jsonify(result)

@app.route("/chat", methods=['POST'])
def chat():
    client = ollama.Client()

    model = "llama3.2:3b"
    prompt = request.json["prompt"]

    response = client.generate(model=model, prompt=prompt)

    return response.response

    # user_input = request.json["prompt"]
    # result = chain({"question": user_input, "chat_history": []})
    # return result["answer"]

@app.route("/images", methods=['POST'])
def images():
    product_id = request.json["id"]

    if not product_id:
        return jsonify({"error": "ID parameter is missing"}), 400

    # Retrieve the product by 'id'
    product = PetProducts.query.get(product_id)
    
    # Check if the product exists
    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Convert the product details to JSON
    result = {"id": product.id,
    "title": product.title,
    "average_rating": product.average_rating,
    "rating_number": product.rating_number,
    "store": product.store,
    "parent_asin": product.parent_asin,
    "features": product.features,
    "description": product.description,
    "details": product.details,
    "images": product.images}

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)