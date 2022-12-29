# Install APP

clone repo Github

```
git clone https://github.com/Kyytox/app-web-sentiment-twitter-ia.git
```

### install Torch

```
cd app-web-sentiment-twitter-ia
cd backend/
source env/Scripts/activate
pip3 install torch torchvision torchaudio
```

### download file necessary for model IA

There Files are too large for github, so go download there

go on this page
https://huggingface.co/cardiffnlp/twitter-xlm-roberta-base-sentiment/blob/main/pytorch_model.bin

Download pytorch_model.bin and put it in folder
app-web-sentiment-twitter-ia/backend/cardiffnlp/twitter-xlm-roberta-base-sentiment

go on this page
https://huggingface.co/xlm-roberta-base/blob/main/tf_model.h5

Download tf_model.h5 and put it in folder
app-web-sentiment-twitter-ia/backend/cardiffnlp/twitter-xlm-roberta-base-sentiment

## BD postgreSQL

### create .env for connect to BD

create file .env in folder backend/

```
cd backend/
touch .env
```

add in this file there infos

```
# BD infos connexion
DB_USERNAME = 'user of BD'
DB_PASSWORD = 'password BD'
```

### Create BD with PostgreSQL

install PostgreSQL
https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/

open SQL Shell (psql)

```
open SQL Shell (psql)

CREATE DATABASE tweets_sentiments;
```

### Create table tweets && Insert data

with init_bd.py :

-   create table tweets
-   insert data tweets_bd.csv in table tweets

```
cd backend/

python init_bd.py
```

## Twitter API v2

open file .env in folder backend/
Add this line for connect Twitter API v2

```
# token for use twitter API v2
BEARER_TOKEN = 'BEARER_TOKEN of twitter API v2'
```

## Launch Backend

```
cd backend
source venv\Scripts\activate
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```

## Launch Fronted

install packages

```
cd fronted
npm install
```

launch APP

```
npm start
```
