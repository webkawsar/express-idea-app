const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_SECRET,
    domain: process.env.MAILGUN_DOMAIN,
});

const registerData = (to, token) => ({
    from: process.env.MAIL_FROM,
    to,
    subject: 'Welcome to Express Idea App',
    text: `Welcome from Express Idea App.Please click the link to activate your account <a href="${process.env.HOST_ADDRESS}/auth/activate/${token}">Activate account</a>`,
    html: `<h3>Welcome from Express Idea App</h3><p>Share your idea to the outer world</p><p>Please click the link to activate your account <a href="${process.env.HOST_ADDRESS}/auth/activate/${token}">Activate account</a></p>`,
});

const forgetData = (to, token) => ({
    from: process.env.MAIL_FROM,
    to,
    subject: 'Reset Password',
    text: `You requested to reset password.Please click the link to reset password <a href="${process.env.HOST_ADDRESS}/auth/reset-password/${token}">Reset Password</a>`,
    html: `<p>You requested to reset password.Please click the link to reset password <a href="${process.env.HOST_ADDRESS}/auth/reset-password/${token}">Reset Password</a></p>`,
});

module.exports = {
    mailgun,
    registerData,
    forgetData,
};
