// Simulador de control de stock - Club de Pádel

// Array para almacenar los productos
let productos = [];

// Función para cargar productos inicialmente
function cargarProductos() {
  let cantidad = parseInt(prompt("¿Cuántos productos desea ingresar al stock inicial?"));
  for (let i = 0; i < cantidad; i++) {
    let nombre = prompt(`Ingrese el nombre del producto ${i + 1}:`).toLowerCase();
    let stock = parseInt(prompt(`Ingrese la cantidad en stock de "${nombre}":`));
    productos.push({ nombre, stock });
  }
  alert("Productos cargados correctamente.");
  console.log("Stock inicial:", productos);
}

// Función para buscar un producto
function buscarProducto(nombre) {
  return productos.find(producto => producto.nombre === nombre.toLowerCase());
}

// Función para consultar stock de un producto
function consultarStock() {
  let nombre = prompt("Ingrese el nombre del producto a consultar:");
  let producto = buscarProducto(nombre);
  if (producto) {
    alert(`Stock actual de "${producto.nombre}": ${producto.stock} unidades.`);
  } else {
    alert("Producto no encontrado.");
  }
}

// Función para modificar stock
function modificarStock(sumar = true) {
  let nombre = prompt("Ingrese el nombre del producto a modificar:");
  let producto = buscarProducto(nombre);
  if (producto) {
    let cantidad = parseInt(prompt(`Ingrese la cantidad a ${sumar ? "agregar" : "descontar"}:`));
    if (sumar) {
      producto.stock += cantidad;
    } else {
      producto.stock -= cantidad;
      if (producto.stock < 0) producto.stock = 0;
    }
    alert(`Nuevo stock de "${producto.nombre}": ${producto.stock} unidades.`);
  } else {
    alert("Producto no encontrado.");
  }
}

// Función para mostrar todo el stock
function mostrarStockCompleto() {
  let mensaje = "📦 Stock actual:\n";
  productos.forEach(producto => {
    mensaje += `- ${producto.nombre}: ${producto.stock} unidades\n`;
  });
  alert(mensaje);
  console.log("Estado completo del stock:", productos);
}

// Función principal
function iniciarSimulador() {
  cargarProductos();
  let salir = false;
  while (!salir) {
    let opcion = prompt(
      "¿Qué desea hacer?\n1. Consultar stock\n2. Agregar stock\n3. Descontar stock\n4. Ver todo el stock\n5. Salir"
    );
    switch (opcion) {
      case "1":
        consultarStock();
        break;
      case "2":
        modificarStock(true);
        break;
      case "3":
        modificarStock(false);
        break;
      case "4":
        mostrarStockCompleto();
        break;
      case "5":
        salir = true;
        alert("Gracias por usar el simulador de stock. ¡Hasta luego!");
        break;
      default:
        alert("Opción no válida. Intente nuevamente.");
    }
  }
}

// Iniciar el simulador
iniciarSimulador();
