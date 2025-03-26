// script.js

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("simulador-form");
    const resultadoTabla = document.getElementById("resultado-tabla");
    const resultadoBody = document.getElementById("resultado-body");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar que el formulario se recargue
        
        let monto = parseFloat(document.getElementById("monto").value);
        let tasa = parseFloat(document.getElementById("tasa").value);
        let meses = parseInt(document.getElementById("meses").value);
        
        if (!validarNumero(monto) || !validarNumero(tasa) || !validarNumero(meses)) {
            alert("Por favor, ingrese valores numéricos válidos y mayores a 0.");
        } else {
            let resultado = calcularInteres(monto, tasa, meses);
            resultadoBody.innerHTML = `
                <tr>
                    <td>${monto.toFixed(2)}</td>
                    <td>${tasa.toFixed(2)}%</td>
                    <td>${meses}</td>
                    <td>$${resultado.totalPagar.toFixed(2)}</td>
                    <td>$${resultado.cuotaMensual.toFixed(2)}</td>
                </tr>
            `;
            resultadoTabla.style.display = "table";
        }
    });
});

function calcularInteres(monto, tasa, meses) {
    let interesTotal = (monto * tasa * meses) / 100;
    let totalPagar = monto + interesTotal;
    let cuotaMensual = totalPagar / meses;
    return { totalPagar, cuotaMensual };
}

function validarNumero(input) {
    return !isNaN(input) && input > 0;
}