import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

type CreateConcursoProps = {
    onClose: () => void;
};

export default function CreateConcurso({ onClose }: CreateConcursoProps) {
    const { data, setData, reset } = useForm({
        nome: '',
        orgao: '',
        data_prova: '',
        descricao: '',
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600">
                    Novo concurso
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Novo concurso</DialogTitle>
                    <DialogDescription>
                        Preencha os dados basicos para cadastrar um concurso.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onClose();
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
                            <Button variant="secondary" type="button" className=' cursor-pointer'>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                        >
                            Salvar concurso
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
