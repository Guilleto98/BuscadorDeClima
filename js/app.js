const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=>{
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e){
    e.preventDefault();

    // Validar formulario

    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if( ciudad === '' || pais === ''){
        //Hubo un error
        mostrarError('Ambos campos son obligatorios');
    } 

    // Consulta a la API
    consultarAPI(ciudad,pais);
}

function mostrarError(mensaje){

    const alerta = document.querySelector('.bg-red-100')

    if(!alerta){
        const alerta = document.createElement('div');

         alerta.classList.add('bg-red-100', 'border-red-400', 'tex-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
         alerta.innerHTML = `
            <strong class='font-bold'> Error!</strong>
            <span class='block'>${mensaje}</span >
         `
        container.appendChild(alerta);
        
        // Eliminar la alerta despues de 2.5 segundos
        setTimeout(()=>{
            alerta.remove()
        }, 3000);
    }
}

function consultarAPI(ciudad,pais){
    mostrarSpinner(); //Muestra un Spinner de carga

    const appID = '71cf696f3b86dbd48ff5078ee2b1989c';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`


    fetch(url)
        .then(respuesta => respuesta.json())
        .then( datos =>{
            limpiarHTML(); // Limpiar HTML previo
            if(datos.cod === '404'){
                mostrarError('Ciudad no encontrada')
                return;
            }

            // Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos){
    const {main: { temp, temp_max, temp_min}, name } = datos
    
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p')
    nombreCiudad.textContent = `Temperatura en ${name}`
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const tempMaxima = document.createElement('p')
    tempMaxima.innerHTML = `Max: ${max} &#8451`
    tempMaxima.classList.add('text-xl')

    const tempMinima = document.createElement('p')
    tempMinima.innerHTML = `Min: ${min} &#8451`
    tempMinima.classList.add('text-xl')
    
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`
    actual.classList.add('font-bold', 'text-6xl')

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

// Mostrar un spinner

function mostrarSpinner(){
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-chase');

    divSpinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `

    resultado.appendChild(divSpinner);
}