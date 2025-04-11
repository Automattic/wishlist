import MainContent from './main-content';
import { User } from '@/types';

type LoaderWrapperProps = {
	children: React.ReactNode;
	isLoadingUser: boolean;
	isLoadingProducts: boolean;
	userData: User;
}

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

export default LoaderWrapper;