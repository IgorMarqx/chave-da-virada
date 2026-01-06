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
import { useCreateTopico } from '@/hooks/Topicos/useCreateTopico';
import { CreateTopicoData } from '@/types/Topicos';

type CreateTopicoProps = {
    disciplinaId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export default function CreateTopico({
    disciplinaId,
    open,
    onOpenChange,
    onSuccess,
}: CreateTopicoProps) {
    const { isLoading, error, handleCreateTopico } = useCreateTopico();
    const { data, setData, reset } = useForm<CreateTopicoData>({
        disciplina_id: disciplinaId,
        nome: '',
        descricao: '',
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Novo topico</DialogTitle>
                    <DialogDescription>
                        Preencha os dados basicos para cadastrar um topico.
                    </DialogDescription>
                </DialogHeader>

                <InputError message={error ?? undefined} />

                <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();

                        handleCreateTopico(data).then(() => {
                            if (!error) {
                                reset();
                                onOpenChange(false);
                                onSuccess();
                            }
                        });
                    }}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="topico-nome">Nome</Label>
                        <Input
                            id="topico-nome"
                            name="nome"
                            placeholder="Ex: Controle de constitucionalidade"
                            value={data.nome}
                            onChange={(event) =>
                                setData('nome', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="topico-descricao">Descricao</Label>
                        <Textarea
                            id="topico-descricao"
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
                            <Button
                                variant="secondary"
                                type="button"
                                className="cursor-pointer"
                            >
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                        >
                            {isLoading && <Spinner className="mr-2" />}
                            Salvar topico
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
