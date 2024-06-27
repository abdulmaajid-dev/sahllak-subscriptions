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

    console.log("Token Inserted => ", inserted);

    return new Response(JSON.stringify({ token_saved: true }), { status: 200 });
  }

  if ("paymob_request_id" in data) {
    const { transaction } = data;
    const { client_secret } = data.intention;

    const { id } = transaction.order;
    //update client order_id
    await supabase
      .from("clients")
      .update({ order_id: id })
      .eq("client_secret", client_secret);

    const check = await supabase.from("tokens").select().eq("order_id", id);

    if (check.data.length < 1) {
      //update status in database of not receiving client_token
      await supabase
        .from("clients")
        .update({ client_card_token: false, is_refunded: true })
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

      console.log("Payment Refunded => ", success);

      return new Response(
        JSON.stringify(
          { order_id_found: false, refunded: success },
          { status: 200 }
        )
      );
    }

    if (transaction.is_refunded == true) {
      console.log("Transaction refunded!");
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
        .update({
          client_card: token,
          initial_payment_success: true,
        })
        .eq("client_secret", client_secret);

      console.log("Token linked to Client => ", clientCard);
      return new Response(JSON.stringify({ client_linked_to_token: true }), {
        status: 200,
      });
    }
  }

  return new Response(JSON.stringify({ order_id_found: true }), {
    status: 200,
  });
}
