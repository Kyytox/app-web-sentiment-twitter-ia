<div id="header" align="center">
  <h3>web interface to analyze the sentiment of tweets from twitter users</h3>
  <br>
  <img src="https://img.shields.io/static/v1?label=&message=IA&color=red"/>
  <img src="https://img.shields.io/static/v1?label=&message=NLP&color=yellow"/>
  <img src="https://img.shields.io/static/v1?label=&message=Twitter-API-v2&color=blue"/>
  <img src="https://img.shields.io/static/v1?label=&message=Python&color=red"/>
  <img src="https://img.shields.io/static/v1?label=&message=JavaScript&color=yellowgreen"/>
  <img src="https://img.shields.io/static/v1?label=&message=React&color=blue"/>
  <img src="https://img.shields.io/static/v1?label=&message=Flask&color=lightgrey"/>
  <img src="https://img.shields.io/static/v1?label=&message=PostgreSQL&color=blue"/>
  <br>
  <br>
</div>
<p align="center">
  <img src="https://github.com/Kyytox/app-web-sentiment-twitter-ia/blob/master/ressources/Twitter-Sentiments-app.gif" alt="animated" />
</p>

<div align="center">
  <li>Breakdown of tweets by sentiment</li>
  <li>Number of tweets by sentiment</li>
  <li>Number of tweets per sentiment by month</li>
  <li>distribution of the different interactions by sentiments</li>
  <li>WordCloud of frequents words</li>
  <li>Exemple of Negative, Neutral , Positive tweets</li> 
</div>

<br><br>

<hr>

# Install APP

clone repo Github

```
git clone https://github.com/Kyytox/app-web-sentiment-twitter-ia.git
```

<br><br>

<hr>

# Model IA

### install Torch

```
cd app-web-sentiment-twitter-ia
cd backend/
source env/Scripts/activate

pip3 install torch torchvision torchaudio
```

### download file necessary for model IA

There Files are too large for github, so go download there

go on this page ==> Download pytorch_model.bin
<br>
https://huggingface.co/cardiffnlp/twitter-xlm-roberta-base-sentiment/blob/main/pytorch_model.bin
<br><br>

go on this page ==> Download tf_model.h5
<br>
https://huggingface.co/xlm-roberta-base/blob/main/tf_model.h5
<br>

Put files DL in folder

```
app-web-sentiment-twitter-ia/backend/cardiffnlp/twitter-xlm-roberta-base-sentiment
```

<br><br><br>

<hr>

# BD postgreSQL

## create .env for connect to BD

create file .env in folder backend/

```
touch .env
```

<br>
add infos of BD connection

```
# BD infos connexion
DB_NAME = 'tweets_sentiments'
DB_USERNAME = 'user of BD'
DB_PASSWORD = 'password BD'
```

<br>

## Create BD with PostgreSQL

install PostgreSQL
https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/

```
open SQL Shell (psql)

CREATE DATABASE tweets_sentiments;
```

<br>

## Create table tweets && Insert data

with init_bd.py :

-   create table tweets
-   insert data tweets_bd.csv in table tweets

```
python init_bd.py
```

<br><br><br>

<hr>

# Twitter API v2

open file .env in folder backend/ <br>
Add this line for connect Twitter API v2

```
# token for use twitter API v2
BEARER_TOKEN = 'BEARER_TOKEN of twitter API v2'
```

<br><br><br>

<hr>

# Launch APP

## Backend

```
cd backend
source venv\Scripts\activate

export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```

#### Desactivate download of fr_core_news_sm

when backend is launch got to frequents_words.py in folder backend/
<br>
comment lines 11 - 12
<br>
to avoid downloads at each launch

```
spacy.cli.download("fr_core_news_sm")
nltk.download('stopwords')
```

## Fronted

install packages

```
cd fronted
npm install
```

launch APP

```
npm start
```


<br><br>
Enjoy
