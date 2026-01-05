import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/assets/img/chave_virada_sem_fundo-4.png"
            alt={props.alt ?? 'Chave da Virada'}
        />
    );
}
