import { ImgHTMLAttributes } from 'react';

type AppLogoIconProps = {
    props: ImgHTMLAttributes<HTMLImageElement>;
    imageSrc?: string;
}

export default function AppLogoIcon(props: AppLogoIconProps) {
    return (
        <img
            {...props}
            src={props.imageSrc ?? "/assets/img/chave_virada_sem_fundo-4.png"}
            alt={'Chave da Virada'}
        />
    );
}
