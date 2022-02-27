var mostrarMensaje = (status, mensaje) => {
    return new Promise((resolve, reject) => {
        if (status > 0) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                showConfirmButton: true,
                html: mensaje,
                onAfterClose: () => resolve(true)
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: mensaje,
                html: mensaje,
                onAfterClose: () => resolve(true)
            });
        }
    });
};
