import Swal from "sweetalert2";

const ResponseModal = ({ type, title, message, onClose, duration = 5000 }) => {
  Swal.fire({
    icon: type,
    title: title,
    text: message,
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    didClose: () => {
      if (onClose) onClose();
    },
  });

  return null;
};

export default ResponseModal;
