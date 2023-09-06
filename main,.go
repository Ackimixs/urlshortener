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
	LongUrl string `json:"longUrl" binding:"required"`
	Code    string `json:"code" binding:"required"`
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
	create table url (long_url text not null primary key, code text not null);
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
		code := c.Query("code")
		longUrl := c.Query("longUrl")

		if code == "" && longUrl == "" {
			rows, err := db.Query("select long_url, code from url")
			if err != nil {
				log.Fatal(err)
				c.JSON(http.StatusNotFound, gin.H{
					"message": "Not found",
				})
			}
			defer rows.Close()
			var urls []Url
			for rows.Next() {
				var url Url
				err = rows.Scan(&url.LongUrl, &url.Code)
				if err != nil {
					log.Fatal(err)
					c.JSON(http.StatusNotFound, gin.H{
						"message": "Not found",
					})
				}
				urls = append(urls, url)
			}
			err = rows.Err()
			if err != nil {
				log.Fatal(err)
				c.JSON(http.StatusNotFound, gin.H{
					"message": "Not found",
				})
			}
			c.JSON(http.StatusOK, gin.H{
				"body": gin.H{
					"url": urls,
				},
			})

			return
		} else if code == "" {
			rows, err := db.Query("select long_url, code from url where long_url = ?", longUrl)
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
			c.JSON(http.StatusOK, gin.H{
				"body": gin.H{
					"url": []Url{url},
				},
			})
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Not found",
			})
			return
		} else if longUrl == "" {
			rows, err := db.Query("select long_url, code from url where code = ?", code)
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
			c.JSON(http.StatusOK, gin.H{
				"body": gin.H{
					"url": []Url{url},
				},
			})
			c.JSON(http.StatusNotFound, gin.H{
				"message": "Not found",
			})
			return
		} else {
			var url Url
			rows, err := db.Query("select long_url, code from url where code = ? && long_url = ?", code, longUrl)
			if err != nil {
				log.Fatal(err)
				c.JSON(http.StatusNotFound, gin.H{
					"message": "Not found",
				})
			}
			defer rows.Close()
			rows.Next()
			err = rows.Scan(&url.LongUrl, &url.Code)
			if err != nil {
				log.Fatal(err)
				c.JSON(http.StatusNotFound, gin.H{
					"message": "Not found",
				})
			}
			c.JSON(http.StatusOK, gin.H{
				"body": gin.H{
					"url": []Url{url},
				},
			})
			return
		}
	})

	router.POST("/api/url", func(c *gin.Context) {
		body := Url{}

		if err := c.BindJSON(&body); err != nil {
			c.AbortWithError(http.StatusBadRequest, err)
			return
		}

		// post in the database
		tx, err := db.Begin()
		if err != nil {
			log.Fatal(err)
		}
		stmt, err := tx.Prepare("insert into url(long_url, code) values(?, ?)")
		if err != nil {
			log.Fatal(err)
		}
		defer stmt.Close()
		_, err = stmt.Exec(body.LongUrl, body.Code)
		err = tx.Commit()
		if err != nil {
			log.Fatal(err)
		}

		c.JSON(http.StatusAccepted, gin.H{
			"body": gin.H{
				"url": body,
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

	router.Run("localhost:8080")
}
