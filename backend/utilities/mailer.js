'use strict';
import 'dotenv/config';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
	service : 'gmail',
	auth    : {
		user : process.env.EMAIL_ID,
		pass : process.env.EMAIL_PASSWORD
	}
});

const mailOptions = {
	from    : process.env.EMAIL_ID,
	to      : '',
	subject : 'Congrats, Notes App Registration Successfull!',
	text    : `Hi there,
    
    Your registration to the Notes App is successfull!
    Fret not as all your notes are encrypted by AES-128 alogorithm and your password is Hashed.
    Skip the paranoia and start noting...

    BTW, don't forget your Credentials.
    
    Thank You,
    Waqqar Suleman`
};

const send = (receiver) => {
	mailOptions.to = receiver;
	return transporter.sendMail(mailOptions);
};

export default send;
