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



![image](https://user-images.githubusercontent.com/96888096/210032945-b5dcdab2-42d6-4748-9801-8955f468492f.png)
![image](https://user-images.githubusercontent.com/96888096/210032979-fe26a9f5-5ba2-4909-9853-7e99a05cbe75.png)
![image](https://user-images.githubusercontent.com/96888096/210032989-3e0ad1ad-7d86-4323-9982-8fb8fee5dc61.png)




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
