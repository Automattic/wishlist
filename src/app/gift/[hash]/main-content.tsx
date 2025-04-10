import Image from 'next/image';
import { User } from '@/types';

type MainContentProps = {
	children: React.ReactNode;
	currentCardIndex: number;
	isLoadingUser: boolean;
	isLoadingProducts: boolean;
	userData: User;
}

export const MainContent = ( {
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
				transition: 'background-color 0.3s ease',
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