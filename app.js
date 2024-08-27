$(document).ready(function () {
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    // Function to generate a unique client code
    function generateClientCode(name) {
        const alphaPart = name.substring(0, 3).toUpperCase();
        let numPart = 1;

        let existingCodes = clients.map(client => client.code);
        while (existingCodes.includes(alphaPart + numPart.toString().padStart(3, '0'))) {
            numPart++;
        }

        return alphaPart + numPart.toString().padStart(3, '0');
    }

    // Function to display clients in the table
    function displayClients() {
        const tableBody = $('#clientsTable tbody');
        tableBody.empty();

        if (clients.length === 0) {
            tableBody.append('<tr><td colspan="4">No client(s) found.</td></tr>');
        } else {
            clients.forEach(client => {
                const linkedContacts = client.contacts.length;
                tableBody.append(`
                    <tr>
                        <td>${client.name}</td>
                        <td>${client.code}</td>
                        <td>${linkedContacts}</td>
                        <td>
                            <button class="btn btn-danger delete-client" data-id="${client.code}">Delete</button>
                        </td>
                    </tr>
                `);
            });
        }
    }

    // Function to display contacts in the table
    function displayContacts() {
        const tableBody = $('#contactsTable tbody');
        tableBody.empty();

        if (contacts.length === 0) {
            tableBody.append('<tr><td colspan="3">No contacts to display.</td></tr>');
        } else {
            contacts.sort((a, b) => a.surname.localeCompare(b.surname));
            contacts.forEach(contact => {
                tableBody.append(`
                    <tr>
                        <td>${contact.surname} ${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>
                            <a href="#" class="link-contact" data-id="${contact.email}">Link</a>
                        </td>
                    </tr>
                `);
            });
        }
    }

    // Function to handle client form submission
    $('#clientFormContent').submit(function (event) {
        event.preventDefault();

        const clientName = $('#clientName').val();
        let clientCode = $('#clientCode').val();

        if (!clientCode) {
            clientCode = generateClientCode(clientName);
            $('#clientCode').val(clientCode);
        }

        const newClient = {
            name: clientName,
            code: clientCode,
            contacts: []
        };

        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));
        displayClients();
        $('#clientFormContent')[0].reset();
    });

    // Function to handle contact form submission
    $('#contactFormContent').submit(function (event) {
        event.preventDefault();

        const contactName = $('#contactName').val();
        const contactSurname = $('#contactSurname').val();
        const contactEmail = $('#contactEmail').val();

        // Check for unique email
        if (contacts.some(contact => contact.email === contactEmail)) {
            alert('Email already exists for another contact.');
            return;
        }

        const newContact = {
            name: contactName,
            surname: contactSurname,
            email: contactEmail,
            clients: []
        };

        contacts.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        displayContacts();
        $('#contactFormContent')[0].reset();
    });

    // Function to delete a client
    function deleteClient(clientCode) {
        clients = clients.filter(client => client.code !== clientCode);
        localStorage.setItem('clients', JSON.stringify(clients));
        displayClients();
    }

    // Event listener for delete buttons
    $('#clientsTable').on('click', '.delete-client', function () {
        const clientCode = $(this).data('id');
        deleteClient(clientCode);
    });

    // Initialize the client and contact views
    displayClients();
    displayContacts();
});
