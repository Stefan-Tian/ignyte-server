import nodemailer from 'nodemailer';
import pug from 'pug';

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = <T>(
  templatePath: string,
  templateData: T,
  userEmail: string,
  subject: string
) => {
  const template = pug.compileFile(templatePath);
  const htmlContent = template(templateData);

  const data = {
    from: `Ignyte.life <me@sandbox9f5836722bd34260ae7e3014acf6aeae.mailgun.org>`,
    to: `${userEmail}`,
    subject,
    html: htmlContent,
  };

  return new Promise((resolve) => {
    transporter.sendMail(data, (err) => {
      if (err) {
        resolve(false);
      }

      resolve(true);
    });
  });
};
