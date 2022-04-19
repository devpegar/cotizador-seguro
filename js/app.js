// Constantes
const d = document;

// Constructores

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
  let cantidad;
  const base = 4000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
    default:
      break;
  }

  // Leer el año
  const diferencia = new Date().getFullYear() - this.year;

  // Cada año que la diferencia es mayor, el costo se reduce en un 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad.toFixed(2);
};

function UI() {}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear(),
    min = max - 20;

  const selectYear = d.querySelector("#year");

  for (let i = max; i > min; i--) {
    let option = d.createElement("option");
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
};

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = d.createElement("div");

  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }

  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  // Insertar Mensaje
  const formulario = d.querySelector("#cotizar-seguro");
  formulario.insertBefore(div, d.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = (total, seguro) => {
  const { marca, year, tipo } = seguro;

  let textoMarca;

  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiatico";
      break;
    case "3":
      textoMarca = "Europeo";
      break;
    default:
      break;
  }
  // Crear el Resultado
  const div = d.createElement("div");
  div.classList.add("mt-10");

  div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal"> $ ${total}</span></p>
  `;

  const resultadoDiv = d.querySelector("#resultado");

  // Mostrar el spinner
  const spinner = d.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none"; // Se borra el spinner
    resultadoDiv.appendChild(div); // Se muestra el resultado
  }, 3000);
};

// Instanciar UI
const ui = new UI();

// Event listener
d.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones();
});

eventListeners();
function eventListeners() {
  const formulario = d.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  //Leer la marca seleccionada
  const marca = d.querySelector("#marca").value;

  // Leer el año seleccionada
  const year = d.querySelector("#year").value;

  // Leer el tipo de seguro
  const tipo = d.querySelector("input[name='tipo']:checked").value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }
  ui.mostrarMensaje("Cotizando...", "exito");

  // Ocultar las cotizaciones previas
  const resultados = d.querySelector("#resultado div");
  if (resultados != null) {
    resultados.remove();
  }

  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  ui.mostrarResultado(total, seguro);
}
