import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { id } = body;

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

  const { client_secret } = data;

  console.log(client_secret);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const updated = await supabase
    .from("clients")
    .update({ client_secret: client_secret })
    .eq("id", id);

  console.log(updated);

  return new Response(JSON.stringify(data), {
    status: 200,
    updated: updated,
  });
}
