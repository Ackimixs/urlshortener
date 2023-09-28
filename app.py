from flask import Flask, render_template, request, redirect, json
import sqlite3

app = Flask(__name__)


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/')
def home():  # put application's code here
    return render_template('index.html')


@app.route('/r/<code>')
def redirect_to_url(code):
    conn = get_db_connection()
    url = conn.execute("SELECT * FROM url WHERE code=?", (code,)).fetchone()
    conn.close()
    if url is None:
        return redirect('/')
    else:
        return redirect(url['long_url'])


@app.get('/api/url')
def api_url_get():
    conn = get_db_connection()
    urls = conn.execute("SELECT * FROM url").fetchall()
    conn.close()
    return {
        'body': {
            'url': [dict(row) for row in urls]
        }
    }


@app.post('/api/url')
def api_url_post():
    data = json.loads(request.data)
    code = data['code']
    long_url = data['long_url']
    conn = get_db_connection()
    conn.execute("INSERT INTO url (code, long_url) VALUES (?, ?) RETURNING *",
                    (code, long_url)
                    )
    conn.commit()
    conn.close()
    return {
        "body": {
            "url": {
                "code": code,
                "long_url": long_url
            }
        }
    }


if __name__ == '__main__':
    app.run()
