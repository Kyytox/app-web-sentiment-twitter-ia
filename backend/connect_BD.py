import psycopg2
import os


# collect infos connection for BD
BD_NAME = os.getenv('DB_NAME')
BD_USER = os.getenv('DB_USERNAME')
BD_PSW = os.getenv('DB_PASSWORD')


# get Bd connection
def get_db_connection():
    return psycopg2.connect(f"dbname={BD_NAME} user={BD_USER} password={BD_PSW}")
