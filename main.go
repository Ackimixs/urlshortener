package main

import (
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mattn/go-sqlite3"
)

type Url struct {
	LongUrl string `json:"long_url"`
	Code    string `json:"code"`
}

type UrlId struct {
	Id      int    `json:"id"`
	LongUrl string `json:"long_url"`
	Code    string `json:"code"`
}

func main() {

	fmt.Println("Hello, world!")

	// Start database setup

	var sqlite3conn *sqlite3.SQLiteConn
	sql.Register("sqlite3_with_limit", &sqlite3.SQLiteDriver{
		ConnectHook: func(conn *sqlite3.SQLiteConn) error {
			sqlite3conn = conn
			return nil
		},
	})

	db, err := sql.Open("sqlite3_with_limit", "./url.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	sqlStmt := `
	DROP TABLE IF EXISTS url;
	create table url (id INTEGER PRIMARY KEY AUTOINCREMENT, long_url text not null, code text not null);
	delete from url;
	`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Printf("%q: %s\n", err, sqlStmt)
		return
	}

	if sqlite3conn == nil {
		log.Fatal("not set sqlite3 connection")
	}

	// End database setup

	router := gin.Default()
	router.SetFuncMap(template.FuncMap{
		"upper": strings.ToUpper,
	})
	router.LoadHTMLGlob("templates/*.html")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"content": "This is an index page...",
		})
	})

	router.GET("/api/url", func(c *gin.Context) {
		rows, err := db.Query("select * from url")
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()
		var urls []UrlId
		for rows.Next() {
			var url UrlId
			err = rows.Scan(&url.Id, &url.LongUrl, &url.Code)
			if err != nil {
				log.Fatal(err)
			}
			urls = append(urls, url)
		}
		err = rows.Err()
		if err != nil {
			log.Fatal(err)
		}
		c.JSON(http.StatusOK, gin.H{
			"body": gin.H{
				"url": urls,
			},
		})
	})

	router.POST("/api/url", func(c *gin.Context) {
		body := Url{}

		if err := c.BindJSON(&body); err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		res, err := db.Exec("insert into url (long_url, code) values (?, ?) RETURNING *", body.LongUrl, body.Code)

		if err != nil {
			log.Fatal(err)
		}

		id, err := res.LastInsertId()

		if err != nil {
			log.Fatal(err)
		}

		url := getUrl(fmt.Sprintf("%d", id), db)

		c.JSON(http.StatusAccepted, gin.H{
			"body": gin.H{
				"url": UrlId{
					Id:      int(id),
					LongUrl: url.LongUrl,
					Code:    url.Code,
				},
			},
		})
	})

	router.GET("/api/url/:id", func(c *gin.Context) {
		id := c.Param("id")

		rows, err := db.Query("select long_url, code from url where id = ?", id)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()
		var url Url
		for rows.Next() {
			err = rows.Scan(&url.LongUrl, &url.Code)
			if err != nil {
				log.Fatal(err)
			}
		}
		err = rows.Err()
		if err != nil {
			log.Fatal(err)
		}
		c.JSON(http.StatusOK, gin.H{
			"body": gin.H{
				"url": url,
			},
		})
	})

	router.PUT("/api/url/:id", func(c *gin.Context) {
		id := c.Param("id")
		body := Url{}

		if err := c.BindJSON(&body); err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		url := getUrl(id, db)
		if body.LongUrl == "" {
			body.LongUrl = url.LongUrl
		}
		if body.Code == "" {
			body.Code = url.Code
		}

		println(body.Code, body.LongUrl)

		// update in the database
		tx, err := db.Begin()
		if err != nil {
			log.Fatal(err)
		}
		stmt, err := tx.Prepare("update url set long_url = ?, code = ? where id = ?")
		if err != nil {
			log.Fatal(err)
		}
		defer stmt.Close()
		_, err = stmt.Exec(body.LongUrl, body.Code, id)
		err = tx.Commit()
		if err != nil {
			log.Fatal(err)
		}

		c.JSON(http.StatusAccepted, gin.H{
			"body": gin.H{
				"url": getUrl(id, db),
			},
		})
	})

	router.DELETE("/api/url/:id", func(c *gin.Context) {
		id := c.Param("id")

		// delete in the database
		tx, err := db.Begin()
		if err != nil {
			log.Fatal(err)
		}
		stmt, err := tx.Prepare("delete from url where id = ?")
		if err != nil {
			log.Fatal(err)
		}
		defer stmt.Close()
		_, err = stmt.Exec(id)
		err = tx.Commit()
		if err != nil {
			log.Fatal(err)
		}
		c.JSON(http.StatusAccepted, gin.H{
			"body": gin.H{
				"url": "deleted",
			},
		})
	})

	router.GET("/r/:id", func(c *gin.Context) {
		id := c.Param("id")

		rows, err := db.Query("select long_url, code from url where code = ?", id)
		if err != nil {
			log.Fatal(err)
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Not found",
			})
		}
		defer rows.Close()
		var url Url
		for rows.Next() {
			err = rows.Scan(&url.LongUrl, &url.Code)
			if err != nil {
				log.Fatal(err)
				c.JSON(http.StatusNotFound, gin.H{
					"message": "Not found",
				})
			}
		}
		err = rows.Err()
		if err != nil {
			log.Fatal(err)
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Not found",
			})
		}
		c.Redirect(http.StatusMovedPermanently, url.LongUrl)
	})

	router.Run("localhost:8000")
}

func getUrl(id string, db *sql.DB) UrlId {
	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}
	stmt, err := tx.Prepare("select * from url where id = ?")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	var url UrlId
	err = stmt.QueryRow(id).Scan(&url.Id, &url.LongUrl, &url.Code)
	if err != nil {
		log.Fatal(err)
	}
	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
	}
	return url
}
