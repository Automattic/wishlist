'use client';

import { useParams } from 'next/navigation';
import { useGravatarUser } from '@/queries/user';
import { useRecommendedProducts } from '@/queries/product';
import Image from 'next/image';
import React, { useState } from 'react';
import ProductCard from '@/components/product-card';
import { User } from '@/types';
import { DbProduct } from '@/products/types';

type MainContentProps = {
	children: React.ReactNode;
	currentCardIndex: number;
	isLoadingUser: boolean;
	isLoadingProducts: boolean;
	userData: User;
}

const MainContent = ( {
	children,
	currentCardIndex,
	isLoadingProducts,
	isLoadingUser,
	userData,
}: MainContentProps ) => {
	// Background colors array
	const backgroundColors = [ '#FDE599', '#C7C7C7', '#DBB6B9', '#94D3E6' ];
	const currentBackgroundColor = backgroundColors[ currentCardIndex % backgroundColors.length ];
	const isLoading = isLoadingUser || isLoadingProducts;

	return (
		<div
			className="h-full overflow-hidden flex flex-col px-5 py-4 pb-8 relative"
			style={ {
				backgroundColor: currentBackgroundColor,
				transition: 'background-color 0.1s ease',
			} }
		>
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold text-[var(--color-light-black)]">WiSH</h1>
				{ ( ! isLoading && userData ) && (
					<Image
						src={ `${ userData.avatar_url }?s=256` }
						alt={ userData.display_name }
						className="rounded-full w-[36px] h-[36px]"
						width={ 36 }
						height={ 36 }
					/>
				) }
			</div>
			{ children }
		</div>
	);
};

type LoaderWrapperProps = Omit<MainContentProps, 'currentCardIndex'>

const LoaderWrapper = ( { children, isLoadingProducts, isLoadingUser, userData }: LoaderWrapperProps ) => {
	return (
		<MainContent
			currentCardIndex={ 0 }
			isLoadingUser={ isLoadingUser }
			isLoadingProducts={ isLoadingProducts }
			userData={ userData }
		>
			<div className="h-full flex flex-col items-center justify-center gap-5">
				{ children }
			</div>
		</MainContent>
	);
};

export default function GiftPage() {
	const { hash } = useParams<{ hash: string }>();
	const [ currentCardIndex, setCurrentCardIndex ] = useState( 0 );
	const [ selectedProducts, setSelectedProducts ] = useState<DbProduct[]>( [] );

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

	const handleSwipeLeft = ( product: DbProduct ) => {
		console.log( 'Swiped left on product:', product.id );
		// Add your "Not for me" logic here
		setCurrentCardIndex( prev => Math.min( prev + 1, ( products?.length ?? 1 ) - 1 ) );
	};

	const handleSwipeRight = ( product: DbProduct ) => {
		console.log( 'Swiped right on product:', product.id );
		// Add your "Add to wishlist" logic here
		setCurrentCardIndex( prev => Math.min( prev + 1, ( products?.length ?? 1 ) - 1 ) );

		setSelectedProducts( ( currentProducts ) => {
			return [ ...currentProducts, product ];
		} );
	};

	return (
		<MainContent
			currentCardIndex={ currentCardIndex }
			isLoadingUser={ isFetchingUser }
			isLoadingProducts={ isFetchingProducts }
			userData={ userData }
		>
			<div className="relative h-full product-card-wrapper">
				{ products.map( ( product, index ) => (
					<ProductCard
						key={ product.id }
						product={ product }
						onSwipeLeft={ () => handleSwipeLeft( product ) }
						onSwipeRight={ () => handleSwipeRight( product ) }
						style={ {
							zIndex: products.length - index,
							opacity: index === currentCardIndex ? 1 : 0,
							transform: `scale(${ index === currentCardIndex ? 1 : 0.95 })`,
							pointerEvents: index === currentCardIndex ? 'auto' : 'none',
						} }
					/>
				) ) }
			</div>
			<div className="h-[72px] flex items-center justify-center shrink-0 gap-2 mt-6">
				{ selectedProducts.length === 0 ? (
					<>
						<span className="max-w-[170px] text-center">Swipe any card right to add it to your wishlist</span>
						<Image
							src="/images/styled-arrow-right.svg"
							className="w-[24px] h-[17px]"
							width="24"
							height="17"
							alt=""
						/>
					</>
				) : (
					<>
						<div className="w-full flex">
							{ selectedProducts.map( ( product, index ) => {
								return (
									<div
										key={ product.id }
										className="w-[72px] h-[72px] rounded-full overflow-hidden bg-white border boder-black"
										style={ index ? { marginLeft: '-24px' } : undefined }
									>
										<Image
											src={ product.imageUrl }
											className="w-[72px] h-[72px] object-cover"
											width={ 72 }
											height={ 72 }
											alt=""
										/>
									</div>
								);
							} ) }
						</div>
						<button className="flex items-center gap-1 shrink-0 cursor-pointer">
							<span>See wishlist</span>
							<Image
								src="/icons/ico-arrow-right.svg"
								className="w-[24px] h-[24px]"
								width={ 24 }
								height={ 24 }
								alt=""
							/>
						</button>
					</>
				) }


			</div>
		</MainContent>
	);
}
