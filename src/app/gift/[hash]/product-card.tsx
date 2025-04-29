import { useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ProductVectorResult } from '@/products/types';
import { useSearchParams } from 'next/navigation';

type ProductCardProps = {
	product: ProductVectorResult;
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	style?: React.CSSProperties;
	userInterests?: string[];
};

const ProductCard = ( { product, onSwipeLeft, onSwipeRight, style, userInterests }: ProductCardProps ) => {
	const cardRef = useRef<HTMLDivElement>( null );
	const [ isDragging, setIsDragging ] = useState( false );
	const [ isExiting, setIsExiting ] = useState( false );
	const searchParams = useSearchParams();

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
			exit={ { scale: 0.95, opacity: 0 } }
			transition={ { duration: 0.2 } }
		>
			<div className="flex-grow flex flex-col items-center justify-center overflow-hidden">
				<img
					src={ product.imageUrl }
					alt={ product.productName }
					className="w-full h-full object-contain pointer-events-none"
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
					{ searchParams.has( 'debug' ) && ( product.interests ?? [] ).length > 0 ? (
						<div className="relative inline-block group">
							<span className="ml-2 cursor-help inline-block relative">︖
								<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
									<div className="flex flex-col gap-1">
										{product.interests?.map(( interest, index ) => (
											<span key={ `${product.id}-${index}` } className={ `${userInterests?.includes( interest ) ? 'text-green-500' : 'text-red-500' }` }>• { interest }</span>
										))}
									</div>
									<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
								</div>
							</span>
						</div>
					) : null }
				</div>
				<span className="text-2xl truncate">
					{ product.productName }
				</span>
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

export default ProductCard;
