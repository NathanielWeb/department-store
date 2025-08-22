FROM python:3.11
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    build-essential \
    libssl-dev

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
# Copy all of the files to the app directory
COPY . /app
