import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data } = await supabase.from("clients").select();

  console.log(data);

  return new NextResponse(JSON.stringify(data));
}

export async function POST(request) {
  const body = await request.json();

  console.log(body.client_name);

  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL,
  //   process.env.NEXT_PUBLIC_SUPABASE_KEY
  // );

  // const { data } = await supabase
  //   .from("clients")
  //   .insert({ client_name: "Mehdi Ahmed" });

  // console.log(data);

  // return new NextResponse(JSON.stringify(data));
  return new NextResponse(JSON.stringify("vakks"));
}
