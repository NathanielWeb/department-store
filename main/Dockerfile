FROM python:3.11
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    build-essential \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*
# The final command is to avoid having multiple package lists (one for each new layer)

WORKDIR /app

COPY main/requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
# Copy all of the files to the app directory
COPY main/ /app

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8080"]