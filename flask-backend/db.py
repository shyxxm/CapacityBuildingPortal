# db.py

import psycopg2
import time

cnx = None

def connect_to_database():
    global cnx
    start_time = time.time()
    while True:
        try:
            # Establish database connection
            cnx = psycopg2.connect(user="ammachipostgredb",
                                   password="Jaima@Singapore270953",
                                   host="ammachipostgredb.postgres.database.azure.com",
                                   port=5432,
                                   database="mypgsqldb")
            print("Database connection successful")
            break
        except Exception as e:
            if time.time() - start_time >= 120:  # Timeout after 2 minutes
                print("Database connection failed:", e)
                break
            time.sleep(1)  # Retry every 1 second

# Attempt to connect to the database for 2 minutes
connect_to_database()
