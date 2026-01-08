import { useCallback, useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';

type FloatingMode = 'pip' | 'popup';

type DocumentPictureInPicture = {
    requestWindow: (options?: { width?: number; height?: number }) => Promise<Window>;
};

type UseFloatingNotesParams = {
    topicoId: number;
    notes: string;
    autosaveState: 'idle' | 'saving' | 'saved';
    autosaveAt: string | null;
    onNotesChange: (value: string) => void;
    editor: Editor | null;
};

type UseFloatingNotesResult = {
    isFloatingEnabled: boolean;
    isFloatingOpen: boolean;
    floatingMode: FloatingMode | null;
    openFloatingNotes: (requestedMode?: FloatingMode) => Promise<void>;
    toggleFloatingEnabled: () => void;
};

export default function useFloatingNotes({
    topicoId,
    notes,
    autosaveState,
    autosaveAt,
    onNotesChange,
    editor,
}: UseFloatingNotesParams): UseFloatingNotesResult {
    const [isFloatingEnabled, setIsFloatingEnabled] = useState(false);
    const [floatingMode, setFloatingMode] = useState<FloatingMode | null>(null);
    const [isFloatingOpen, setIsFloatingOpen] = useState(false);
    const floatingWindowRef = useRef<Window | null>(null);
    const floatingEditorRef = useRef<HTMLElement | null>(null);
    const floatingStatusRef = useRef<HTMLElement | null>(null);
    const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
    const floatingChannelRef = useRef<BroadcastChannel | null>(null);
    const suppressBroadcastRef = useRef(false);
    const lastUpdateRef = useRef<{ source: 'main' | 'pip'; at: number }>({
        source: 'main',
        at: 0,
    });
    const floatingEnabledKey = `study-notes-floating-enabled-${topicoId}`;
    const floatingChannelName = `study-notes-${topicoId}`;

    const getDocumentPictureInPicture = () => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        return (window as Window & { documentPictureInPicture?: DocumentPictureInPicture })
            .documentPictureInPicture;
    };

    const supportsDocumentPip = () => Boolean(getDocumentPictureInPicture());

    const resolveFloatingMode = (): FloatingMode =>
        supportsDocumentPip() ? 'pip' : 'popup';

    const updateFloatingStatus = useCallback(
        (nextState: typeof autosaveState, nextAt: string | null) => {
            const statusEl = floatingStatusRef.current;
            if (!statusEl) {
                return;
            }

            const text =
                nextState === 'saving'
                    ? 'Salvando automaticamente...'
                    : nextAt
                        ? `Salvo automaticamente ${nextAt}`
                        : 'Salvo automaticamente';

            statusEl.textContent = text;
            statusEl.dataset.state = nextState;
        },
        []
    );

    const updateFloatingContent = useCallback((nextNotes: string) => {
        const floatingWindow = floatingWindowRef.current;
        if (!floatingWindow || floatingWindow.closed) {
            return;
        }

        const editorEl =
            floatingEditorRef.current ??
            floatingWindow.document.getElementById('study-notes-editor');
        if (!editorEl) {
            return;
        }

        floatingEditorRef.current = editorEl;

        const activeElement = floatingWindow.document.activeElement;
        if (
            lastUpdateRef.current.source === 'pip' &&
            Date.now() - lastUpdateRef.current.at < 300 &&
            activeElement === editorEl
        ) {
            return;
        }

        if (editorEl.innerHTML !== nextNotes) {
            editorEl.innerHTML = nextNotes || '';
        }
    }, []);

    const mountFloatingEditor = useCallback(
        (floatingWindow: Window) => {
            const doc = floatingWindow.document;
            doc.title = 'Anotacoes';
            doc.body.innerHTML = `
                <div id="study-notes-shell">
                    <header>
                        <div class="title">Anotacoes rapidas</div>
                        <button type="button" id="study-notes-close">Fechar</button>
                    </header>
                    <div class="toolbar">
                        <button type="button" data-command="bold" title="Negrito">B</button>
                        <button type="button" data-command="italic" title="Italico">I</button>
                        <button type="button" data-command="underline" title="Sublinhado">U</button>
                        <button type="button" data-command="strikeThrough" title="Riscado">S</button>
                        <button type="button" data-command="formatBlock" data-value="blockquote" title="Citacao">"</button>
                        <button type="button" data-command="formatBlock" data-value="pre" title="Codigo">{}</button>
                        <span class="divider"></span>
                        <button type="button" data-command="insertUnorderedList" title="Lista">UL</button>
                        <button type="button" data-command="insertOrderedList" title="Lista numerada">OL</button>
                        <span class="divider"></span>
                        <button type="button" data-command="justifyLeft" title="Alinhar a esquerda">L</button>
                        <button type="button" data-command="justifyCenter" title="Centralizar">C</button>
                        <button type="button" data-command="justifyRight" title="Alinhar a direita">R</button>
                        <span class="divider"></span>
                        <button type="button" data-command="createLink" title="Inserir link">Link</button>
                        <button type="button" data-command="undo" title="Desfazer">Undo</button>
                        <button type="button" data-command="redo" title="Refazer">Redo</button>
                        <span class="divider"></span>
                        <label class="color-label" title="Cor do texto">
                            Txt
                            <input type="color" data-command="foreColor" />
                        </label>
                        <label class="color-label" title="Destaque">
                            HL
                            <input type="color" data-command="hiliteColor" />
                        </label>
                    </div>
                    <div id="study-notes-editor" contenteditable="true"></div>
                    <footer>
                        <span class="status" id="study-notes-status">Salvo automaticamente</span>
                    </footer>
                </div>
            `;

            const style = doc.createElement('style');
            style.textContent = `
                * { box-sizing: border-box; }
                body {
                    margin: 0;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    background: #f0fdf4;
                    color: #0f172a;
                }
                #study-notes-shell {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 12px;
                    background: linear-gradient(90deg, #10b981, #14b8a6);
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                }
                header .title {
                    font-size: 13px;
                    letter-spacing: 0.3px;
                    text-transform: uppercase;
                }
                header button {
                    border: 0;
                    background: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    padding: 4px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                }
                .toolbar {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-wrap: wrap;
                    padding: 8px 10px;
                    background: #ecfdf5;
                    border-bottom: 1px solid #d1fae5;
                }
                .toolbar button {
                    border: 1px solid #d1fae5;
                    background: #fff;
                    color: #047857;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                    cursor: pointer;
                }
                .toolbar button:hover {
                    background: #d1fae5;
                }
                .toolbar .divider {
                    width: 1px;
                    height: 18px;
                    background: #d1fae5;
                }
                .toolbar .color-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 0 6px;
                    border: 1px solid #d1fae5;
                    border-radius: 6px;
                    background: #fff;
                    font-size: 11px;
                    color: #047857;
                }
                .toolbar input[type="color"] {
                    width: 18px;
                    height: 18px;
                    padding: 0;
                    border: 0;
                    background: transparent;
                    cursor: pointer;
                }
                #study-notes-editor {
                    flex: 1;
                    padding: 12px;
                    overflow-y: auto;
                    background: #fff;
                    outline: none;
                }
                footer {
                    padding: 6px 10px;
                    background: #ecfdf5;
                    font-size: 12px;
                    color: #047857;
                }
                .status[data-state="saving"] {
                    color: #b45309;
                }
            `;
            doc.head.appendChild(style);

            const editorEl = doc.getElementById('study-notes-editor');
            if (editorEl) {
                floatingEditorRef.current = editorEl;
                editorEl.innerHTML = notes || '';
                editorEl.addEventListener('input', () => {
                    const nextValue = editorEl.innerHTML;
                    onNotesChange(nextValue);
                    lastUpdateRef.current = { source: 'pip', at: Date.now() };
                    floatingChannelRef.current?.postMessage({
                        type: 'notes:update',
                        content: nextValue,
                        source: 'pip',
                    });
                });
            }

            const toolbarButtons = Array.from(doc.querySelectorAll('[data-command]'));
            toolbarButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const command = button.getAttribute('data-command');
                    const commandValue = button.getAttribute('data-value');
                    if (!command) {
                        return;
                    }

                    editorEl?.focus();
                    if (command === 'createLink') {
                        const url = floatingWindow.prompt('URL do link');
                        if (!url) {
                            return;
                        }
                        doc.execCommand('createLink', false, url);
                    } else if (command === 'formatBlock') {
                        doc.execCommand('formatBlock', false, commandValue);
                    } else {
                        doc.execCommand(command);
                    }
                    editorEl?.dispatchEvent(new Event('input', { bubbles: true }));
                });
            });

            const colorInputs = Array.from(
                doc.querySelectorAll('input[type="color"][data-command]')
            );
            colorInputs.forEach((input) => {
                input.addEventListener('input', (event) => {
                    const target = event.currentTarget as HTMLInputElement;
                    const command = target.getAttribute('data-command');
                    if (!command) {
                        return;
                    }

                    editorEl?.focus();
                    doc.execCommand(command, false, target.value);
                    editorEl?.dispatchEvent(new Event('input', { bubbles: true }));
                });
            });

            const closeButton = doc.getElementById('study-notes-close');
            closeButton?.addEventListener('click', () => {
                floatingWindow.close();
            });

            floatingStatusRef.current = doc.getElementById('study-notes-status');
            updateFloatingStatus(autosaveState, autosaveAt);

            floatingChannelRef.current?.close();
            const channel = new floatingWindow.BroadcastChannel(floatingChannelName);
            floatingChannelRef.current = channel;
            channel.onmessage = (event) => {
                const payload = event.data as {
                    type?: string;
                    content?: string;
                    source?: string;
                };

                if (payload?.type !== 'notes:update' || payload.source === 'pip') {
                    return;
                }

                const nextValue = payload.content ?? '';
                if (editorEl && doc.activeElement === editorEl) {
                    return;
                }
                if (editorEl && editorEl.innerHTML !== nextValue) {
                    editorEl.innerHTML = nextValue;
                }
            };
        },
        [
            autosaveAt,
            autosaveState,
            floatingChannelName,
            notes,
            onNotesChange,
            updateFloatingStatus,
        ]
    );

    const openFloatingNotes = useCallback(
        async (requestedMode?: FloatingMode) => {
            if (typeof window === 'undefined') {
                return;
            }

            const existingWindow = floatingWindowRef.current;
            if (existingWindow && !existingWindow.closed) {
                existingWindow.focus();
                return;
            }

            const preferredMode = requestedMode ?? resolveFloatingMode();
            let nextWindow: Window | null = null;
            let nextMode: FloatingMode = preferredMode;

            try {
                if (preferredMode === 'pip' && supportsDocumentPip()) {
                    const pip = await getDocumentPictureInPicture()?.requestWindow({
                        width: 420,
                        height: 520,
                    });
                    nextWindow = pip ?? null;
                } else {
                    nextWindow = window.open(
                        '',
                        'study-notes-floating',
                        'width=420,height=520'
                    );
                }
            } catch {
                if (preferredMode === 'pip') {
                    nextWindow = window.open(
                        '',
                        'study-notes-floating',
                        'width=420,height=520'
                    );
                    nextMode = 'popup';
                }
            }

            if (!nextWindow) {
                return;
            }

            floatingWindowRef.current = nextWindow;
            setFloatingMode(nextMode);
            setIsFloatingOpen(true);
            mountFloatingEditor(nextWindow);

            const handleClose = () => {
                floatingWindowRef.current = null;
                floatingEditorRef.current = null;
                floatingStatusRef.current = null;
                floatingChannelRef.current?.close();
                floatingChannelRef.current = null;
                setIsFloatingOpen(false);
            };

            nextWindow.addEventListener('beforeunload', handleClose);
        },
        [mountFloatingEditor]
    );

    const toggleFloatingEnabled = useCallback(() => {
        setIsFloatingEnabled((prev) => {
            const next = !prev;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(floatingEnabledKey, String(next));
            }
            return next;
        });
    }, [floatingEnabledKey]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const storedFloating = window.localStorage.getItem(floatingEnabledKey);
        setIsFloatingEnabled(storedFloating === 'true');
    }, [floatingEnabledKey]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const channel = new BroadcastChannel(floatingChannelName);
        broadcastChannelRef.current = channel;

        channel.onmessage = (event) => {
            const payload = event.data as { type?: string; content?: string; source?: string };
            if (payload?.type !== 'notes:update' || payload.source === 'main') {
                return;
            }

            const nextValue = payload.content ?? '';
            lastUpdateRef.current = { source: 'pip', at: Date.now() };
            suppressBroadcastRef.current = true;
            onNotesChange(nextValue);
            if (editor && editor.getHTML() !== nextValue) {
                editor.commands.setContent(nextValue || '', { emitUpdate: false });
            }
        };

        return () => {
            channel.close();
            broadcastChannelRef.current = null;
        };
    }, [editor, floatingChannelName, onNotesChange]);

    useEffect(() => {
        const channel = broadcastChannelRef.current;
        if (!channel) {
            return;
        }

        if (suppressBroadcastRef.current) {
            suppressBroadcastRef.current = false;
            return;
        }

        lastUpdateRef.current = { source: 'main', at: Date.now() };
        channel.postMessage({ type: 'notes:update', content: notes, source: 'main' });
    }, [notes]);

    useEffect(() => {
        if (!isFloatingEnabled) {
            return;
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                void openFloatingNotes();
            }
        };

        const handlePageHide = () => {
            void openFloatingNotes();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, [isFloatingEnabled, openFloatingNotes]);

    useEffect(() => {
        updateFloatingContent(notes);
    }, [notes, updateFloatingContent]);

    useEffect(() => {
        updateFloatingStatus(autosaveState, autosaveAt);
    }, [autosaveAt, autosaveState, updateFloatingStatus]);

    useEffect(() => {
        return () => {
            floatingWindowRef.current?.close();
        };
    }, []);

    return {
        isFloatingEnabled,
        isFloatingOpen,
        floatingMode,
        openFloatingNotes,
        toggleFloatingEnabled,
    };
}
