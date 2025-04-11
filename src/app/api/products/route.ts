import { findProducts } from "@/products/queries";
import { NextRequest, NextResponse } from "next/server";
import { getGravatarInterests } from "@/app/api/products/get-gravatar-interests";

export async function GET( request: NextRequest ) {
	const { searchParams } = new URL( request.url );
	const hash = searchParams.get( "hash" );

	if ( ! hash ) {
		return NextResponse.json( { error: "Hash is required" }, { status: 400 } );
	}

	const interests = ( await getGravatarInterests( hash ) ).map( ( interest ) => interest.name );

	const products = await findProducts( interests );

	return NextResponse.json( { products } );
}
