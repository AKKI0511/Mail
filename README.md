# Django Mail Application

Welcome to the Django Mail Application – a simple email client built with Django! 📧✨

## Features

- **Compose Emails:** Create and send emails to other registered users.
- **Reply to Emails:** Respond to received emails for effective communication.
- **Mailbox Views:** Navigate through your inbox, sent emails, and archived messages.
- **Read and Archive:** Mark emails as read and archive them for better organization.
- **User Authentication:** Securely register, log in, and log out.

## Tech Stack

- **Django:** Web framework used for building the application.
- **SQLite:** Database for storing user information and emails.
- **Python:** Core language for application logic.
- **JSON:** Data interchange format for API requests.
- **HTML, CSS:** Frontend design for a user-friendly interface.

## Getting Started

1. Clone the repository.
2. Install Django using `pip install django`.
3. Run migrations with `python manage.py migrate`.
4. Create a superuser using `python manage.py createsuperuser` for admin access.
5. Start the development server with `python manage.py runserver`.

Visit [localhost:8000](http://localhost:8000) and begin exploring the Django Mail App!

## API Endpoints

- `/api/compose`: Compose and send emails.
- `/api/mailbox/<str:mailbox>`: Fetch emails for a specific mailbox (inbox, sent, archive).
- `/api/email/<int:email_id>`: View, mark as read, or archive a specific email.
