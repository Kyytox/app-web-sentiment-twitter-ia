from connect_BD import get_db_connection
import re
import pandas as pd
import spacy
import spacy.cli
from nltk.corpus import stopwords
import nltk


# DL frequent words FR
# spacy.cli.download("fr_core_news_sm")
# nltk.download('stopwords')
nlp = spacy.load("fr_core_news_sm")
stopWords = set(stopwords.words('french'))


def format_text_freq_words(text):
    # remove alla caract usefull for help textBlob
    text = text.lower()
    text = text.replace('\n', ' ').replace('\r', '')
    text = ' '.join(text.split())
    text = re.sub(r"[A-Za-z\.]*[0-9]+[A-Za-z%°\.]*", "", text)
    text = re.sub(r"(\s\-\s|-$)", "", text)
    text = re.sub(r"[?\%\(\)\/\|\"]", "", text)
    text = re.sub(r"\&\S*\s", "", text)
    text = re.sub(r"\&", "", text)
    text = re.sub(r"\+", "", text)
    text = re.sub(r"\#", "", text)
    text = re.sub(r"\$", "", text)
    text = re.sub(r"\£", "", text)
    text = re.sub(r"\%", "", text)
    text = re.sub(r"\:", "", text)
    text = re.sub(r"\@", "", text)
    text = re.sub(r"\-", "", text)
    text = re.sub(r"httpst.co", "", text)

    return text


# Tokenise sentence
def token_text(sentence):
    doc = nlp(sentence)
    return [X.text for X in doc]


# # collect fréquents words in tweets
def get_frequent_words(idUser):

    list_freq_words_fr = ["oeclfybyif", "agindre", "après", "plus", "ans", "qu'", "qu’", "...", "avoir", "deux", "fait", "selon", "faire", "cette", "entre", "veut", "être", "tout", "depuis", "trois", "moins", "très", "lors", "mois", "avant", "sans", "faut", "cet", "peut", "près", "chez", "jusqu'",
                          "sous", "vers", "mis", "tous", "soir", "vais", "dit", "comme", "mecredi", "janvier", "toutes", "fois", "devant", "sait", "pendant", "leurs", "leur", "vont", "dont", "malgré", "quand", "quoi", "quel", "met", "doit", "mardi", "demain", "déjà", "dés", "toute", "trop", "lundi", "peux"]

    # Open conncetion with BD
    conn = get_db_connection()
    cur = conn.cursor()

    # retrieve the most recent id tweet of users
    cur.execute(
        "SELECT text_tweet FROM tweets WHERE id_user=%s", (idUser,))

    list_tweets = cur.fetchall()

    dict_words = {}

    for text in list_tweets:
        format_text = format_text_freq_words(text[0])
        # print('format_text :', format_text)

        # Remove frequents words FR with stopWords
        clean_words = [token for token in token_text(
            format_text) if token not in stopWords]

        list_words = [word for word in clean_words if len(
            word) > 2 and word not in list_freq_words_fr]

        # sum duplicate words and add it in dict
        for x in list_words:
            if x in dict_words:
                dict_words[x] += 1
            else:
                dict_words[x] = 1

    df_words = pd.DataFrame(dict_words.items(), columns=[
                            'text', 'value'])

    # df_words = df_words[df_words['Nb occurences'] > 1]
    list_frequent_words = df_words.sort_values(
        by='value', ascending=False).head(150).to_dict('records')

    cur.close()
    conn.close()

    return list_frequent_words
