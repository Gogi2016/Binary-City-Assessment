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
            tableBody.append('<tr><td colspan="5">No contact(s) found.</td></tr>');
        } else {
            // Sort contacts by surname, then by name
            contacts.sort((a, b) => {
                if (a.surname !== b.surname) {
                    return a.surname.localeCompare(b.surname);
                }
                return a.name.localeCompare(b.name);
            });

            contacts.forEach(contact => {
                const linkedClientsCount = contact.clients.length;
                tableBody.append(`
                    <tr>
                        <td>${contact.name}</td>
                        <td>${contact.surname}</td>
                        <td>${contact.email}</td>
                        <td class="text-center">${linkedClientsCount}</td>
                        <td>
                            <button class="btn btn-danger delete-contact" data-email="${contact.email}">Delete</button>
                            <button class="btn btn-link link-client" data-email="${contact.email}">Link Client</button>
                            <button class="btn btn-link unlink-client" data-email="${contact.email}">Unlink Client</button>
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

    // Function to delete a contact
    function deleteContact(contactEmail) {
        contacts = contacts.filter(contact => contact.email !== contactEmail);

        // Also remove the contact from any linked clients
        clients.forEach(client => {
            client.contacts = client.contacts.filter(email => email !== contactEmail);
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
        localStorage.setItem('clients', JSON.stringify(clients));
        displayContacts();
        displayClients();
    }

    // Function to handle linking clients to contacts
    $('#contactsTable').on('click', '.link-client', function () {
        const contactEmail = $(this).data('email');

        // Prompt user to select client(s) to link
        const clientSelection = prompt(`Enter the Client Code(s) to link to ${contactEmail}, separated by commas:`);

        if (clientSelection) {
            const clientCodes = clientSelection.split(',').map(code => code.trim());

            clientCodes.forEach(code => {
                const client = clients.find(client => client.code === code);
                if (client) {
                    const contact = contacts.find(contact => contact.email === contactEmail);
                    if (contact && !contact.clients.includes(code)) {
                        contact.clients.push(code);
                        client.contacts.push(contactEmail);
                    }
                } else {
                    alert(`Client with code ${code} not found.`);
                }
            });

            localStorage.setItem('clients', JSON.stringify(clients));
            localStorage.setItem('contacts', JSON.stringify(contacts));
            displayClients();
            displayContacts();
        }
    });

    // Function to handle unlinking clients from contacts
    $('#contactsTable').on('click', '.unlink-client', function () {
        const contactEmail = $(this).data('email');
        const contact = contacts.find(contact => contact.email === contactEmail);

        if (contact.clients.length === 0) {
            alert(`No linked clients for ${contactEmail}.`);
            return;
        }

        // Prompt user to select client(s) to unlink
        const clientSelection = prompt(`Enter the Client Code(s) to unlink from ${contactEmail}, separated by commas:`, contact.clients.join(', '));

        if (clientSelection) {
            const clientCodes = clientSelection.split(',').map(code => code.trim());

            clientCodes.forEach(code => {
                const clientIndex = contact.clients.indexOf(code);
                if (clientIndex !== -1) {
                    contact.clients.splice(clientIndex, 1);
                }

                const client = clients.find(client => client.code === code);
                if (client) {
                    const contactIndex = client.contacts.indexOf(contactEmail);
                    if (contactIndex !== -1) {
                        client.contacts.splice(contactIndex, 1);
                    }
                }
            });

            localStorage.setItem('clients', JSON.stringify(clients));
            localStorage.setItem('contacts', JSON.stringify(contacts));
            displayClients();
            displayContacts();
        }
    });

    // Event listener for delete client buttons
    $('#clientsTable').on('click', '.delete-client', function () {
        const clientCode = $(this).data('id');
        deleteClient(clientCode);
    });

    // Event listener for delete contact buttons
    $('#contactsTable').on('click', '.delete-contact', function () {
        const contactEmail = $(this).data('email');
        deleteContact(contactEmail);
    });

    // Initialize the client and contact views
    displayClients();
    displayContacts();
});

