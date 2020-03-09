const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, firstname) => {
	sgMail.send({
		to: email,
		from: 'lecorffpierre@gmail.com',
		subject: 'Bienvenue parmi nous',
		html: `Bienvenue sur CVCreator ${firstname}. N'hésitez pas à explorer le site et à suivre les différents tutoriels afin de créer le meilleur CV possible.</br><strong>L'équipe CVCreator</strong>`
	})
}

const sendCancelationEmail = (email, firstname) => {
	sgMail.send({
		to: email,
		from: 'lecorffpierre@gmail.com',
		subject: 'Nous sommes désolés de vous voir partir si tôt',
		html: `Cet email vous confirme la supression de votre compte ainsi que celle de toutes les tâches que vous avez pu créer. 
		</br>${firstname}, pourquoi nous avoir quitté ?
		</br><strong>L'équipe CVCreator</strong>`
	})
}

module.exports = {
	sendWelcomeEmail,
	sendCancelationEmail
}
