import { findProducts } from "@/products/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash");

  if (!hash) {
    return NextResponse.json({ error: "Hash is required" }, { status: 400 });
  }

  const products = await findProducts(["running", "bread"])

  return NextResponse.json({ products });
}
