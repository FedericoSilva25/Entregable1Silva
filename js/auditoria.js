const contenedor = document.getElementById("auditorias-container");
const btnBorrarTodo = document.getElementById("borrar-todas");

function cargarHistorial() {
  contenedor.innerHTML = "";
  const historial = JSON.parse(localStorage.getItem("auditorias") || "[]");

  if (historial.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No hay auditorías registradas.";
    contenedor.appendChild(mensaje);
    return;
  }

  historial.forEach((auditoria, index) => {
    const bloque = document.createElement("div");
    bloque.classList.add("bloque-auditoria");

    const titulo = document.createElement("h3");
    titulo.textContent = `Auditoría ${index + 1} - ${auditoria.fecha}`;

    const tabla = document.createElement("table");
    tabla.innerHTML = `
      <thead>
        <tr>
          <th>Producto</th>
          <th>Stock Total</th>
          <th>Ventas</th>
          <th>Restante</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        ${auditoria.datos.map(p => `
          <tr>
            <td>${p.nombre}</td>
            <td>${p.total}</td>
            <td>${p.venta}</td>
            <td>${p.restante}</td>
            <td style="color:${p.estado === "OK" ? "green" : "red"}">${p.estado}</td>
          </tr>
        `).join("")}
      </tbody>
    `;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar esta auditoría";
    btnEliminar.addEventListener("click", () => eliminarAuditoria(index));

    bloque.append(titulo, tabla, btnEliminar);
    contenedor.appendChild(bloque);
  });
}

function eliminarAuditoria(index) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminarlo!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const historial = JSON.parse(localStorage.getItem("auditorias") || "[]");
      historial.splice(index, 1);
      localStorage.setItem("auditorias", JSON.stringify(historial));
      cargarHistorial();
      Swal.fire(
        'Eliminado!',
        'La auditoría ha sido eliminada.',
        'success'
      );
    }
  });
}

btnBorrarTodo.addEventListener("click", () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡Esto eliminará todo el historial de auditorías y no podrás revertirlo!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar todo!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("auditorias");
      cargarHistorial();
      Swal.fire(
        'Historial Eliminado!',
        'Todo el historial de auditorías ha sido borrado.',
        'success'
      );
    }
  });
});

cargarHistorial();