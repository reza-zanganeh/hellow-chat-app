const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const projectConfig = require("../config/index")

const oAth2Client = new google.auth.OAuth2(
  projectConfig.serviceConfig.google.clientId,
  projectConfig.serviceConfig.google.clientSecret,
  projectConfig.serviceConfig.google.redirectUrl
)

oAth2Client.setCredentials({
  refresh_token: projectConfig.serviceConfig.google.refreshToken,
})

const sendMail = async (to, subject, text) => {
  try {
    const accessToken = await oAth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: projectConfig.otpConfig.sender.user,
        pass: projectConfig.otpConfig.sender.pass,
        clientId: projectConfig.serviceConfig.google.clientId,
        clientSecret: projectConfig.serviceConfig.google.clientSecret,
        refreshToken: projectConfig.serviceConfig.google.refreshToken,
        accessToken,
      },
    })

    const mailOptions = {
      from: projectConfig.otpConfig.sender.user,
      to,
      subject,
      html: `<h1>${text}</h1>`,
    }

    const result = await transport.sendMail(mailOptions)

    return result
  } catch (error) {
    return error
  }
}

module.exports.sendOtpCode = async (email, randomCode) => {
  try {
    const message = `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="TODO" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hellow Chat</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Hellow Chat . Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${randomCode}</h2>
    <p style="font-size:0.9em;">Regards,<br />Hellow Chat</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Hellow Chat Inc</p>
      <p>Iran</p>
    </div>
  </div>
</div>
`
    await sendMail(email, "Welcom To Hellow Chat", message)
  } catch (error) {
    throw error
  }
}

module.exports.sendResetPasswordHash = async (
  email,
  userId,
  hash,
  redirectUrl
) => {
  try {
    const message = `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="TODO" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Hellow Chat</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    ${
      redirectUrl
        ? `<p>click on the following link to complete your reset password procedures. reset password link is valid for 5 minutes</p>
    <a href="${redirectUrl.trim()}/${userId}/${hash}" target="_blank" style="text-decoration: "none";font-size: "16px";background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">reset password link</a>`
        : ` <p>use the following token to complete your reset password procedures. reset password token is valid for 5 minutes (if you don't know next step read api document)</p>
        <h5 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${hash}</h5>`
    }
    <p style="font-size:0.9em;">Regards,<br />Hellow Chat</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Hellow Chat Inc</p>
      <p>Iran</p>
    </div>
  </div>
</div>
`
    await sendMail(email, "reset Hellow Chat password", message)
  } catch (error) {
    throw error
  }
}
