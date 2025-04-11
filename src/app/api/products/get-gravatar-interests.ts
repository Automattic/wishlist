export async function getGravatarInterests( emailHash: string ): Promise<{ name: string, id: number }[]> {
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
