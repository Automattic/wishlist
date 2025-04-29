import Image from 'next/image';
import { User } from '@/types';
import { useSearchParams } from 'next/navigation';

type MainContentProps = {
	children: React.ReactNode;
	currentCardIndex: number;
	isLoadingUser: boolean;
	isLoadingProducts: boolean;
	userData: User;
	interests?: string[];
}

const MainContent = ( {
	children,
	currentCardIndex,
	isLoadingProducts,
	isLoadingUser,
	userData,
	interests,
}: MainContentProps ) => {
	// Background colors array
	const backgroundColors = [ '#FDE599', '#C7C7C7', '#DBB6B9', '#94D3E6' ];
	const currentBackgroundColor = backgroundColors[ currentCardIndex % backgroundColors.length ];
	const isLoading = isLoadingUser || isLoadingProducts;
	const searchParams = useSearchParams();

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
					<div className="flex items-center">
						<div className="relative group">
							<Image
								src={ `${ userData.avatar_url }?s=256` }
								alt={ userData.display_name }
								className="rounded-full w-[36px] h-[36px]"
								width={ 36 }
								height={ 36 }
							/>
							{ searchParams.has( 'debug' ) && (interests ?? []).length > 0 && (
								<div className="absolute right-0 top-full mt-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
									<div className="flex flex-col gap-1">
										<span className="font-semibold">User Interests:</span>
										{interests?.map((interest: string, index: number) => (
											<span key={index}>• {interest}</span>
										))}
									</div>
								</div>
							) }
						</div>
					</div>
				) }
			</div>
			{ children }
		</div>
	);
};

export default MainContent;
