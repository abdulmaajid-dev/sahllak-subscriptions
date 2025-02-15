import { cookies } from "next/headers";

export async function POST(request) {

  const cookieStore = await cookies();
  cookieStore.set("isLoggedIn", true);

  const result = cookieStore.get("isLoggedIn");

  return new Response(JSON.stringify(result));
}

export async function GET(request) {
  
  const cookieStore = await cookies();
  cookieStore.delete("isLoggedIn");

  const result = cookieStore.getAll();

  return new Response(JSON.stringify(result));
}
