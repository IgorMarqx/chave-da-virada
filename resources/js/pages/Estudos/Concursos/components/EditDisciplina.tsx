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
import { useForm } from '@inertiajs/react';
import { useUpdateDisciplina } from '@/hooks/Disciplinas/useUpdateDisciplina';
import type { UpdateDisciplinaData } from '@/types/Disciplinas';

type DisciplinaResumo = {
    id: number;
    nome: string;
};

type EditDisciplinaProps = {
    disciplina: DisciplinaResumo | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export default function EditDisciplina({
    disciplina,
    open,
    onOpenChange,
    onSuccess,
}: EditDisciplinaProps) {
    const { isLoading, error, handleUpdateDisciplina } = useUpdateDisciplina();
    const { data, setData, reset } = useForm<UpdateDisciplinaData>({
        nome: '',
    });

    useEffect(() => {
        if (disciplina) {
            setData({ nome: disciplina.nome ?? '' });
        } else {
            reset();
        }
    }, [disciplina, reset, setData]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar disciplina</DialogTitle>
                    <DialogDescription>
                        Atualize o nome da disciplina selecionada.
                    </DialogDescription>
                </DialogHeader>

                <InputError message={error ?? undefined} />

                <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!disciplina) {
                            return;
                        }

                        handleUpdateDisciplina(disciplina.id, data).then(() => {
                            if (!error) {
                                onOpenChange(false);
                                onSuccess();
                            }
                        });
                    }}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="disciplina-edit-nome">Nome</Label>
                        <Input
                            id="disciplina-edit-nome"
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
