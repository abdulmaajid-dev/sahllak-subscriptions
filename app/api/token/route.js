import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  console.log("Request response =>", data);

  if ("type" in data) {
    //check if token request coming in,
    const { obj } = data;

    const inserted = await supabase
      .from("tokens")
      .insert({ token: obj.token, order_id: obj.order_id });
    console.log(inserted);
  }

  if ("paymob_request_id" in data) {
    const { transaction } = data;

    const { id } = transaction.order;

    const check = await supabase.from("tokens").select().eq("order_id", id);

    if (check.data.length < 1) {
      //update status in database of not receiving client_token
      const { client_secret } = data.intention;

      const updated = await supabase
        .from("clients")
        .update({
          client_card_token: false,
        })
        .eq("client_secret", client_secret);

      const myHeaders = new Headers();

      myHeaders.append(
        "Authorization",
        `Token ${process.env.NEXT_PUBLIC_PAYMOB_SECRET_KEY}`
      );

      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        transaction_id: transaction.id,
        amount_cents: parseInt(transaction.amount_cents),
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "https://oman.paymob.com/api/acceptance/void_refund/refund",
        requestOptions
      );

      const finalResponse = await response.json();

      const { success } = finalResponse;

      return new Response(
        JSON.stringify(
          { order_id_found: false, refunded: success },
          { status: 200 }
        )
      );
    }

    if (transaction.is_refunded == true) {
      return new Response(JSON.stringify({ transaction_refunded: true }), {
        status: 200,
      });
    }

    if (transaction.success == true) {
      console.log("Fetching token connected to order ID => ", id);
      const tokenDB = await supabase
        .from("tokens")
        .select("token")
        .eq("order_id", id)
        .limit(1)
        .single();

      const { token } = tokenDB.data;
      const { client_secret } = data.intention;

      const clientCard = await supabase
        .from("clients")
        .update({ client_card: token, initial_payment_success: true })
        .eq("client_secret", client_secret);

      console.log(clientCard);
    }
  }

  return new Response(JSON.stringify({ order_id_found: true }), {
    status: 200,
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const success = searchParams.get("success");

  return NextResponse.redirect(`http://localhost:3000/dashboard`);
}
