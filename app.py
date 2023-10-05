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
    urls = db_get_urls()
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
    url = conn.execute("INSERT INTO url (code, long_url) VALUES (?, ?) RETURNING *",
                       (code, long_url)
                       ).fetchone()
    conn.commit()
    conn.close()
    return {
        "body": {
            "url": {
                "id": url['id'],
                "code": url['code'],
                "long_url": url['long_url']
            }
        }
    }


@app.patch('/api/url/<id>')
@app.put('/api/url/<id>')
def api_url_update(id):
    url = db_get_url(id)
    if url is None:
        return {
            "body": {
                "error": "url not found"
            }
        }

    data = json.loads(request.data)
    code = data['code'] if 'code' in data else url['code']
    long_url = data['long_url'] if 'long_url' in data else url['long_url']
    conn = get_db_connection()
    new_url = conn.execute("UPDATE url SET code = ?, long_url = ? WHERE id = ? RETURNING *",
                           (code, long_url, id)
                           ).fetchone()
    conn.commit()
    conn.close()

    return {
        "body": {
            "url": {
                "id": new_url['id'],
                "code": new_url['code'],
                "long_url": new_url['long_url']
            }
        }
    }


@app.delete('/api/url/<id>')
def api_url_delete(id):
    url = db_get_url(id)
    if url is None:
        return {
            "body": {
                "error": "url not found"
            }
        }

    conn = get_db_connection()
    conn.execute("DELETE FROM url WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return {
        "body": {
            "url": {
                "id": url['id'],
                "code": url['code'],
                "long_url": url['long_url']
            }
        }
    }


if __name__ == '__main__':
    app.run()


def db_get_urls():
    conn = get_db_connection()
    urls = conn.execute("SELECT * FROM url").fetchall()
    conn.close()
    return urls


def db_get_url(id):
    conn = get_db_connection()
    url = conn.execute("SELECT * FROM url WHERE id=?", (id,)).fetchone()
    conn.close()
    return url
