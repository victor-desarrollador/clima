const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const Spinner= document.querySelector('#spinner');

window.addEventListener('load', () => {
formulario.addEventListener('submit', buscarClima);

});

function buscarClima(e) {
e.preventDefault();

const ciudad = document.querySelector('#ciudad').value;
const pais = document.querySelector('#pais').value;

if (ciudad === '' || pais === '') {
    mostrarError('Ambos campos son obligatorios');
    return;
}

// agregar el spinner 
Spinner.classList.add('flex');
Spinner.classList.remove('hidden');

setTimeout(() => {
    // Ocultar el spinner
    Spinner.classList.remove('flex');
    Spinner.classList.add('hidden');
}, 1000);

 // Consultar API
consultarAPI(ciudad, pais);


}

function mostrarError(mensaje) {
const alerta = document.querySelector('.bg-red-100');

if (!alerta) {
    const alerta = document.createElement('div');

    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3',
        'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
    `;

    container.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 5000);
}
}

function consultarAPI(ciudad, pais) {
const appId = '52b5ea16c43d9bf77e8108c6cb4e5fa8';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => {
        limpiarHTML();
        if (datos.cod === "404") {
            mostrarError('Ciudad no encontrada');
            return;
        }
         // Muestra la respuesta en el HTML
        mostrarClima(datos);
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        mostrarError('Hubo un problema al obtener los datos climáticos.');
    });
}

function mostrarClima(datos) {
   const { name, main: { temp, temp_max, temp_min } } = datos;

   const centigrados = kelvinACentigrados(temp);
   const max = kelvinACentigrados(temp_max);
   const min = kelvinACentigrados(temp_min);

   const nombreCiudad = document.createElement('p');
   nombreCiudad.textContent = `Clima en ${name}`;
   nombreCiudad.classList.add('font-bold', 'text-2xl');

   const actual = document.createElement('p');
   actual.innerHTML = `${centigrados} &#8451;`;
   actual.classList.add('font-bold', 'text-6xl');

   const tempMaxima = document.createElement('p');
   tempMaxima.innerHTML = `Max: ${max} &#8451;`;
   tempMaxima.classList.add('text-xl');

   const tempMinima = document.createElement('p');
   tempMinima.innerHTML = `Min: ${min} &#8451;`;
   tempMinima.classList.add('text-xl');

   const resultadoDiv = document.createElement('div');
   resultadoDiv.classList.add('text-center', 'text-white');
   resultadoDiv.appendChild(nombreCiudad);
   resultadoDiv.appendChild(actual);
   resultadoDiv.appendChild(tempMaxima);
   resultadoDiv.appendChild(tempMinima);

   resultado.appendChild(resultadoDiv);
}

function limpiarHTML() {
   while (resultado.firstChild) {
      resultado.removeChild(resultado.firstChild);
   }
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);
