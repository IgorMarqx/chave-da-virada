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
import { useUpdateConcurso } from '@/hooks/Concursos/useUpdateConcurso';
import type { Concurso, UpdateConcursoData } from '@/types/Concursos';

type EditConcursoProps = {
    concurso: Concurso | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

const formatDateValue = (value?: string | null) => {
    if (!value) {
        return '';
    }

    return value.slice(0, 10);
};

export default function EditConcurso({
    concurso,
    open,
    onOpenChange,
    onSuccess,
}: EditConcursoProps) {
    const { isLoading, error, handleUpdateConcurso } = useUpdateConcurso();
    const { data, setData, reset } = useForm<UpdateConcursoData>({
        nome: '',
        orgao: '',
        data_prova: '',
        descricao: '',
    });

    useEffect(() => {
        if (concurso) {
            setData({
                nome: concurso.nome ?? '',
                orgao: concurso.orgao ?? '',
                data_prova: formatDateValue(concurso.data_prova),
                descricao: concurso.descricao ?? '',
            });
        } else {
            reset();
        }
    }, [concurso, reset, setData]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar concurso</DialogTitle>
                    <DialogDescription>
                        Atualize os dados do concurso selecionado.
                    </DialogDescription>
                </DialogHeader>

                <InputError message={error ?? undefined} />

                <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!concurso) {
                            return;
                        }

                        handleUpdateConcurso(concurso.id, data).then(() => {
                            if (!error) {
                                onOpenChange(false);
                                onSuccess();
                            }
                        });
                    }}
                >
                    <div className="grid gap-2">
                        <Label htmlFor="concurso-edit-nome">Nome</Label>
                        <Input
                            id="concurso-edit-nome"
                            name="nome"
                            placeholder="Ex: Analista TRF 3"
                            value={data.nome}
                            onChange={(event) =>
                                setData('nome', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concurso-edit-orgao">Orgao</Label>
                        <Input
                            id="concurso-edit-orgao"
                            name="orgao"
                            placeholder="Ex: TRF 3"
                            value={data.orgao}
                            onChange={(event) =>
                                setData('orgao', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concurso-edit-data-prova">
                            Data da prova (opcional)
                        </Label>
                        <Input
                            id="concurso-edit-data-prova"
                            name="data_prova"
                            type="date"
                            value={data.data_prova ?? ''}
                            onChange={(event) =>
                                setData('data_prova', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="concurso-edit-descricao">
                            Descricao (opcional)
                        </Label>
                        <Input
                            id="concurso-edit-descricao"
                            name="descricao"
                            placeholder="Ex: Edital previsto para abril"
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
