import os
import psycopg2
from dotenv import load_dotenv
from sqlalchemy import create_engine
import pandas as pd

load_dotenv()

# collect infos connection for BD
BD_USER = os.getenv('DB_USERNAME')
BD_PSW = os.getenv('DB_PASSWORD')

# open connection with BD
conn = psycopg2.connect(
    f"dbname=tweets_sentiments user={BD_USER} password={BD_PSW}")


# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS tweets;')
cur.execute('CREATE TABLE tweets (id serial PRIMARY KEY,'
            'sentiment VARCHAR,'
            'score FLOAT(4),'
            'negative FLOAT(4),'
            'neutral FLOAT(4),'
            'positive FLOAT(4),'
            'id_user BIGINT,'
            'name_user VARCHAR,'
            'id_tweet BIGINT,'
            'text_tweet text,'
            'date_tweet TIMESTAMP,'
            'nb_interactions INT,'
            'retweet_count INT,'
            'reply_count INT,'
            'like_count INT,'
            'quote_count INT);'
            )


conn.commit()
cur.close()


engine = create_engine(
    f"postgresql://{BD_USER}:{BD_PSW}@localhost:5432/tweets_sentiments")


df = pd.read_csv('tweets_db.csv', low_memory=False)

try:
    df.to_sql('tweets', engine, if_exists='append', index=False)
except Exception:
    print("Sorry, some error has occurred!")
finally:
    engine.dispose()


conn.close()
