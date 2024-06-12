import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  console.log("Payment Response => ", data);

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function GET(request) {
  const data = await request.json();

  console.log(data);

  return new Response(JSON.stringify(data), { status: 200 });
}
