import { createContext, useContext, useMemo, useState } from "react";

const AppDialogContext = createContext(null);

function AppDialogModal({ dialog, onClose }) {
    const [promptValue, setPromptValue] = useState(dialog.defaultValue ?? "");
    const isPrompt = dialog.type === "prompt";

    return (
        <div className="app-dialog-backdrop" onClick={() => onClose(false)}>
            <div className="app-dialog" onClick={(event) => event.stopPropagation()}>
                <div className="app-dialog__header">
                    <p className="app-dialog__eyebrow">{dialog.eyebrow ?? "Confirmación"}</p>
                    <h2>{dialog.title}</h2>
                    {dialog.message ? <p>{dialog.message}</p> : null}
                </div>

                {isPrompt ? (
                    <label className="app-dialog__field">
                        <span>{dialog.inputLabel ?? "Valor"}</span>
                        <input
                            type={dialog.inputType ?? "text"}
                            value={promptValue}
                            onChange={(event) => setPromptValue(event.target.value)}
                            placeholder={dialog.placeholder ?? ""}
                            autoFocus
                        />
                    </label>
                ) : null}

                <div className="app-dialog__actions">
                    <button type="button" className="customer-btn-secondary customer-btn-secondary--full" onClick={() => onClose(false)}>
                        {dialog.cancelLabel ?? "Cancelar"}
                    </button>
                    <button
                        type="button"
                        className="customer-btn-primary"
                        onClick={() => onClose(isPrompt ? promptValue : true)}
                    >
                        {dialog.confirmLabel ?? "Aceptar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AppDialogProvider({ children }) {
    const [dialog, setDialog] = useState(null);

    const openDialog = (type, options) => (
        new Promise((resolve) => {
            setDialog({
                ...options,
                type,
                resolve
            });
        })
    );

    const value = useMemo(() => ({
        confirm: (options) => openDialog("confirm", options),
        prompt: (options) => openDialog("prompt", options)
    }), []);

    const handleClose = (result) => {
        if (dialog?.resolve)
            dialog.resolve(result);

        setDialog(null);
    };

    return (
        <AppDialogContext.Provider value={value}>
            {children}
            {dialog ? <AppDialogModal dialog={dialog} onClose={handleClose} /> : null}
        </AppDialogContext.Provider>
    );
}

export function useAppDialog() {
    const context = useContext(AppDialogContext);
    if (!context)
        throw new Error("useAppDialog debe usarse dentro de AppDialogProvider");

    return context;
}
