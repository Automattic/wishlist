import Image from 'next/image';
import { User } from '@/types';
import { DbProduct } from '@/products/types';

type WishlistProps = {
	selectedProducts: DbProduct[];
	userData: User;
	currentCardIndex: number;
}

const Wishlist = ( {
	selectedProducts,
	userData,
	currentCardIndex,
}: WishlistProps ) => {
	const firstName = userData.display_name.split( ' ' )[ 0 ];

	return (
		<div className="flex flex-col h-full">
			<h2 className="text-black text-[32px] font-bold mt-3 mb-2">
				These are your { selectedProducts.length } picks for { firstName }
			</h2>
			<p className="text-black text-xl mb-8">
				It only took us { currentCardIndex } products to get here, good job.
			</p>
			<div className="flex-1 overflow-auto">
				<div className="grid grid-cols-3 gap-6 max-w-[348px] mx-auto">
					{ selectedProducts.map( ( product ) => (
						<a
							key={ product.id }
							className="aspect-square w-full max-w-[100px] rounded-full overflow-hidden bg-white border border-black mx-auto"
							href={ product.productUrl }
							target="_blank"
						>
							<Image
								src={ product.imageUrl }
								className="w-full h-full object-cover"
								width={ 100 }
								height={ 100 }
								alt={ product.productName }
							/>
						</a>
					) ) }
				</div>
			</div>
		</div>
	);
};

export default Wishlist;