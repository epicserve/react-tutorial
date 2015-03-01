import json
import os
from flask import Flask, Response, request, send_from_directory

BASE_DIR = os.getcwd()
app = Flask(__name__, static_folder='static')


@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')


@app.route('/comments.json', methods=['GET', 'POST'])
def comments_handler():

    with open('_comments.json', 'r') as f:
        comments = json.loads(f.read())

    if request.method == 'POST':
        comments.append(request.form.to_dict())

        with open('_comments.json', 'w') as f:
            f.write(json.dumps(comments, indent=4, separators=(',', ': ')))

    return Response(json.dumps(comments), mimetype='application/json')

if __name__ == '__main__':
    app.debug = True
    app.run(port=8000)
