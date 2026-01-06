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
import { useForm } from '@inertiajs/react';
import { useCreateDisciplina } from '@/hooks/Disciplinas/useCreateDisciplina';
import { CreateDisciplinaData } from '@/types/Disciplinas';

type CreateDisciplinaProps = {
    concursoId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export default function CreateDisciplina({
    concursoId,
    open,
    onOpenChange,
    onSuccess,
}: CreateDisciplinaProps) {
    const { isLoading, error, handleCreateDisciplina } = useCreateDisciplina();
    const { data, setData, reset } = useForm<CreateDisciplinaData>({
        concurso_id: concursoId,
        nome: '',
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nova disciplina</DialogTitle>
                    <DialogDescription>
                        Preencha os dados basicos para cadastrar uma disciplina.
                    </DialogDescription>
                </DialogHeader>

                <InputError message={error ?? undefined} />

                <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();

                        handleCreateDisciplina(data).then(() => {
                            if (!error) {
                                reset();
                                onOpenChange(false);
                                onSuccess();
                            }
                        });
                    }}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="disciplina-nome">Nome</Label>
                        <Input
                            id="disciplina-nome"
                            name="nome"
                            placeholder="Ex: Direito Constitucional"
                            value={data.nome}
                            onChange={(event) =>
                                setData('nome', event.target.value)
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
                            Salvar disciplina
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
