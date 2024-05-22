// Función que implementa el método congruencial lineal para generar números aleatorios.
function metodoCongruencialLineal(Xo, a, c, m, numerosAleatorios, numerosAleatoriosNormalizados, cantidadNumerosAleatorios) {
    numerosAleatorios[0] = Xo;

    for (let i = 1; i < cantidadNumerosAleatorios; i++) {
        numerosAleatorios[i] = (a * numerosAleatorios[i - 1] + c) % m;
    }

    for (let i = 0; i < cantidadNumerosAleatorios; i++) {
        numerosAleatoriosNormalizados[i] = Math.floor((numerosAleatorios[i] / m) * 10);
    }
}

// Función para agrupar los números normalizados de a tres
function agruparNumerosConPrefijo(numeros, grupoSize) {
    const grupos = [];
    for (let i = 0; i < numeros.length; i += grupoSize) {
        let grupo = numeros.slice(i, i + grupoSize);
        let numeroAgrupado = "0." + grupo.join("");
        grupos.push(numeroAgrupado);
    }
    return grupos;
}

// Función que genera un lote de placas de video con una probabilidad de defecto dada.
function generarLote(probabilidadDefecto, tamañoLote, numerosAleatorios, numerosAleatoriosNormalizados) {
    let lote = [];
    // Se itera sobre el tamaño del lote y se agrega 1 si la probabilidad de defecto es menor que un número aleatorio generado, de lo contrario se agrega 0.
    for (let i = 0; i < tamañoLote; i++) {
        lote.push(numerosAleatoriosNormalizados[i] <= probabilidadDefecto ? 1 : 0);
    }
    return lote; // Se devuelve el lote generado.
}

// Esta función selecciona una muestra aleatoria de placas de video del lote.
function seleccionarMuestra(lote, tamañoMuestra) {
    let muestra = [];
    // Se itera sobre el tamaño de la muestra y se selecciona aleatoriamente una placa del lote.
    for (let i = 0; i < tamañoMuestra; i++) {
        muestra.push(lote[Math.floor(Math.random() * lote.length)]);
    }
    return muestra; // Se devuelve la muestra seleccionada.
}

// Esta función inspecciona las placas de video de la muestra y calcula la proporción de placas defectuosas.
function inspeccionarMuestra(muestra) {
    // Se suma el número total de placas defectuosas en la muestra.
    let totalDefectuosas = muestra.reduce((acc, val) => acc + val, 0);
    // Se calcula la proporción de placas defectuosas dividiendo el número total de placas defectuosas entre el tamaño de la muestra.
    return totalDefectuosas / muestra.length;
}

// Esta función determina si el lote es aprobado o rechazado según la proporción de placas defectuosas en la muestra y el límite de aceptación.
function determinarEstadoLote(propDefectuosas, limiteAceptacion) {
    // Si la proporción de placas defectuosas es menor o igual al límite de aceptación, el lote es aprobado, de lo contrario es rechazado.
    return propDefectuosas <= limiteAceptacion ? "Aprobado" : "Rechazado";
}
function cumulativeChiSquaredValue(significanceLevel, degreesOfFreedom) {
    // Calcular el valor acumulado de Chi-cuadrado utilizando jStat
    return jStat.chisquare.inv(1 - significanceLevel, degreesOfFreedom);
}
function chiSquareTest(numeros, intervalos, error) {
    // Calcular la frecuencia esperada
    const frecuenciaEsperada = numeros.length / intervalos;
    // Calcular la frecuencia observada
    const frecuenciaObservada = new Array(intervalos).fill(0);
    for (let numero of numeros) {
        frecuenciaObservada[numero]++;
    }
    console.log(frecuenciaObservada)
    // Calcular el estadístico chi-cuadrado
    let chiCuadrado = 0;
    for (let i = 0; i < intervalos; i++) {
        chiCuadrado += Math.pow(frecuenciaObservada[i] - frecuenciaEsperada, 2) / frecuenciaEsperada;
    }
    // Calcular el valor crítico de chi-cuadrado para un nivel de significancia del error proporcionado
    const valorCritico = cumulativeChiSquaredValue(error, intervalos - 1);
    console.log(valorCritico)
    console.log(chiCuadrado)
    // Evaluar el resultado del test
    if (chiCuadrado < valorCritico) {
        return "Los números aleatorios parecen seguir una distribución uniforme (no se rechaza la hipótesis nula).";
    } else {
        return "Los números aleatorios no siguen una distribución uniforme (se rechaza la hipótesis nula).";
    }
}
// Esta función realiza la simulación del control de calidad para la cantidad especificada de lotes.
function simularControlCalidad() {
    // Se obtienen los parámetros de simulación del HTML.
    let probabilidadDefecto = parseFloat(document.getElementById("probabilidad").value);
    let tamañoLote = parseInt(document.getElementById("tamaño_lote").value);
    let tamañoMuestra = parseInt(document.getElementById("tamaño_muestra").value);
    let limiteAceptacion = parseFloat(document.getElementById("limite_aceptacion").value);
    let cantidadSimulaciones = parseInt(document.getElementById("cantidad_simulaciones").value);

    // Se obtiene el elemento HTML donde se mostrarán los resultados.
    let resultados = document.getElementById("resultados");
    resultados.innerHTML = "";

    // Se inicializan los arreglos para almacenar los números aleatorios generados por el método congruencial lineal.
    let numerosAleatorios = [];
    let numerosAleatoriosNormalizados = [];

    // Se obtiene la semilla inicial del HTML.
    let semilla = parseInt(document.getElementById("semilla").value);

    // Se llama al método congruencial lineal para generar los números aleatorios.
    metodoCongruencialLineal(semilla, 1664525, 1013904223, Math.pow(2, 32), numerosAleatorios, numerosAleatoriosNormalizados, tamañoLote*2);
    // Realizamos el test de Chi-cuadrado para evaluar la distribución de los números aleatorios generados.
    let resultadoChiCuadrado = chiSquareTest(numerosAleatoriosNormalizados, 10, 0.05);

    // Añadimos los resultados del test de Chi-cuadrado al elemento HTML de resultados.
    resultados.innerHTML += `Resultado del test de Chi-cuadrado: ${resultadoChiCuadrado} <br>`;

    // Añadimos dos contadores para llevar el registro de cuántas veces se aprueba y cuántas veces se rechaza el lote.
    let vecesAprobado = 0;
    let vecesRechazado = 0;
    // agrupar numeros
    let numerosrandom=agruparNumerosConPrefijo(numerosAleatoriosNormalizados, 2)
    console.log(numerosAleatoriosNormalizados)
    console.log(numerosrandom)
    // Se itera sobre la cantidad de simulaciones especificada.
    for (let i = 0; i < cantidadSimulaciones; i++) {
        // Se genera un lote de placas de video utilizando los números aleatorios generados.
        let lote = generarLote(probabilidadDefecto, tamañoLote, numerosAleatorios, numerosrandom);
        // Se selecciona una muestra aleatoria del lote.
        let muestra = seleccionarMuestra(lote, tamañoMuestra);
        // Se inspecciona la muestra para calcular la proporción de placas defectuosas.
        let propDefectuosas = inspeccionarMuestra(muestra);
        // Se determina el estado del lote (aprobado o rechazado) según la proporción de placas defectuosas y el límite de aceptación.
        let estadoLote = determinarEstadoLote(propDefectuosas, limiteAceptacion);
        // Actualizamos los contadores según el estado del lote.
        if (estadoLote === "Aprobado") {
            vecesAprobado++;
        } else {
            vecesRechazado++;
        }

        // Se cuenta la cantidad de placas defectuosas en la muestra.
        let placasDefectuosas = muestra.reduce((acc, val) => acc + val, 0);

        // Se genera un mensaje con el estado del lote y la cantidad de placas defectuosas encontradas, y se agrega al elemento HTML de resultados.
        let mensaje = `Lote ${i + 1}: ${estadoLote}. Placas defectuosas: ${placasDefectuosas} de ${tamañoMuestra}`;
        resultados.innerHTML += mensaje + "<br>";
    }

    // Calculamos los porcentajes de veces que se aprobó y se rechazó el lote.
    let porcentajeAprobado = (vecesAprobado / cantidadSimulaciones) * 100;
    let porcentajeRechazado = (vecesRechazado / cantidadSimulaciones) * 100;

    // Mostramos los porcentajes en el elemento HTML de resultados.
    resultados.innerHTML += `<br>Porcentaje de veces que se aprobó el lote: ${porcentajeAprobado.toFixed(2)}% <br>`;
    resultados.innerHTML += `Porcentaje de veces que se rechazó el lote: ${porcentajeRechazado.toFixed(2)}% <br>`;
}
