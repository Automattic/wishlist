'use client';

import { useParams } from 'next/navigation';
import { useGravatarUser } from '@/queries/user';
import { useRecommendedProducts } from '@/queries/product';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useRef } from 'react';

type WrapperParams = {
	children: React.ReactNode;
}

const Wrapper = ( { children }: WrapperParams ) => {
	return (
		<div className="h-full flex flex-col items-center justify-center gap-5">
			{ children }
		</div>
	);
};

type ProductCardProps = {
	product: {
		id: number;
		imageUrl: string;
		productName: string;
		priceMin?: number | null;
		currency?: string | null;
	};
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	style?: React.CSSProperties;
};

const ProductCard = ( { product, onSwipeLeft, onSwipeRight, style }: ProductCardProps ) => {
	const cardRef = useRef<HTMLDivElement>( null );
	const [ isDragging, setIsDragging ] = useState( false );
	const [ isExiting, setIsExiting ] = useState( false );

	// Motion values for the card's position
	const x = useMotionValue( 0 );
	const opacity = useTransform( x, [ -window.innerWidth, 0, window.innerWidth ], [ 0, 1, 0 ] );

	const handleDragEnd = async () => {
		const xValue = x.get();
		const threshold = 100;

		if ( xValue > threshold ) {
			// Swiped right
			setIsExiting( true );
			await animate( x, window.innerWidth * 1.5, { duration: 0.3 } );
			onSwipeRight?.();
		} else if ( xValue < -threshold ) {
			// Swiped left
			setIsExiting( true );
			await animate( x, -window.innerWidth * 1.5, { duration: 0.3 } );
			onSwipeLeft?.();
		} else {
			// Return to center
			await animate( x, 0, {
				type: 'spring',
				stiffness: 400,
				damping: 30,
			} );
		}
	};

	return (
		<motion.div
			ref={ cardRef }
			drag="x"
			dragDirectionLock
			dragConstraints={ { left: 0, right: 0 } }
			dragElastic={ 1 }
			onDragStart={ () => setIsDragging( true ) }
			onDragEnd={ () => {
				setIsDragging( false );
				handleDragEnd();
			} }
			style={ {
				...style,
				x,
				opacity: isExiting ? opacity : 1,
			} }
			className={ `product-card ${ isDragging ? 'cursor-grabbing' : '' }` }
			whileTap={ { scale: 1.02 } }
			initial={ { scale: 0.95, opacity: 0 } }
			animate={ { scale: 1, opacity: 1 } }
			exit={ { scale: 0.95, opacity: 0 } }
			transition={ { duration: 0.2 } }
		>
			<div className="flex-grow flex flex-col items-center justify-center">
				<Image
					src={ product.imageUrl }
					alt={ product.productName }
					width={ 305 }
					height={ 415 }
					className="w-[415px] h-[305px] object-contain"
				/>
			</div>
			<div className="flex flex-col">
				<div className="flex gap-2 py-2">
					{ [ ...Array( 5 ) ].map( ( _, index ) => (
						<Image
							key={ index }
							className="w-[16px] h-[16px]"
							src="/icons/ico-star.svg"
							width="16"
							height="16"
							alt=""
						/>
					) ) }
				</div>
				<span className="text-2xl">{ product.productName }</span>
				{ product.priceMin ? (
					<span className="text-2xl font-bold">{ product.priceMin.toLocaleString( 'en-EN', {
						style: 'currency',
						currency: product.currency ?? 'USD',
					} ) }</span>
				) : null }
				<div className="flex gap-4 mt-4">
					<motion.button
						className="flex-1 border-1 rounded-lg h-12"
						whileHover={ { scale: 1.02 } }
						whileTap={ { scale: 0.98 } }
						onClick={ async () => {
							await animate( x, -window.innerWidth * 1.5, { duration: 0.3 } );
							onSwipeLeft?.();
						} }
					>
						Not for me
					</motion.button>
					<motion.button
						className="flex-1 bg-black text-white rounded-lg"
						whileHover={ { scale: 1.02 } }
						whileTap={ { scale: 0.98 } }
						onClick={ async () => {
							await animate( x, window.innerWidth * 1.5, { duration: 0.3 } );
							onSwipeRight?.();
						} }
					>
						Add to wishlist
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
};

export default function GiftPage() {
	const { hash } = useParams<{ hash: string }>();
	const [ currentCardIndex, setCurrentCardIndex ] = useState( 0 );

	// Background colors array
	const backgroundColors = [ '#FDE599', '#C7C7C7', '#DBB6B9', '#94D3E6' ];
	const currentBackgroundColor = backgroundColors[ currentCardIndex % backgroundColors.length ];

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
		return <Wrapper>
			<div className="rounded-full w-[120px] h-[120px] bg-gray-400 mb-6 animate-pulse" />
			<div className="mb-20 text-[15px] opacity-50">
				Fetching user data
			</div>
		</Wrapper>;
	}

	if ( isFetchUserError ) {
		return <div>User not found</div>;
	}

	if ( ! userData ) {
		return null;
	}

	if ( isFetchingProducts ) {
		return <Wrapper>
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
		</Wrapper>;
	}

	if ( isFetchProductsError ) {
		return <div>Unable to fetch recommended products</div>;
	}

	if ( ! products?.length ) {
		return <div>No products available</div>;
	}

	const handleSwipeLeft = ( productId: number ) => {
		console.log( 'Swiped left on product:', productId );
		// Add your "Not for me" logic here
		setCurrentCardIndex( prev => Math.min( prev + 1, ( products?.length ?? 1 ) - 1 ) );
	};

	const handleSwipeRight = ( productId: number ) => {
		console.log( 'Swiped right on product:', productId );
		// Add your "Add to wishlist" logic here
		setCurrentCardIndex( prev => Math.min( prev + 1, ( products?.length ?? 1 ) - 1 ) );
	};

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
				<Image
					src={ `${ userData.avatar_url }?s=256` }
					alt={ userData.display_name }
					className="rounded-full w-[36px] h-[36px]"
					width={ 36 }
					height={ 36 }
				/>
			</div>
			<div className="relative h-full">
				{ products.map( ( product, index ) => (
					<ProductCard
						key={ product.id }
						product={ product }
						onSwipeLeft={ () => handleSwipeLeft( product.id ) }
						onSwipeRight={ () => handleSwipeRight( product.id ) }
						style={ {
							zIndex: products.length - index,
							opacity: index === currentCardIndex ? 1 : 0,
							transform: `scale(${ index === currentCardIndex ? 1 : 0.95 })`,
							pointerEvents: index === currentCardIndex ? 'auto' : 'none',
						} }
					/>
				) ) }
			</div>
			<div className="h-[72px] flex items-center justify-center gap-2 mt-6">
				<span className="max-w-[170px] text-center">Swipe any card right to add it to your wishlist</span>
				<Image
					src="/images/styled-arrow-right.svg"
					className="w-[24px] h-[17px]"
					width="24"
					height="17"
					alt=""
				/>
			</div>
		</div>
	);
}
