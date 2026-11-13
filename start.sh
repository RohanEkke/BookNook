
#!/bin/sh
set -e

cd "$(dirname "$0")"

echo "=================================="
echo "Building React frontend..."
echo "=================================="

# Check Node.js and npm
node --version
npm --version

# Build React frontend
cd frontend/bookstore
npm install --no-audit --no-fund


# Return to Django project root
cd ../..

echo "=================================="
echo "Running Django migrations..."
echo "=================================="

./.venv/bin/python manage.py migrate --noinput

echo "=================================="
echo "Collecting static files..."
echo "=================================="

./.venv/bin/python manage.py collectstatic --noinput

echo "=================================="
echo "Starting Gunicorn..."
echo "=================================="

exec ./.venv/bin/python -m gunicorn bookstore_main.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --access-logfile - \
    --error-logfile - \
    --capture-output \
    --log-level debug
