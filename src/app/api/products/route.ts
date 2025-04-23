import { NextRequest, NextResponse } from "next/server";
import { getGravatarInterests } from "@/app/api/products/get-gravatar-interests";
import { findProducts } from "@/products/db";
import { z } from "zod";

export const maxDuration = 60;

export async function GET( request: NextRequest ) {
	const { searchParams } = new URL( request.url );
	const hash = searchParams.get( "hash" );
	const budget = searchParams.get( "budget" );

	if ( ! hash ) {
		return NextResponse.json( { error: "Hash is required" }, { status: 400 } );
	}

	if ( ! budget ) {
		return NextResponse.json( { error: "Budget is required" }, { status: 400 } );
	}

	const interests = ( await getGravatarInterests( hash ) ).map( ( interest ) => interest.name );

	const splitBudget = budget.split( ":" );

	const { priceMin, priceMax } = z.object( {
		priceMin: z.coerce.number().default( 0 ),
		priceMax: z.coerce.number().default( Number.MAX_SAFE_INTEGER ),
	} ).parse( {
		priceMin: splitBudget[ 0 ],
		priceMax: splitBudget[ 1 ],
	} );

	const products = await findProducts( interests, priceMin, priceMax );

	return NextResponse.json( { products } );
}
