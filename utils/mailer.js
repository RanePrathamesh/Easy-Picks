import nodemailer from 'nodemailer';

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vishalgupta.exe@gmail.com',
      pass: 'zlrz becg jxgc qwfq'
    },
  });

  const mailOptions = {
    from: 'vishalgupta.exe@gmail.com', 
    to:option.email,
    subject:"genrate password",
    text:option.message 
  };
    const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent: ', info)
};

export default sendEmail;
