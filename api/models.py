from django.db import models


class Url(models.Model):
    code = models.CharField(max_length=100, unique=True)
    long_url = models.CharField(max_length=2000)

    def __str__(self):
        return f"{self.code} -> {self.long_url}"
