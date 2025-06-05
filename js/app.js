// === Control Semanal ===
fetch('data/productos.json')
    .then(res => res.json())
    .then(productos => {
        const contenedor = document.getElementById("semanal-container");
        const tabla = document.createElement("table");

        const thead = document.createElement("thead");
        thead.innerHTML = `
      <tr>
        <th>Producto</th>
        <th>Stock Actual</th>
        <th>Stock Ideal</th>
        <th>Faltante</th>
      </tr>
    `;

        const tbody = document.createElement("tbody");

        productos.forEach(p => {
            const fila = document.createElement("tr");

            const tdNombre = document.createElement("td");
            tdNombre.textContent = p.nombre;

            const inputStock = document.createElement("input");
            inputStock.type = "number";
            inputStock.min = 0;
            inputStock.value = p.stock;
            inputStock.classList.add("input-stock");

            const tdStock = document.createElement("td");
            tdStock.appendChild(inputStock);

            const tdIdeal = document.createElement("td");
            tdIdeal.textContent = p.stockIdeal;

            const tdFaltante = document.createElement("td");
            tdFaltante.textContent = p.stockIdeal - p.stock;

            inputStock.addEventListener("input", () => {
                const valor = parseInt(inputStock.value);
                tdFaltante.textContent = isNaN(valor) ? "0" : Math.max(0, p.stockIdeal - valor);
            });

            fila.append(tdNombre, tdStock, tdIdeal, tdFaltante);
            tbody.appendChild(fila);
        });

        tabla.append(thead, tbody);
        contenedor.appendChild(tabla);

        const btnConfirmar = document.createElement("button");
        btnConfirmar.textContent = "Confirmar Pedido";
        btnConfirmar.addEventListener("click", () => {
            Swal.fire({
                title: 'Pedido Confirmado',
                text: 'Tu pedido ha sido registrado con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        });
        contenedor.appendChild(btnConfirmar);
    });

// === Control Quincenal ===

const quincenalContainer = document.getElementById("quincenal-container");
let stockInicial = [];

function crearFilaIngreso(producto, index) {
    const fila = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = producto.nombre;

    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.dataset.index = index;

    const tdInput = document.createElement("td");
    tdInput.appendChild(input);

    fila.append(tdNombre, tdInput);
    return { fila, input };
}

// Confirmar stock inicial
fetch('data/productos.json')
    .then(res => res.json())
    .then(productos => {
        const titulo = document.createElement("h3");
        titulo.textContent = "1️⃣ Ingresar Stock Inicial";

        const tabla = document.createElement("table");
        const thead = document.createElement("thead");
        thead.innerHTML = `
      <tr><th>Producto</th><th>Stock Inicial</th></tr>
    `;
        const tbody = document.createElement("tbody");

        const inputsIniciales = [];

        productos.forEach((p, index) => {
            const { fila, input } = crearFilaIngreso(p, index);
            inputsIniciales.push({ nombre: p.nombre, input });
            tbody.appendChild(fila);
        });

        tabla.append(thead, tbody);
        quincenalContainer.append(titulo, tabla);

        const btnConfirmarInicial = document.createElement("button");
        btnConfirmarInicial.textContent = "Confirmar Stock Inicial";

        btnConfirmarInicial.addEventListener("click", () => {
            const entrada = [];
            let valido = true;

            inputsIniciales.forEach(({ nombre, input }) => {
                const valor = parseInt(input.value);
                if (isNaN(valor) || valor < 0) valido = false;
                entrada.push({ nombre, cantidad: valor || 0 });
            });

            if (!valido) {
                return Swal.fire({
                    title: 'Error',
                    text: 'Revisá que todos los valores sean números válidos y no negativos.',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            }

            const data = {
                fecha: new Date().toLocaleString(),
                productos: entrada
            };

            localStorage.setItem("stockInicial", JSON.stringify(data));
            Swal.fire({
                title: 'Stock Inicial Guardado',
                text: 'El stock inicial ha sido registrado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            mostrarSeccionIngresos(entrada);
        });

        quincenalContainer.appendChild(btnConfirmarInicial);
    });

// Ingresos quincenales
function mostrarSeccionIngresos(productosIniciales) {
    const titulo = document.createElement("h3");
    titulo.textContent = "2️⃣ Ingresos durante la Quincena";

    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `
    <tr><th>Producto</th><th>Ingreso</th></tr>
  `;
    const tbody = document.createElement("tbody");

    const inputsIngresos = [];

    productosIniciales.forEach((p, index) => {
        const fila = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.textContent = p.nombre;

        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.dataset.index = index;

        const tdInput = document.createElement("td");
        tdInput.appendChild(input);

        fila.append(tdNombre, tdInput);
        tbody.appendChild(fila);

        inputsIngresos.push({ nombre: p.nombre, inicial: p.cantidad, input });
    });

    tabla.append(thead, tbody);
    quincenalContainer.append(titulo, tabla);

    const btnConfirmar = document.createElement("button");
    btnConfirmar.textContent = "Confirmar Ingresos";

    btnConfirmar.addEventListener("click", () => {
        const stockTotal = [];
        let valido = true;

        inputsIngresos.forEach(({ nombre, inicial, input }) => {
            const ingreso = parseInt(input.value);
            if (isNaN(ingreso) || ingreso < 0) valido = false;
            stockTotal.push({ nombre, total: inicial + (ingreso || 0) });
        });

        if (!valido) {
            return Swal.fire({
                title: 'Error',
                text: 'Ingresá solo números válidos y no negativos para los ingresos.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }

        localStorage.setItem("stockTotal", JSON.stringify(stockTotal));
        Swal.fire({
            title: 'Stock Total Calculado',
            text: 'El stock total ha sido calculado y guardado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
        mostrarSeccionVentas(stockTotal);
    });

    quincenalContainer.appendChild(btnConfirmar);
}

// Ventas y auditoría
function mostrarSeccionVentas(productosTotales) {
    const titulo = document.createElement("h3");
    titulo.textContent = "3️⃣ Cargar Ventas y Auditar";

    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML = `
    <tr><th>Producto</th><th>Ventas</th></tr>
  `;
    const tbody = document.createElement("tbody");

    const inputsVentas = [];

    productosTotales.forEach((p, index) => {
        const fila = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.textContent = p.nombre;

        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.dataset.index = index;

        const tdInput = document.createElement("td");
        tdInput.appendChild(input);

        fila.append(tdNombre, tdInput);
        tbody.appendChild(fila);

        inputsVentas.push({ nombre: p.nombre, total: p.total, input });
    });

    tabla.append(thead, tbody);
    quincenalContainer.append(titulo, tabla);

    const btnAuditar = document.createElement("button");
    btnAuditar.textContent = "Realizar Auditoría";

    btnAuditar.addEventListener("click", () => {
        const resultados = [];
        let valido = true;

        inputsVentas.forEach(({ nombre, total, input }) => {
            const venta = parseInt(input.value);
            if (isNaN(venta) || venta < 0) valido = false;

            const resultado = total - (venta || 0);
            resultados.push({
                nombre,
                total,
                venta: venta || 0,
                restante: resultado,
                estado: resultado < 0 ? "FALTANTE" : "OK"
            });
        });

        if (!valido) {
            return Swal.fire({
                title: 'Error',
                text: 'Revisá que las ventas sean números válidos y no negativos.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }

        mostrarAuditoria(resultados);
        guardarEnHistorial(resultados);

        Swal.fire({
            title: 'Auditoría Realizada',
            text: 'La auditoría ha sido completada y guardada en el historial.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });

    quincenalContainer.appendChild(btnAuditar);
}

function mostrarAuditoria(lista) {
    const resumenExistente = quincenalContainer.querySelector(".resumen-auditoria");
    if (resumenExistente) {
        resumenExistente.remove();
    }

    const resumen = document.createElement("div");
    resumen.classList.add("resumen-auditoria"); 
    resumen.innerHTML = "<h3>Resultado Auditoría</h3>";

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
      ${lista.map(p => `
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
    resumen.appendChild(tabla);
    quincenalContainer.appendChild(resumen);
}

function guardarEnHistorial(data) {
    const historial = JSON.parse(localStorage.getItem("auditorias") || "[]");
    historial.push({
        fecha: new Date().toLocaleString(),
        datos: data
    });
    localStorage.setItem("auditorias", JSON.stringify(historial));
}