const ejs = require('ejs');

const sendEmailAlert = async (from, to, params) => {
    const html = await ejs.renderFile(
        templatePath + './emailTemplate.ejs',
        Object.assign(params, DefaultParams)
    );
    await sendEmail(
        from,
        to,
        `Campaign Alert`,
        html
    );
};

module.exports = sendEmailAlert;