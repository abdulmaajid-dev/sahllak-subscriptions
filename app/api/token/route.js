import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  const data = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  console.log("Token API => ", data);

  if ("type" in data) {
    //check if token request coming in,
    const { obj } = data;

    const inserted = await supabase
      .from("tokens")
      .insert({ token: obj.token, order_id: obj.order_id });
    console.log(inserted);
  } else if ("paymob_request_id" in data) {
    //update status in database of not receiving client_token
    const { client_secret } = data.intention;

    const updated = await supabase
      .from("clients")
      .update({
        client_card_token: false,
      })
      .eq("client_secret", client_secret);
    console.log(updated);
  }

  // if ("paymob_request_id" in data) {
  //   const { data } = await supabase.from("clients").select("client_card_token");
  // }

  //const client_secret = data.intention.client_secret ?? null;

  // if (type === "TOKEN") {
  //   console.log(type);
  //   const inserted = await supabase
  //     .from("tokens")
  //     .insert({ id: 2, token: obj.token, order_id: obj.order_id });
  //   console.log(inserted);
  // }

  // if (client_secret != null) {
  //   console.log("In client_secret block => ", client_secret);
  //   const updated = await supabase
  //     .from("clients")
  //     .update({
  //       order_id: data.transaction.order.id,
  //     })
  //     .eq("client_secret", data.transaction.client_secret);
  //   console.log(updated);
  // }

  // if (type === "TOKEN") {
  //   redirect("/dashboard");
  // } else {
  //   redirect("/dashboard/create");
  // }

  return new Response(JSON.stringify(data), { status: 200 });
}
