# Stage 1: Use an official Python runtime as a parent image
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /code

# Install dependencies
# Copy only requirements first to leverage Docker cache
COPY requirements.txt /code/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 2: Copy application code
FROM base AS final
RUN useradd -m appuser
WORKDIR /code
COPY ./app /code/app 
RUN chown -R appuser:appuser /code
USER appuser
# Expose the port the app runs on (uvicorn default is 8000, but you use 5000)
EXPOSE 8000

# Define the command to run your app using uvicorn
# Use 0.0.0.0 to listen on all interfaces within the container
# Use app.main:app, assuming your FastAPI instance 'app' is in app/main.py
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]