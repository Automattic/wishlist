import { findProducts } from "@/products/queries";
import { DbProduct } from "@/products/types";

const getGravatarInterests = async ( emailHash: string ): Promise<{name: string, id: number}[]> => {
	// Get known interests from Gravatar profile.
	const response = await fetch( `https://api.gravatar.com/v3/profiles/${ emailHash }` );
	if ( ! response.ok ) {
		throw new Error( 'Failed to fetch Gravatar profile' );
	}
	const data = await response.json();
	const profileInterests = data.interests || [];

	// Get inferred interests.
	const inferredInterestsResponse = await fetch( `https://api.gravatar.com/v3/profiles/${ emailHash }/inferred-interests` );
	if ( ! inferredInterestsResponse.ok ) {
		throw new Error( 'Failed to fetch inferred interests' );
	}
	const inferredInterestsData = await inferredInterestsResponse.json();

	// Combine known and inferred interests.
	return [ ...new Set( [ ...profileInterests, ...inferredInterestsData ] ) ];
}

/**
 * API route handler that returns product recommendations based on email hash
 * This is a placeholder implementation that will be replaced with actual Gravatar and OpenAI integration
 */
export async function GET( request: Request ) {
	const url = new URL( request.url );
	const emailHash = url.searchParams.get( 'emailHash' );

	if ( ! emailHash ) {
		return Response.json( { error: 'Missing emailHash parameter' }, { status: 400 } );
	}

	try {
		const interests = await getGravatarInterests( emailHash );
		const foundProducts = await findProducts( interests.map(i => i.name) );

		// Keep only products with imageUrl starting with https
		const validProducts = foundProducts.filter( ( product: DbProduct ) => {
			return product.imageUrl && product.imageUrl.startsWith( 'https' );
		} );

		// Get maximum 20 products (randomly)
		const twentyRandomProducts = validProducts.sort( () => Math.random() - 0.5 ).slice( 0, 20 );

		console.log("Found " + validProducts.length + " products using maximum 20 randomly");

		return Response.json( { emailHash, recommendations: twentyRandomProducts } );
	} catch ( error ) {
		console.error( 'Error fetching recommendations:', error );
		return Response.json( { error: 'Failed to fetch interests from Gravatar' }, { status: 500 } );
	}
}
