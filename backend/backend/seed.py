from django.contrib.auth import get_user_model
from projects.models import Project, Task
from accounts.models import User
from datetime import timedelta
from django.utils import timezone

User = get_user_model()

def run():
    print("Seeding database...")

    # Create dummy user
    email = "demo@example.com"
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_user(email=email, password="password123")
        print(f"Created user: {email} / password123")
    else:
        user = User.objects.get(email=email)
        print(f"User {email} already exists.")

    # Create dummy projects
    projects_data = [
        {"title": "Website Redesign", "description": "Revamping the corporate website using React and Tailwind.", "status": "active"},
        {"title": "Marketing Campaign", "description": "Q3 Digital marketing push across social channels.", "status": "active"},
        {"title": "Legacy Migration", "description": "Migrating old servers to AWS.", "status": "completed"},
    ]

    for p in projects_data:
        project, created = Project.objects.get_or_create(
            user=user,
            title=p["title"],
            defaults={"description": p["description"], "status": p["status"]}
        )
        if created:
            print(f"Created project: {project.title}")
            
            # Create dummy tasks for active projects
            if p["status"] == "active":
                Task.objects.create(
                    project=project,
                    title=f"Initial planning for {project.title}",
                    description="Gather requirements and outline the scope.",
                    status="done",
                    due_date=(timezone.now() - timedelta(days=2)).date()
                )
                Task.objects.create(
                    project=project,
                    title="Execution Phase",
                    description="Begin writing the core implementations.",
                    status="in-progress",
                    due_date=(timezone.now() + timedelta(days=10)).date()
                )
                Task.objects.create(
                    project=project,
                    title="Review & Audit",
                    description="Run final checks and review code.",
                    status="todo",
                    due_date=(timezone.now() + timedelta(days=20)).date()
                )
                
    print("Database seeding completed securely!")

run()
