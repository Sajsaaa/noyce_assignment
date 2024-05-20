# NOYCE ASSIGNMENT


## Installation BACKEND

### Prerequisites

- Python 3.x
- PostgreSQL
- Poetry

### Setting Up the Development Environment


1. **Create a virtual environment:**

    ```bash
    python3 -m venv venv
    ```

2. **Activate the virtual environment:**

    - On macOS/Linux:

        ```bash
        source venv/bin/activate
        ```

    - On Windows:

        ```bash
        .\venv\Scripts\activate
        ```

3. **Install the dependencies:**

    ```bash
    poetry install
    ```

4. **Set up the PostgreSQL database:**

    - Create a database config and dump data in it and choe the config as following

    ```env
    postgresql+psycopg2://postgres:postgres@localhost:5432/noyce
    ```

## Usage

1. **Run the FastAPI application:**

    ```bash
    uvicorn app.main:app --reload
    ```

2. **Access the API documentation:**

    - Open your browser and go to `http://127.0.0.1:8000/docs` for the interactive Swagger UI.
    - Alternatively, go to `http://127.0.0.1:8000/redoc` for the ReDoc documentation.


## Installation FrontEnd

### Prerequisites

- Node.js & npm

**Navigate to the project and Install the dependencies**

    ```bash
    npm install
    ```

## Usage

1. **Run the application:**

    ```bash
    npm start
    ```



