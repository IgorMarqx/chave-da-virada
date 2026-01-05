import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="w-16 h-48 flex items-center justify-center">
                <AppLogoIcon className="" imageSrc='/assets/img/image.png' />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Chave da Virada
                </span>
            </div>
        </>
    );
}
