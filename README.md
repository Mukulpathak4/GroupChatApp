# Group Chat App

![App Screenshot](/screenshot.png)

A real-time group chat application built using Node.js, Express, SQL, Sequelize, and various dependencies. This application allows users to create groups, add members to those groups, and engage in real-time text-based conversations.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Author](#author)

## Introduction

Welcome to the Group Chat App! This application provides a platform for users to communicate in real-time within groups. Whether you're managing a team, organizing an event, or just chatting with friends, this app has you covered.

## Features

- **User Authentication**: Securely create accounts and log in to the app. User data is protected with bcrypt hashing.
- **Group Creation**: Users can create new groups and become administrators of those groups.
- **Group Membership**: Easily add or remove members from your groups.
- **Real-Time Chat**: Engage in real-time text-based conversations within the groups.
- **Notification System**: Receive instant notifications for new messages and group updates.
- **File Upload**: Share files with group members, making collaboration more efficient.
- **Email Notifications**: Stay informed with email notifications for important group events.
- **Security**: The app prioritizes security with features like password hashing (bcrypt), JWT for authentication, and HTTP header protection (Helmet).
- **Scheduled Tasks**: Utilize node-cron for scheduling automated tasks, such as sending daily summaries.

## Technologies Used

- **Node.js**: The server-side runtime environment.
- **Express.js**: The web application framework for building the server.
- **SQL Database**: Store data in a SQL database (e.g., MySQL).
- **Sequelize ORM**: A powerful ORM for interacting with the database.
- **Socket.io**: Facilitates real-time communication between clients and the server.
- **JWT**: JSON Web Tokens for user authentication and authorization.
- **SendGrid**: Sends email notifications to users.
- **AWS SDK**: Manages file storage (e.g., S3).
- **Multer**: Handles file uploads.
- And more! (See package.json for a full list of dependencies)

## Getting Started

Follow these steps to get the Group Chat App up and running on your local machine:

1. **Clone the Repository**:

   ```shell
   git clone https://github.com/Mukulpathak4/GroupChatApp.git

## Usage

To use the Group Chat App, follow these steps:

1. **Create an Account**: If you don't have an account, sign up by providing your details and creating a password.

2. **Log In**: Log in using your registered email address and password.

3. **Dashboard**: After logging in, you'll be directed to your dashboard.

4. **Create a Group**:
   - Click on the "Create Group" button to start a new group.
   - Fill in the group's name, description, and other details.
   - Invite members to join the group by entering their email addresses.

5. **Join a Group**:
   - If you've received an invitation to join a group, click on the link provided in the email.
   - Alternatively, you can use the "Join Group" feature and enter the group code or URL.

6. **Group Chat**:
   - Once you're in a group, you can send and receive real-time messages in the group chat.
   - Use the file upload feature to share files with other group members.

7. **Profile Settings**:
   - Customize your profile settings, including your display name, profile picture, and notification preferences.

8. **Log Out**: Don't forget to log out when you're done.

## Contributing

We welcome contributions from the community to make the Group Chat App even better. To contribute, please follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix:

   ```shell
   git checkout -b feature/your-feature-name
# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Acknowledgments

We would like to express our gratitude to the following individuals and organizations for their contributions and support in building the Group Chat App:

- [Socket.io](https://socket.io/) for providing real-time communication capabilities.
- [SendGrid](https://sendgrid.com/) for handling email notifications.
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) for enabling file storage.
- The open-source community for various dependencies and libraries used in this project.

# Author

- **Mukul Pathak**
- GitHub: (https://github.com/Mukulpathak4)
- LinkedIn: (https://www.linkedin.com/in/mukul-pathak-813b06171/)

   
