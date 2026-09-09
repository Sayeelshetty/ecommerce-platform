function ConfirmDialog({ title, message, onCancel, onConfirm, busy = false }) {
  return <div className="confirm-backdrop" role="presentation"><div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">{title}</h2><p>{message}</p><div className="inline-actions"><button className="secondary-button" type="button" onClick={onCancel} disabled={busy}>Cancel</button><button className="danger-button" type="button" onClick={onConfirm} disabled={busy}>{busy ? "Working..." : "Confirm"}</button></div></div></div>;
}
export default ConfirmDialog;