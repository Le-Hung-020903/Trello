let SibApiV3Sdk = require("@getbrevo/brevo")
const { env } = require("../config/environment")
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

let apiKey = apiInstance.authentications["apiKey"]
apiKey.apiKey = env.BREVO_API_KEY


const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  // Tài khoản gửi email
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  }

  // Tải khoản nhận email
  // 'To' phải là một Array để sau chúng ta có thể tuỳ biến gửi 1 email tới nhiều user tuỳ tính năng dự án nhé
  sendSmtpEmail.to = [{ email: recipientEmail }]

  // Tiêu đề của email:
  sendSmtpEmail.subject = customSubject

  // Nội dung email dạng HTML
  sendSmtpEmail.htmlContent = htmlContent

  // Gọi hành động gửi email
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}
export const BrevoProvider = {
  sendEmail
}
