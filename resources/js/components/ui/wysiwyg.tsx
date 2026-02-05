import { useEffect, useRef, useState } from 'react';

import { ImagePickerModal } from '@/components/admin/image-picker-modal';
import type { ImageModel } from '@/types';

type WysiwygProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    allowHtmlSource?: boolean;
};

const commands = [
    { label: 'B', command: 'bold' },
    { label: 'I', command: 'italic' },
    { label: 'U', command: 'underline' },
    { label: '•', command: 'insertUnorderedList' },
    { label: '1.', command: 'insertOrderedList' },
    { label: 'H1', command: 'formatBlock', value: 'H1' },
    { label: 'H2', command: 'formatBlock', value: 'H2' },
    { label: 'P', command: 'formatBlock', value: 'P' },
];

export function WysiwygEditor({
    value,
    onChange,
    placeholder,
    disabled,
    allowHtmlSource = true,
}: WysiwygProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<Range | null>(null);
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [mode, setMode] = useState<'visual' | 'html'>('visual');

    useEffect(() => {
        if (!editorRef.current) return;
        if (editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const exec = (command: string, commandValue?: string) => {
        if (disabled) return;
        document.execCommand(command, false, commandValue);
        editorRef.current?.focus();
        onChange(editorRef.current?.innerHTML ?? '');
    };

    const saveSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        selectionRef.current = selection.getRangeAt(0);
    };

    const restoreSelection = () => {
        if (!selectionRef.current) return;
        const selection = window.getSelection();
        if (!selection) return;
        selection.removeAllRanges();
        selection.addRange(selectionRef.current);
    };

    const handleOpenImagePicker = () => {
        if (disabled) return;
        saveSelection();
        setIsImagePickerOpen(true);
    };

    const escapeAttribute = (value: string) => value.replace(/"/g, '&quot;');

    const handleImageSelect = (imageUrl: string, image: ImageModel) => {
        if (disabled) return;
        restoreSelection();
        const altText = escapeAttribute(image.title ?? image.slug ?? 'image');
        exec('insertHTML', `<img src=\"${imageUrl}\" alt=\"${altText}\" />`);
    };

    const insertLink = () => {
        if (disabled) return;
        const url = window.prompt('Link URL');
        if (!url) return;
        exec('createLink', url);
    };

    const insertTable = () => {
        if (disabled) return;
        const rowsRaw = window.prompt('Satır sayısı', '3');
        const colsRaw = window.prompt('Sütun sayısı', '3');
        const rows = Number(rowsRaw);
        const cols = Number(colsRaw);
        if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1) return;

        const table = [
            '<table style="width:100%; border-collapse: collapse;" border="1">',
            '<tbody>',
        ];
        for (let r = 0; r < rows; r += 1) {
            table.push('<tr>');
            for (let c = 0; c < cols; c += 1) {
                table.push('<td>&nbsp;</td>');
            }
            table.push('</tr>');
        }
        table.push('</tbody></table>');

        exec('insertHTML', table.join(''));
    };

    const handleInput = () => {
        onChange(editorRef.current?.innerHTML ?? '');
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-input bg-muted/30 p-2">
                {allowHtmlSource && (
                    <div className="flex items-center gap-1 rounded-md border border-input bg-background p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={() => setMode('visual')}
                            className={`rounded px-2 py-1 ${mode === 'visual' ? 'bg-muted font-semibold' : ''}`}
                            disabled={disabled}
                        >
                            Görsel
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('html')}
                            className={`rounded px-2 py-1 ${mode === 'html' ? 'bg-muted font-semibold' : ''}`}
                            disabled={disabled}
                        >
                            HTML
                        </button>
                    </div>
                )}

                {mode === 'visual' && (
                    <>
                        {commands.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    exec(item.command, item.value);
                                }}
                                className="rounded border border-transparent px-2 py-1 text-xs font-medium hover:border-input hover:bg-background"
                                disabled={disabled}
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            type="button"
                            onMouseDown={(event) => {
                                event.preventDefault();
                                insertLink();
                            }}
                            className="rounded border border-transparent px-2 py-1 text-xs font-medium hover:border-input hover:bg-background"
                            disabled={disabled}
                        >
                            Link
                        </button>
                        <button
                            type="button"
                            onMouseDown={(event) => {
                                event.preventDefault();
                                handleOpenImagePicker();
                            }}
                            className="rounded border border-transparent px-2 py-1 text-xs font-medium hover:border-input hover:bg-background"
                            disabled={disabled}
                        >
                            Görsel
                        </button>
                        <button
                            type="button"
                            onMouseDown={(event) => {
                                event.preventDefault();
                                insertTable();
                            }}
                            className="rounded border border-transparent px-2 py-1 text-xs font-medium hover:border-input hover:bg-background"
                            disabled={disabled}
                        >
                            Tablo
                        </button>
                        <button
                            type="button"
                            onMouseDown={(event) => {
                                event.preventDefault();
                                exec('removeFormat');
                            }}
                            className="rounded border border-transparent px-2 py-1 text-xs font-medium hover:border-input hover:bg-background"
                            disabled={disabled}
                        >
                            Temizle
                        </button>
                    </>
                )}
            </div>

            {mode === 'visual' ? (
                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    onInput={handleInput}
                    className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    data-placeholder={placeholder}
                    suppressContentEditableWarning
                />
            ) : (
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    rows={10}
                    className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder={placeholder}
                    disabled={disabled}
                />
            )}

            <ImagePickerModal
                open={isImagePickerOpen}
                onOpenChange={setIsImagePickerOpen}
                onSelect={handleImageSelect}
            />
        </div>
    );
}
