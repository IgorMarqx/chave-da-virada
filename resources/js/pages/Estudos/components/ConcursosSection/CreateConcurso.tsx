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
import { useCreateConcurso } from '@/hooks/Concursos/useCreateConcurso';
import { CreateConcursoData } from '@/types/Concursos';
import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

type CreateConcursoProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export default function CreateConcurso({
    open,
    onOpenChange,
    onSuccess
}: CreateConcursoProps) {
    const { isLoading, error, handleCreateConcurso } = useCreateConcurso();
    const { data, setData, reset } = useForm<CreateConcursoData>({
        nome: '',
        orgao: '',
        data_prova: '',
        descricao: '',
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Novo concurso</DialogTitle>
                    <DialogDescription>
                        Preencha os dados basicos para cadastrar um concurso.
                    </DialogDescription>
                </DialogHeader>

                <InputError message={error ?? undefined} />

                <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();

                        handleCreateConcurso(data).then(() => {
                            if (!error) {
                                reset();
                                onOpenChange(false);
                                onSuccess()
                            }
                        });
                    }}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="concurso-nome">Nome</Label>
                        <Input
                            id="concurso-nome"
                            name="nome"
                            placeholder="Ex: Analista TRF 3"
                            value={data.nome}
                            onChange={(event) =>
                                setData('nome', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concurso-orgao">Orgao</Label>
                        <Input
                            id="concurso-orgao"
                            name="orgao"
                            placeholder="Ex: TRF 3"
                            value={data.orgao}
                            onChange={(event) =>
                                setData('orgao', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concurso-data-prova">
                            Data da prova (opcional)
                        </Label>
                        <Input
                            id="concurso-data-prova"
                            name="data_prova"
                            type="date"
                            value={data.data_prova}
                            onChange={(event) =>
                                setData('data_prova', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concurso-descricao">
                            Descricao (opcional)
                        </Label>
                        <Input
                            id="concurso-descricao"
                            name="descricao"
                            placeholder="Ex: Edital previsto para abril"
                            value={data.descricao}
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
                            {isLoading && (<Spinner className="mr-2" />)}
                            Salvar concurso
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
