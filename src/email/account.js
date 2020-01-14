const sgmail = require('@sendgrid/mail')
const API_KEY = process.env.SENDGRID_API_KEY

sgmail.setApiKey(API_KEY)

const sendWelcomeEmail = (email, name)=>{
    sgmail.send({
        to : email,
        from : 'dishant9812dua@gmail.com',
        subject : `Thanks for joining in`,
        text : `Welcome ${name} in out Task App`
    })
}
const sendCalcinationEmail = (email, name)=>{
    sgmail.send({
        to : email,
        from : 'dishant9812dua@gmail.com',
        subject : `Sorry to see You Go!`,
        text : `Goodbye ${name} from youe Task App Hope we meet soon!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCalcinationEmail
}