DROP TABLE IF EXISTS url;

CREATE TABLE url (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    long_url TEXT NOT NULL
);