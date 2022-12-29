from connect_BD import get_db_connection


# Caulc pourcent of tweets Negative, Neutral, Positive
def pourcentage(val1, val2, val3):
    # Calcul total
    total = val1 + val2 + val3

    # Calcul pourcent
    pourcent1 = round((val1 / total) * 100, 1)
    pourcent2 = round((val2 / total) * 100, 1)
    pourcent3 = round((val3 / total) * 100, 1)

    return pourcent1, pourcent2, pourcent3


# Retrieve data for Pie and bar Grap
# Number of tweets by sentiments
def get_nb_tweets_sentiments(idUser):

    # Open conncetion with BD
    conn = get_db_connection()
    cur = conn.cursor()

    # retrieve the most recent id tweet of users
    cur.execute(
        "SELECT count(*) FROM tweets WHERE id_user=%s and sentiment = 'Neutral';", (idUser,))
    nb_tweets_neutral = cur.fetchone()

    # retrieve the most recent id tweet of users
    cur.execute(
        "SELECT count(*) FROM tweets WHERE id_user=%s and sentiment = 'Negative';", (idUser,))
    nb_tweets_negative = cur.fetchone()

    # retrieve the most recent id tweet of users
    cur.execute(
        "SELECT count(*) FROM tweets WHERE id_user=%s and sentiment = 'Positive';", (idUser,))
    nb_tweets_positive = cur.fetchone()

    cur.close()
    conn.close()

    # Pourcent of tweets by sentiments
    pourc_tweets_negative, pourc_tweets_neutral, pourc_tweets_positive = pourcentage(
        nb_tweets_negative[0], nb_tweets_neutral[0], nb_tweets_positive[0])

    return [{
            'id': "Negative",
            'label': "Negative",
            'value': nb_tweets_negative[0],
            'pourcent': pourc_tweets_negative,
            },
            {
        'id': "Neutral",
        'label': "Neutral",
        'value': nb_tweets_neutral[0],
        'pourcent': pourc_tweets_neutral,
    },
        {
        'id': "Positive",
        'label': "Positive",
        'value': nb_tweets_positive[0],
        'pourcent': pourc_tweets_positive,
    },
    ]


# retrive number tweets by month
def get_nb_tweets_month_sentiments(idUser):

    # Open conncetion with BD
    conn = get_db_connection()
    cur = conn.cursor()

    # retrieve sum of tweets by month
    cur.execute("((SELECT sentiment, COUNT(*) AS tweet_count, date_part('month', date_tweet) AS tweet_month,  date_part('year', date_tweet) AS tweet_year FROM tweets WHERE id_user=%s AND sentiment='Negative' GROUP BY tweet_month, tweet_year, sentiment ORDER BY tweet_year, tweet_month) UNION (SELECT sentiment, COUNT(*) AS tweet_count, date_part('month', date_tweet) AS tweet_month,  date_part('year', date_tweet) AS tweet_year FROM tweets WHERE id_user=%s AND sentiment='Positive' GROUP BY tweet_month, tweet_year, sentiment ORDER BY tweet_year, tweet_month) UNION (SELECT sentiment, COUNT(*) AS tweet_count, date_part('month', date_tweet) AS tweet_month,  date_part('year', date_tweet) AS tweet_year FROM tweets WHERE id_user=%s AND sentiment='Neutral' GROUP BY tweet_month, tweet_year, sentiment ORDER BY tweet_year, tweet_month) Order by tweet_year, tweet_month, sentiment)", (idUser, idUser, idUser,))

    cur_result = cur.fetchall()

    # get list of numbers of tweets by sentiments by month
    list_nb_tweet_month = get_list_nb_tweets(cur_result)

    cur.close()
    conn.close()

    return list_nb_tweet_month


# fill list_nb_tweet_month with date(month-year, number tweets)
def get_list_nb_tweets(cur_result):

    list_nb_tweets = []
    dict_temp = {}
    sauv_month, sauv_year = 0, 0

    for index, data in enumerate(cur_result):
        sentiment, nb_tweets, month, year = data

        if sauv_month == 0 and sauv_year == 0:
            # it's the first value for this date
            sauv_month = int(month)
            sauv_year = int(year)
            dict_temp = {
                'date': f"{int(month)}-{int(year)}", sentiment: nb_tweets}
        elif int(month) == sauv_month and int(year) == sauv_year:
            # there is already an element for this date so we just add the feeling
            dict_temp[sentiment] = nb_tweets

            # dict is full, all sentiments are in
            if len(dict_temp) == 4:
                list_nb_tweets.append(dict_temp)
                sauv_month, sauv_year = 0, 0
                dict_temp = {}

        # it's a new date append dict and initialize variables
        else:
            list_nb_tweets.append(dict_temp)
            dict_temp = {
                'date': f"{int(month)}-{int(year)}", sentiment: nb_tweets}
            sauv_month = int(month)
            sauv_year = int(year)

        # Last item, verif if all feelings is in dict_temp
        if index == len(cur_result):
            list_nb_tweets.append(dict_temp)

    return list_nb_tweets


# Data number interactions for Radiant, Circular Chart
def get_number_interactions(idUser):

    # Open conncetion with BD
    conn = get_db_connection()
    cur = conn.cursor()

    # retrieve the minimun number of tweets by sentiment
    # we recover this number to be able to recover the same number of tweets for there 3 sentiments, to account for their number of interactions
    cur.execute("SELECT MIN(num_tweets) FROM(SELECT sentiment, COUNT(*) AS num_tweets FROM tweets WHERE sentiment IN('Negative', 'Neutral', 'Positive') AND id_user=%s GROUP BY sentiment) AS counts GROUP BY num_tweets, sentiment", (idUser,))

    min_number_tweets = cur.fetchone()

    # Number of interactions of tweets Negaive for idUser with a limit define by min_number_tweets
    cur.execute("SELECT SUM(nb_interactions),SUM(like_count), SUM(reply_count), SUM(retweet_count), SUM(quote_count) FROM(SELECT * FROM tweets WHERE sentiment='Negative' AND id_user=%s ORDER BY RANDOM() LIMIT %s) as random_tweets GROUP BY id_user HAVING COUNT(*) > 0", (idUser, min_number_tweets,))
    nb_interaction_negative = cur.fetchone()

    # Number of interactions of tweets Neutral for idUser with a limit define by min_number_tweets
    cur.execute("SELECT SUM(nb_interactions),SUM(like_count), SUM(reply_count), SUM(retweet_count), SUM(quote_count) FROM(SELECT * FROM tweets WHERE sentiment='Neutral' AND id_user=%s ORDER BY RANDOM() LIMIT %s) as random_tweets GROUP BY id_user HAVING COUNT(*) > 0", (idUser, min_number_tweets,))
    nb_interaction_neutral = cur.fetchone()

    # Number of interactions of tweets Positive for idUser with a limit define by min_number_tweets
    cur.execute("SELECT SUM(nb_interactions),SUM(like_count), SUM(reply_count), SUM(retweet_count), SUM(quote_count) FROM(SELECT * FROM tweets WHERE sentiment='Positive' AND id_user=%s ORDER BY RANDOM() LIMIT %s) as random_tweets GROUP BY id_user HAVING COUNT(*) > 0", (idUser, min_number_tweets,))
    nb_interaction_positive = cur.fetchone()

    list_nb_interactions_radiant = [
        {'id': "Negative", 'data': [{'x': "Likes", 'y': nb_interaction_negative[1], }, {'x': "Replies", 'y': nb_interaction_negative[2], }, {
            'x': "Retweets", 'y': nb_interaction_negative[3], }, {'x': "Quotes", 'y': nb_interaction_negative[4], }, ], },
        {'id': "Neutral", 'data': [{'x': "Likes", 'y': nb_interaction_neutral[1], }, {'x': "Replies", 'y': nb_interaction_neutral[2], }, {
            'x': "Retweets", 'y': nb_interaction_neutral[3], }, {'x': "Quotes", 'y': nb_interaction_neutral[4], }, ], },
        {'id': "Positive", 'data': [{'x': "Likes", 'y': nb_interaction_positive[1], }, {'x': "Replies", 'y': nb_interaction_positive[2], }, {
            'x': "Retweets", 'y': nb_interaction_positive[3], }, {'x': "Quotes", 'y': nb_interaction_positive[4], }, ], }, ]

    list_nb_interactions_circular = {'name': "Number of interactions by feelings", 'children': [
        {'name': "Negative", 'children': [
            {'name': "Likes",
             'loc': nb_interaction_negative[1], },
            {'name': "Replies",
             'loc': nb_interaction_negative[2], },
            {'name': "Retweets",
             'loc': nb_interaction_negative[3], },
            {'name': "Quotes", 'loc': nb_interaction_negative[4], }, ], },
        {'name': "Neutral", 'children': [
            {'name': "Likes",
             'loc': nb_interaction_neutral[1], },
            {'name': "Replies",
             'loc': nb_interaction_neutral[2], },
            {'name': "Retweets",
             'loc': nb_interaction_neutral[3], },
            {'name': "Quotes", 'loc': nb_interaction_neutral[4], }, ], },
        {'name': "Positive", 'children': [
            {'name': "Likes",
             'loc': nb_interaction_positive[1], },
            {'name': "Replies",
             'loc': nb_interaction_positive[2], },
            {'name': "Retweets",
             'loc': nb_interaction_positive[3], },
            {'name': "Quotes", 'loc': nb_interaction_positive[4], }, ], },
    ], }

    cur.close()
    conn.close()
    return [list_nb_interactions_radiant, list_nb_interactions_circular, min_number_tweets]
