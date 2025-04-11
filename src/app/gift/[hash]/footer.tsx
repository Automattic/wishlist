import Image from 'next/image';
import { DbProduct } from '@/products/types';

type FooterProps = {
	selectedProducts: DbProduct[];
	onSeeWishlist: () => void;
}

const Footer = ( { selectedProducts, onSeeWishlist }: FooterProps ) => {
	return (
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
						{ selectedProducts.slice( 0, 3 ).map( ( product, index ) => {
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
						{ selectedProducts.length > 3 && (
							<div
								className="w-[72px] h-[72px] rounded-full overflow-hidden bg-white border border-black flex items-center justify-center"
								style={ { marginLeft: '-24px' } }
							>
								<span className="text-xl font-bold">+{ selectedProducts.length - 3 }</span>
							</div>
						) }
					</div>
					<button
						className="flex items-center gap-1 shrink-0 cursor-pointer"
						onClick={ onSeeWishlist }
					>
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
	);
};

export default Footer;