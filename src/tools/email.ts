import transporter from "../mail/email";
import config from "config";
const user: string = config.get("mail.user");
const urlServer: string = config.get("mail.urlServer");
const urlClient: string = config.get("mail.urlClient");
class Mail {
  async verification(to: string, token: string) {
    const mailOptions = {
      from: user,
      to,
      subject: "Vérification de votre compte",
      html: `
            <div
                style="
                    text-align: center;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    max-width: 700px;
                    margin: 0 auto;
                "
            >
                <div style="display: flex; flex-direction: column; align-items: center; justify-content:center; gap:5px;">
                    <h1>Abend-core</h1>
                    <img src="cid:logo_cid" alt="Abend-core Logo" style="width: 150px; height: 150px; margin-bottom: 20px;">
                </div>
                <p style="font-weight: bold; font-size: 20px;">Vérifier votre compte</p>
                <p class="font-size: 18px;">Les informations de votre compte</p>
                <div
                    style="
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    background-color: #e5e7eb17;
                    "
                >
                    <table style="width: 100%; border-collapse: collapse; text-align: left">
                        <tr style="border-bottom: 1px solid #e5e7eb">
                            <td style="width: 30%; padding: 10px; font-weight: bold">Compte:</td>
                            <td style="padding: 10px">${to}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e5e7eb">
                            <td style="width: 30%; padding: 10px; font-weight: bold">
                            Lien de vérification:
                            </td>
                            <td style="padding: 10px; word-break: break-all">
                                <a href="${urlClient}/verification/${token}" style="color: black">
                                    ${urlClient}/verification/${token}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" align="center" style="padding-top: 20px;">
                                <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" bgcolor="#f82b30" style="border-radius: 6px;">
                                            <a
                                            href="${urlClient}/verification/${token}"
                                            style="
                                                display: inline-block;
                                                color: white;
                                                text-decoration: none;
                                                background-color: #f82b30;
                                                padding: 10px 20px;
                                                border-radius: 6px;
                                                font-weight: bold;
                                            "
                                            >
                                            Vérifier mon compte
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
              `,
      attachments: [
        {
          filename: "abend-core-logo.png",
          path: urlServer + "/uploadsFile/email/logo.png",
          cid: "logo_cid",
        },
      ],
    };
    await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé à:", to);
  }

  async updatePassword(to: string, token: string) {
    const mailOptions = {
      from: user,
      to,
      subject: "Demande de changement de mot de passe",
      html: `
            <div
                style="
                    text-align: center;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    max-width: 700px;
                    margin: 0 auto;
                "
            >
                <div style="display: flex; flex-direction: column; align-items: center; justify-content:center; gap:5px;">
                    <h1>Abend-core</h1>
                    <img src="cid:logo_cid" alt="Abend-core Logo" style="width: 150px; height: 150px; margin-bottom: 20px;">
                </div>
                <p style="font-weight: bold; font-size: 20px;">Changement de mot de passe</p>
                <p class="font-size: 18px;">Les informations de votre compte</p>
                <div
                    style="
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    background-color: #e5e7eb17;
                    "
                >
                    <table style="width: 100%; border-collapse: collapse; text-align: left">
                        <tr style="border-bottom: 1px solid #e5e7eb">
                            <td style="width: 30%; padding: 10px; font-weight: bold">Compte:</td>
                            <td style="padding: 10px">${to}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e5e7eb">
                            <td style="width: 30%; padding: 10px; font-weight: bold">
                            Lien de modification:
                            </td>
                            <td style="padding: 10px; word-break: break-all">
                                <a href="${urlClient}/verificationPassword/${token}" style="color: black">
                                    ${urlClient}/verificationPassword/${token}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" align="center" style="padding-top: 20px;">
                                <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" bgcolor="#f82b30" style="border-radius: 6px;">
                                            <a
                                            href="${urlClient}/verificationPassword/${token}"
                                            style="
                                                display: inline-block;
                                                color: white;
                                                text-decoration: none;
                                                background-color: #f82b30;
                                                padding: 10px 20px;
                                                border-radius: 6px;
                                                font-weight: bold;
                                            "
                                            >
                                            Changer mon mot de passe
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
              `,
      attachments: [
        {
          filename: "abend-core-logo.png",
          path: urlServer + "/uploadsFile/email/logo.png",
          cid: "logo_cid",
        },
      ],
    };
    await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé à:", to);
  }
}

export default new Mail();
