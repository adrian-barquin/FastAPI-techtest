import { createPortal } from "react-dom";

export default function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <p>
          ¿Está seguro de que desea eliminar?<br />
          <strong>Esta acción no se puede deshacer.</strong>
        </p>

        <div className="modal-actions">
          <button className="danger" onClick={onConfirm}>
            Eliminar
          </button>
          <button className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}