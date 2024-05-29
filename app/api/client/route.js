import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data } = await supabase.from("clients").select();

  return new NextResponse(data);
}
