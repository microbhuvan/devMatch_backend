const resend = require("./resendClient.js");

const run = async (subject, body, toEmail) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "DevMatch <notifications@devmatch.co.in>",
      to: toEmail,
      subject: subject,
      html: body,
    });

    if (error) {
      console.error("Email sending error:", error);
      return error;
    }
    console.log("Email sent:", data);
    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

module.exports = { run };
