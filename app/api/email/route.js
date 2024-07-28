import AWS from "../../../aws-config";

export async function POST(req) {
  const reqbody = await req.json();

  const { email, subject, body } = reqbody;

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "payments@sahllak.com",
  };

  const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  sendPromise
    .then((data) => {
      console.log(data.MessageId);
      return new Response("Email sent successfully", { status: 200 });
    })
    .catch((err) => {
      console.error(err, err.stack);
      return new Response("Email was not sent", { status: 400 });
    });

  return new Response("Method not allowed", { status: 400 });
}
