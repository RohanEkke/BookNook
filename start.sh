#!/bin/sh

cd "$(dirname "$0")"

echo "Current directory:"
pwd

echo "Project files:"
ls -la

echo "Running database migrations..."

./.venv/bin/python manage.py migrate --noinput

if [ $? -ne 0 ]; then
    echo "Database migrations failed!"
    exit 1
fi

echo "Collecting static files..."

./.venv/bin/python manage.py collectstatic --noinput

echo "Starting Gunicorn..."

exec ./.venv/bin/python -m gunicorn bookstore_main.wsgi:application --bind 0.0.0.0:$PORT --access-logfile - --error-logfile - --capture-output --log-level debug