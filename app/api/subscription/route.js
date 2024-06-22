import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  //Initializing data that will be required for requests
  const body = await request.json();

  const { id, subscriptionCost } = body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  //Starting the paymob payment intention (Step-1)
  const myHeaders = new Headers();

  myHeaders.append(
    "Authorization",
    `Token ${process.env.NEXT_PUBLIC_PAYMOB_SECRET_KEY}`
  );
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    amount: parseInt(subscriptionCost),
    currency: "OMR",
    payment_methods: [1612],
    billing_data: {
      first_name: "sahllak",
      last_name: "innovations",
      phone_number: "+96878784037",
      email: "mehdi@sahllak.com",
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

  const { key } = data.payment_keys[0];

  const tokenDB = await supabase
    .from("clients")
    .select("client_card")
    .eq("id", id)
    .limit(1)
    .single();

  const { client_card } = tokenDB.data;

  //After we receive key and client card we start executing subscription logic (Step-2)

  const subscriptionHeaders = new Headers();

  subscriptionHeaders.append(
    "Authorization",
    `Token ${process.env.NEXT_PUBLIC_PAYMOB_SECRET_KEY}`
  );

  subscriptionHeaders.append("Content-Type", "application/json");

  const subscriptionData = JSON.stringify({
    source: {
      identifier: client_card,
      subtype: "TOKEN",
    },
    payment_token: key,
  });

  const subscriptionRequestOptions = {
    method: "POST",
    headers: subscriptionHeaders,
    body: subscriptionData,
    redirect: "follow",
  };

  const subscriptionResponse = await fetch(
    "https://oman.paymob.com/api/acceptance/payments/pay",
    subscriptionRequestOptions
  );

  const subscriptionResponseData = await subscriptionResponse.json();

  const { success } = subscriptionResponseData;

  if (success == true) {
    const date = new Date();

    await supabase
      .from("clients")
      .update({ sub_date_start: date })
      .eq("id", id);
  }

  return new Response(JSON.stringify({ intention_generated: true }), {
    status: 200,
  });
}
