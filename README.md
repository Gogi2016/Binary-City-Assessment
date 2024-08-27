# Binary-City-Assessment

# Overview
The Client Management System is a web application designed to manage clients and contacts efficiently. It allows users to add, view, edit, and delete clients and contacts, as well as link and unlink clients to contacts. This system helps in maintaining and managing client information and their associated contacts.

# Features
Client Management: Add, view, delete, and generate unique client codes.
Contact Management: Add, view, delete, and link/unlink contacts to clients.
Linking Clients to Contacts: Link multiple clients to a contact and vice versa.
Data Persistence: All data is saved in local storage, ensuring persistence across sessions.

# Technologies Used
HTML5: For structuring the web pages.
CSS3: For styling the application.
JavaScript (jQuery): For dynamic content and functionality.
Bootstrap: For responsive design and styling.
Local Storage: For data persistence.

# Installation
Clone the repository:
git clone https://github.com/Gogi2016/Binary-City-Assessment.git

Navigate to the project directory:
cd client-management-system
Open the index.html file in a web browser.

# Usage
Add a Client:
Enter the client's name in the form provided.
A unique client code will be generated automatically.
Click the "Add Client" button to save.

Add a Contact:
Enter the contact's name, surname, and email.
Ensure that the email is unique.
Click the "Add Contact" button to save.

Link Clients to Contacts:
Go to the Contacts tab.
Click the "Link Client" button for the desired contact.
Enter the client codes you want to link, separated by commas.

Unlink Clients from Contacts:
Go to the Contacts tab.
Click the "Unlink Client" button for the desired contact.
Enter the client codes you want to unlink, separated by commas.

Delete Clients and Contacts:
Click the "Delete" button next to the client or contact you wish to remove.

Local Storage Data
Clients: Stores client information including name, code, and linked contacts.
Contacts: Stores contact information including name, surname, email, and linked clients.
Contributing

Acknowledgements
Bootstrap for the responsive design framework.
jQuery for simplified JavaScript operations.
