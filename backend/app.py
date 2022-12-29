# Init functions of other file
from get_data_charts import get_nb_tweets_sentiments, get_nb_tweets_month_sentiments, get_number_interactions
from connect_BD import get_db_connection
from frequent_words import get_frequent_words

import numpy as np
import tweepy
import os
import pandas as pd
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from sqlalchemy import create_engine

from transformers import AutoTokenizer, AutoConfig, AutoModelForSequenceClassification
from scipy.special import softmax


load_dotenv()

# initialize Model
MODEL = "cardiffnlp/twitter-xlm-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)
model.save_pretrained(MODEL)
config = AutoConfig.from_pretrained(MODEL)

app = Flask(__name__)
BEARER_TOKEN = os.getenv('BEARER_TOKEN')
BD_PSW = os.getenv('DB_PASSWORD')

# Initialization Tweepy for use Twitter APi v2
client = tweepy.Client(bearer_token=BEARER_TOKEN)


# remove specific caract usefull for help IA
def format_text(text):
    text = text.lower()
    text = text.replace('\n', ' ').replace('\r', '')

    new_text = []
    for t in text.split(" "):
        t = '@user' if t.startswith('@') and len(t) > 1 else t
        t = 'http' if t.startswith('http') else t
        new_text.append(t)

    return " ".join(new_text)


# Determine sentiment of text send by user
@app.route('/get_sentiment_text/', methods=['GET'])
def get_sentiment_text():

    text = request.args.get('text')

    # formated text for best detection by IA
    text_formated = format_text(text)

    # detect Text sentiment
    encoded_input = tokenizer(text_formated, return_tensors='pt')
    output = model(**encoded_input)
    scores = output[0][0].detach().numpy()

    # Format outup : [Negative - Neutral - Positive]
    scores = softmax(scores)

    # Collect the max score and the sentment
    ranking = np.argsort(scores)
    ranking = ranking[::-1]

    l = config.id2label[ranking[0]]
    s = scores[ranking[0]]
    st_score = np.round(float(s), 3)
    score_neg = np.round(float(scores[0]), 3)
    score_neu = np.round(float(scores[1]), 3)
    score_pos = np.round(float(scores[2]), 3)

    return [
        {
            'sentiment': l,
            'score': st_score,
            'negative': score_neg,
            'neutral': score_neu,
            'positive': score_pos,
        }
    ]


# get tweets user and use IA for detect sentiments and get data for graph
@app.route('/get_tweets_user/<string:idUser>/<string:name>', methods=['GET'])
def get_tweets_user(idUser, name):

    # Open conncetion with BD
    conn = get_db_connection()
    engine = create_engine(
        f"postgresql://postgres:{BD_PSW}@localhost:5432/tweets_sentiments")

    cur = conn.cursor()

    # # create dataFrame with columns
    df = pd.DataFrame(columns=['sentiment', 'score', 'negative', 'neutral', 'positive', 'id_user', 'name_user', 'id_tweet',
                               'text_tweet', 'date_tweet', 'nb_interactions', 'retweet_count', 'reply_count', 'like_count', 'quote_count'])

    # retrieve the most recent id tweet of users
    cur.execute(
        "SELECT id_tweet FROM tweets WHERE id_user=%s ORDER BY date_tweet DESC LIMIT %s;", (idUser, 1,))

    last_id_tweet = cur.fetchone()

    if last_id_tweet is None:
        # user don't have tweets in BD
        # # Retrive maximum tweets of users (max 3200)
        tweets = tweepy.Paginator(client.get_users_tweets, idUser, max_results=100, tweet_fields=[
            'created_at', 'public_metrics', 'in_reply_to_user_id', 'referenced_tweets'], expansions=['author_id'], limit=33)
    else:
        # User exist in BD
        # Retrive maximum tweets of users since id retrieve (max 3200)
        tweets = tweepy.Paginator(client.get_users_tweets, idUser, since_id=last_id_tweet[0], max_results=100, tweet_fields=[
            'created_at', 'public_metrics', 'in_reply_to_user_id', 'referenced_tweets'], expansions=['author_id'], limit=33)

    for tweet in tweets:
        if tweet.data != None:
            for x in tweet.data:
                # remove retweets and replies
                if x.in_reply_to_user_id is None and x.referenced_tweets is None:
                    # formated text for best detection by IA
                    text_formated = format_text(x.text)

                    # detect Text sentiment
                    encoded_input = tokenizer(
                        text_formated, return_tensors='pt')
                    output = model(**encoded_input)
                    scores = output[0][0].detach().numpy()

                    # Format outup : [Negative - Neutral - Positive]
                    scores = softmax(scores)

                    # Collect the max score and the sentment
                    ranking = np.argsort(scores)
                    ranking = ranking[::-1]

                    l = config.id2label[ranking[0]]
                    s = scores[ranking[0]]
                    st_score = np.round(float(s), 3)

                    # Retrieve Metrics , interactions
                    nb_inter = 0
                    retweet_count = x.public_metrics['retweet_count']
                    reply_count = x.public_metrics['reply_count']
                    like_count = x.public_metrics['like_count']
                    quote_count = x.public_metrics['quote_count']
                    nb_inter = retweet_count + reply_count + like_count + quote_count

                    # insert in DataFrame
                    df = df.append({'sentiment': l, 'score': st_score, 'negative': scores[0], 'neutral': scores[1], 'positive': scores[2], 'id_user': idUser, 'name_user': name, 'id_tweet': x.id, 'text_tweet': x.text, 'date_tweet': x.created_at,
                                                    'nb_interactions': nb_inter, 'retweet_count': retweet_count, 'reply_count': reply_count, 'like_count': like_count, 'quote_count': quote_count}, ignore_index=True)

    # insert in BD in table tweets
    df.to_sql("tweets", engine, if_exists='append', index=False)

    # Data number of tweets by sentiment for pie and bar chart
    list_nb_tweets_sentiment = get_nb_tweets_sentiments(idUser)

    # get number twets by sentiments by month for bar month chart
    list_nb_tweets_month = get_nb_tweets_month_sentiments(idUser)

    # Data number interactions chart
    result_interactions = get_number_interactions(idUser)
    list_nb_interactions_radiant = result_interactions[0]
    list_nb_interactions_circular = result_interactions[1]
    nb_tweets_interactions = result_interactions[2]

    # Data frequent words
    list_frequent_words = get_frequent_words(idUser)

    # list 50 tweets Negative, Neutral, Positive
    list_tweets_sentiments = get_list_tweets(idUser)

    cur.close()
    conn.close()

    return [list_nb_tweets_sentiment, list_nb_tweets_month, list_nb_interactions_radiant, list_nb_interactions_circular, nb_tweets_interactions, list_frequent_words, list_tweets_sentiments]


# get 50 tweets Negative, Neutral, Positive for display for examples
def get_list_tweets(idUser):

    # Open conncetion with BD
    conn = get_db_connection()
    cur = conn.cursor()

    # retrieve 50 tweets negative of users for exemples
    cur.execute(
        "SELECT text_tweet, date_tweet FROM tweets WHERE id_user=%s AND sentiment='Negative' ORDER BY RANDOM() LIMIT %s;", (idUser, 50,))
    list_tweets_nega = cur.fetchall()

    # retrieve 50 tweets neutral of users for exemples
    cur.execute(
        "SELECT text_tweet, date_tweet FROM tweets WHERE id_user=%s AND sentiment='Neutral' ORDER BY RANDOM() LIMIT %s;", (idUser, 50,))
    list_tweets_neut = cur.fetchall()

    # retrieve 50 tweets positive of users for exemples
    cur.execute(
        "SELECT text_tweet, date_tweet FROM tweets WHERE id_user=%s AND sentiment='Positive' ORDER BY RANDOM() LIMIT %s;", (idUser, 50,))
    list_tweets_posi = cur.fetchall()

    cur.close()
    conn.close()
    return [list_tweets_nega, list_tweets_neut, list_tweets_posi]


# Retreive wit hTwitter API user infos
@app.route('/userName/<string:name>', methods=['GET'])
def get_user_id(name):

    # retrieve user infos with name in param
    res = client.get_user(username=name, user_fields=[
        'created_at', 'location', 'description', 'profile_image_url', 'public_metrics', 'url', 'verified'])

    # retrun error detail or Id user
    if res.data is None:
        # Error with details
        return jsonify(res.errors[0]['detail'])
    else:
        # user exists in BD retrieve

        # get_tweets_user(res.data.id, name)
        return ["user exist", str(res.data.id), name,
                res.data.location,
                res.data.created_at,
                res.data.description,
                res.data.profile_image_url,
                res.data.public_metrics,
                res.data.url,
                res.data.verified]


# retrieve all users presents in the BD
@app.route('/userInBD', methods=['GET'])
def userInBD():
    # Open conncetion with BD
    print('test')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT distinct(name_user), id_user FROM tweets;")

    listUserBD = cur.fetchall()

    listUsers = [{'name': user[0], 'id': str(user[1])} for user in listUserBD]
    cur.close()
    conn.close()

    return listUsers


if __name__ == '__main__':
    app.run(debug=True)
