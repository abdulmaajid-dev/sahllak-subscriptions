import { NextResponse } from "next/server";

export async function POST(request) {
  const myHeaders = new Headers();

  myHeaders.append(
    "Authorization",
    `Token ${process.env.NEXT_PUBLIC_PAYMOB_SECRET_KEY}`
  );
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    amount: 100,
    currency: "OMR",
    payment_methods: [1545, 1546],
    billing_data: {
      first_name: "ala",
      last_name: "huss",
      phone_number: "+923459989111",
      email: "ali@gmail.com",
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "https://oman.paymob.com/v1/intention/",
    requestOptions
  );

  const data = await response.json();

  console.log(data);

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
