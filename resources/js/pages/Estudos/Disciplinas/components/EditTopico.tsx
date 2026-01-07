import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useUpdateTopico } from '@/hooks/Topicos/useUpdateTopico';
import type { UpdateTopicoData } from '@/types/Topicos';

type TopicoResumo = {
    id: number;
    nome: string;
    descricao?: string | null;
};

type EditTopicoProps = {
    topico: TopicoResumo | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export default function EditTopico({
    topico,
    open,
    onOpenChange,
    onSuccess,
}: EditTopicoProps) {
    const { isLoading, error, handleUpdateTopico } = useUpdateTopico();
    const { data, setData, reset } = useForm<UpdateTopicoData>({
        nome: '',
        descricao: '',
    });

    useEffect(() => {
        if (topico) {
            setData({
                nome: topico.nome ?? '',
                descricao: topico.descricao ?? '',
            });
        } else {
            reset();
        }
    }, [topico, reset, setData]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar topico</DialogTitle>
                    <DialogDescription>
                        Atualize os dados do topico selecionado.
                    </DialogDescription>
                </DialogHeader>

                <InputError message={error ?? undefined} />

                <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!topico) {
                            return;
                        }

                        handleUpdateTopico(topico.id, data).then(() => {
                            if (!error) {
                                onOpenChange(false);
                                onSuccess();
                            }
                        });
                    }}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="topico-edit-nome">Nome</Label>
                        <Input
                            id="topico-edit-nome"
                            name="nome"
                            placeholder="Ex: Controle de constitucionalidade"
                            value={data.nome}
                            onChange={(event) =>
                                setData('nome', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="topico-edit-descricao">Descricao</Label>
                        <Textarea
                            id="topico-edit-descricao"
                            name="descricao"
                            placeholder="Opcional"
                            value={data.descricao ?? ''}
                            onChange={(event) =>
                                setData('descricao', event.target.value)
                            }
                        />
                    </div>
                    <DialogFooter className="gap-2 pt-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button" className="cursor-pointer">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                        >
                            {isLoading && <Spinner className="mr-2" />}
                            Salvar alteracoes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
