import sqlite3

connection = sqlite3.connect('database.db')

with open('schema.sql') as f:
    connection.executescript(f.read())

    cur = connection.cursor()

    cur.execute("INSERT INTO url (code, long_url) VALUES (?, ?)",
                ('google', 'https://www.google.com')
                )

    connection.commit()
    connection.close()
