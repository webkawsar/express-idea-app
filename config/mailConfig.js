const mailgun = require('mailgun-js')({
    apiKey: 'key-44b0461fea529fc953766b9644288c80',
    domain: 'seelim.me',
});

const data = {
    from: 'mail@seelim.me',
    to: 'web.kawsarahmed@gmail.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomeness!',
};

// mailgun.messages().send(data, (error, body) => {
//     console.log(body);
// });

module.exports = {
    mailgun,
    data,
};
