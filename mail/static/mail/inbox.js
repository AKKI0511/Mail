document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = submit_form;

  // By default, load the inbox
  load_mailbox('inbox');
});


function submit_form() {
  // Take new email values
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Submit new email to database
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  });

  // redirect user to 'sent' page
  return load_mailbox('sent');
}


function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function reply_email(email) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  let s = (email.subject.startsWith('Re')) ? email.subject:`Re: ${email.subject}`;
  document.querySelector('#compose-recipients').value = `${email.sender}`;
  document.querySelector('#compose-subject').value = s;
  document.querySelector('#compose-body').value = `\n\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch mailbox data
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

      // For each email inn emails 
      for(let i = 0 ; i < emails.length ; i++){
        let element = document.createElement("div");
        let email = emails[i];
        element.id = 'email-link';

        // If already read text: Grey else white
        if(email.read){
          element.className = 'margin rounded text-muted';
        } else {
          element.className = 'margin rounded text-light';
        }
        element.innerHTML = `<div style="overflow: hidden;"><div style="float: left;">${email.sender}: ${email.subject}</div><div style="float: right;">${email.timestamp}</div></div>`;

        // When user clicks on email
        element.addEventListener('click', function() {

          // Show the mailbox and hide other views
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#email-view').style.display = 'block';

          // Make the email read in the database
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
          })

          // Show email
          show_data = `<h3>${email.subject}</h3>Sender: ${email.sender}<br>Recipients: ${email.recipients}<br>${email.timestamp}<br>${email.body}<hr>`;
          document.querySelector('#email-view').innerHTML = show_data;

          // Reply button
          let reply = document.createElement('button');
          reply.className = 'btn btn-primary';
          reply.innerHTML = 'Reply';
          reply.addEventListener('click', () => reply_email(email))
          document.querySelector('#email-view').append(reply);

          // If user on inbox or archive page: show Archive/UnArchive button
          if(mailbox === 'inbox' || mailbox === 'archive'){

            // Make new button for archive/unarchive
            let button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = (mailbox === 'archive') ? 'UnArchive':'Archive';

            // On click fetch that email and change it to archive/unarchive
            button.addEventListener('click', () => {
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: mailbox === 'inbox'
                })
              })

              // Then redirect user to 'inbox' page
              return load_mailbox('inbox');
            });
            document.querySelector("#email-view").append(button);
          }

        });
        document.querySelector("#emails-view").append(element);  
      }
  });

  return false;
}