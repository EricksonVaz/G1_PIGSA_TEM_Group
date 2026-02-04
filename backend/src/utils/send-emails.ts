import nodemailer from 'nodemailer';
import fs from 'fs';


export interface IEmailOptions {
    from: string;
    to: string;
    cc?:string;
    subject: string;
    html: string;
    attachments?: {
        filename: string;
        path: string;
    }[]
}

//SMTP CONNECTION
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "noreplycncsu@gmail.com", // generated ethereal user
        pass: "twjnbgiaatvknuno", // generated ethereal password
    },
});


function transporterSendEmail(mailOptions:IEmailOptions){
    return new Promise<IEmailOptions>((resolve,reject)=>{
        transporter.sendMail(mailOptions,(error, info)=>{
            if (error) {
                console.log(error);
                reject(mailOptions);
            } else {
                console.log('Email sent: ' + info.response);
                try {
                    if (mailOptions.attachments?.length) {
                        fs.unlinkSync(mailOptions.attachments[0].path);
                    }
                } catch (error) {
                }finally{
                    resolve(mailOptions);
                }
            }
        });
    });
}

export {transporter,transporterSendEmail};
 
