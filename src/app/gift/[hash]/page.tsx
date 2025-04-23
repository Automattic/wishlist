'use client';

import { useParams } from 'next/navigation';
import { useGravatarUser } from '../../../queries/user/index';
import { useRecommendedProducts } from '../../../queries/product/index';
import Image from 'next/image';
import React, { useState } from 'react';
import { DbProduct } from '../../../products/types';
import MainContent from './main-content';
import LoaderWrapper from './loader-wrapper';
import Footer from './footer';
import Wishlist from './wishlist';
import ProductCard from './product-card';

export default function GiftPage() {
	const { hash } = useParams<{ hash: string }>();
	const [ currentCardIndex, setCurrentCardIndex ] = useState( 0 );
	const [ selectedProducts, setSelectedProducts ] = useState<DbProduct[]>( [] );
	const [ isWishlistOpen, setIsWishlistOpen ] = useState( false );

	const {
		data: userData,
		isError: isFetchUserError,
		isFetching: isFetchingUser,
	} = useGravatarUser( hash );

	const {
		data: products,
		isError: isFetchProductsError,
		isFetching: isFetchingProducts,
	} = useRecommendedProducts( userData?.hash, {
		enabled: !! userData?.hash,
	} );

	// NOTE: A very good case to use React Suspense (if you want).
	if ( isFetchingUser ) {
		return (
			<LoaderWrapper
				isLoadingProducts={ isFetchingProducts }
				isLoadingUser={ isFetchingUser }
				userData={ userData }
			>
				<div className="rounded-full w-[120px] h-[120px] bg-gray-400 mb-6 animate-pulse" />
				<div className="mb-20 text-[15px] opacity-50">
					Fetching user data
				</div>
			</LoaderWrapper>
		);
	}

	if ( isFetchUserError ) {
		return (
			<LoaderWrapper
				isLoadingProducts={ isFetchingProducts }
				isLoadingUser={ isFetchingUser }
				userData={ userData }
			>
				<div>User not found</div>
			</LoaderWrapper>
		);
	}

	if ( isFetchingProducts ) {
		return (
			<LoaderWrapper
				isLoadingProducts={ isFetchingProducts }
				isLoadingUser={ isFetchingUser }
				userData={ userData }
			>
				<Image
					src={ `${ userData.avatar_url }?s=256` }
					alt={ userData.display_name }
					className="rounded-full w-[120px] h-[120px] mb-6"
					width={ 120 }
					height={ 120 }
				/>
				<div className="mb-20 text-[15px] opacity-50">
					Studying { userData.display_name }
				</div>
			</LoaderWrapper>
		);
	}

	if ( isFetchProductsError ) {
		return (
			<LoaderWrapper
				isLoadingProducts={ isFetchingProducts }
				isLoadingUser={ isFetchingUser }
				userData={ userData }
			>
				<div>Unable to fetch recommended products</div>
			</LoaderWrapper>
		);
	}

	if ( ! products?.length ) {
		return (
			<LoaderWrapper
				isLoadingProducts={ isFetchingProducts }
				isLoadingUser={ isFetchingUser }
				userData={ userData }
			>
				<div>No products available</div>
			</LoaderWrapper>
		);
	}

	const handleSwipeLeft = () => {
		// Add your "Not for me" logic here
		setCurrentCardIndex( prev => Math.min( prev + 1, ( products?.length ?? 1 ) - 1 ) );
	};

	const handleSwipeRight = ( product: DbProduct ) => {
		// Add your "Add to wishlist" logic here
		setCurrentCardIndex( prev => Math.min( prev + 1, ( products?.length ?? 1 ) - 1 ) );

		setSelectedProducts( ( currentProducts ) => {
			const newProducts = [ product, ...currentProducts ];

			if ( newProducts.length >= 9 ) {
				setIsWishlistOpen( true );
			}

			return newProducts;
		} );
	};

	return (
		<MainContent
			currentCardIndex={ currentCardIndex }
			isLoadingUser={ isFetchingUser }
			isLoadingProducts={ isFetchingProducts }
			userData={ userData }
		>
			{ isWishlistOpen ? (
				<Wishlist
					selectedProducts={ selectedProducts }
					userData={ userData }
					currentCardIndex={ currentCardIndex }
				/>
			) : (
				<>
					<div className="relative h-full product-card-wrapper">
						{ products.map( ( product, index ) => (
							<ProductCard
								key={ product.id }
								product={ product }
								onSwipeLeft={ () => handleSwipeLeft() }
								onSwipeRight={ () => handleSwipeRight( product ) }
								style={ {
									zIndex: products.length - index,
									pointerEvents: index === currentCardIndex ? 'auto' : 'none',
								} }
							/>
						) ) }
					</div>
					<Footer
						selectedProducts={ selectedProducts }
						onSeeWishlist={ () => {
							setIsWishlistOpen( true );
						} }
					/>
				</>
			) }
		</MainContent>
	);
}
