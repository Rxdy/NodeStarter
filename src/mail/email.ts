import nodemailer from "nodemailer";
import config from "config";

const user: string = config.get("mail.user");
const pass: string = config.get("mail.pass");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export default transporter;
