import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  const data = await request.json();

  console.log("Token API => ", data);

  const { type } = data;

  const client_secret = data.intention.client_secret ?? null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  if (type === "TOKEN") {
    console.log(type);
    const inserted = await supabase
      .from("tokens")
      .insert({ id: 2, token: obj.token, order_id: obj.order_id });
    console.log(inserted);
  }

  if (client_secret != null) {
    console.log("In client_secret block => ", client_secret);
    const updated = await supabase
      .from("clients")
      .update({
        order_id: data.transaction.order.id,
      })
      .eq("client_secret", data.transaction.client_secret);
    console.log(updated);
  }

  if (type === "TOKEN") {
    redirect("/dashboard");
  } else {
    redirect("/dashboard/create");
  }

  //return new Response(JSON.stringify(data), { status: 200 });
}
