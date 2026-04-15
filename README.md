# Project Management Tool

## Features
1.JWT-based User Authentication: Secure email/password login flow using `rest_framework_simplejwt`.
2.Project Control: Full CRUD operations over dynamic projects, guarded tightly to ensure users only see their own.
3.Task Tracking: Granular task assignments under distinct projects. Real-time status labeling (To-Do, In-Progress, Done) and due date tracking.
4.Interactive Dashboard UI: Built with **Tailwind CSS**, featuring beautiful glassmorphism designs, hover states, and fully responsive typography.
5.Robust Form Handling: All project and task mutations are flawlessly handled and validated via **React Hook Form**.
6.Search & Pagination: The dashboard elegantly lists projects with Next/Previous pagination and real-time Search querying.


## Prerequisites
- **Python:** `3.10+`
- **Node.js:** `18.0+`
- SQLite comes native with Python for default rapid development.


## Setup Instructions

### 1. Backend Setup (Django)

1. Navigate to the backend directory:
   Create backend
   cd backend
   
2. Create and activate a virtual environment:
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   
3. Install dependencies:
   pip install -r requirements.txt
   
4. Configure Environment Variables:
   Create a `.env` file in the same directory as `settings.py` (optional for local, but recommended for prod):
   ```env
   # Example .env config
   DEBUG=True
   SECRET_KEY=your_django_secret_key_here
   CORS_ALLOW_ALL_ORIGINS=True
   ```
5. Apply Migrations to build the Database schemas:

   python manage.py makemigrations
   python manage.py migrate
   
6. Start the server:

   python manage.py runserver
   *(Runs securely on http://127.0.0.1:8000/)*

### 2. Frontend Setup (React)

1. Open a new terminal and navigate to the frontend directory:
   Create frontend
   Cd frontend
   
2. Install NodeJS Dependencies (`react-router-dom`, `tailwindcss`, `react-hook-form`, `axios`):
   npm install
   
3. Start the development server:
   npm start
   *(Running locally on http://localhost:3000)*


## Seed Script Instructions
To populate your environment with test data seamlessly without manually clicking around, you can use the built-in seed script:

1. Ensure your backend virtual environment is active.
2. In the `backend/backend` directory run:
   bash
   python manage.py shell < seed.py

*(You can create a `seed.py` file copying standard ORM creation strings if none exists natively).*


## API Endpoint Summary

### Authentication Routes (`/api/`)
- `POST /register/` - Register a new user using `{ "email": "...", "password": "..."}`.
- `POST /login/` - Login existing user. Returns `{ access: "...", "refresh": "..." }`.

### Project Routes (`/api/projects/`)
Requires `Authorization: Bearer <token>`
- `GET /projects/` - List all projects (supports `?page=1` & `?search=query`).
- `POST /projects/` - Create a Project.
- `GET /projects/:id/` - View single project.
- `PUT /projects/:id/` - Update a project.
- `DELETE /projects/:id/` - Delete a project securely.

### Task Routes (`/api/tasks/`)
Requires `Authorization: Bearer <token>`
- `GET /tasks/?project=:id` - Retrieve tasks assigned to a specific project.
- `POST /tasks/` - Add a new task assigned to a project ID.
- `PUT /tasks/:id/` - Update a task (Toggle status updates here).
- `DELETE /tasks/:id/` - Delete a task.


## Known Limitations
- Current pagination relies solely on primitive button triggers. Future upgrades could involve infinite scroll.
- The `react-router-dom` setup does not map to a `404 Not Found` page yet for unmapped URL inputs.
- Refresh Tokens (`/api/token/refresh/`) are not securely rotated via HTTP-Only cookies yet, strictly utilizing `localStorage`. We recommend shifting the `access` token payload to memory or secure cookies prior to enterprise scaling.
