// =====================
// FECHA ACTUAL
// =====================

const hoy = new Date().toLocaleDateString();

const ultimaFecha =
localStorage.getItem("ultimaFecha");

// =====================
// REINICIO DIARIO
// =====================

if(ultimaFecha !== hoy){

    localStorage.setItem(
        "ultimaFecha",
        hoy
    );

    const totalTareas =
    document.querySelectorAll(
    "input[type='checkbox']"
    ).length;

    for(let i=0;i<totalTareas;i++){

        localStorage.removeItem(
        "tarea_" + i
        );

    }

    localStorage.setItem(
        "agua",
        0
    );

}

// =====================
// TAREAS
// =====================

const checkboxes =
document.querySelectorAll(
"input[type='checkbox']"
);

checkboxes.forEach(
(checkbox,index)=>{

    const guardado =
    localStorage.getItem(
    "tarea_" + index
    );

    if(guardado==="true"){

        checkbox.checked=true;

    }

    checkbox.addEventListener(
    "change",
    ()=>{

        localStorage.setItem(
        "tarea_" + index,
        checkbox.checked
        );

        actualizarProgreso();

    });

});

function actualizarProgreso(){

    const total =
    checkboxes.length;

    let completadas = 0;

    checkboxes.forEach(
    (checkbox)=>{

        if(
        checkbox.checked
        ){

            completadas++;

        }

    });

    document.getElementById(
    "progreso"
    ).innerText =
    `${completadas}/${total} tareas completadas`;

    const porcentaje =
    (completadas/total)*100;

    document.getElementById(
    "barra"
    ).style.width =
    porcentaje + "%";

    document.getElementById(
    "porcentajeTexto"
    ).innerText =
    Math.round(
    porcentaje
    ) + "%";

    verificarRacha(
    completadas,
    total
    );

}

// =====================
// RACHA
// =====================

function verificarRacha(
completadas,
total
){

    if(completadas===total){

        const ultimoDia =
        localStorage.getItem(
        "ultimoDiaRacha"
        );

        if(
        ultimoDia!==hoy
        ){

            let racha =
            parseInt(
            localStorage.getItem(
            "racha"
            )
            ) || 0;

            racha++;

            localStorage.setItem(
            "racha",
            racha
            );

            localStorage.setItem(
            "ultimoDiaRacha",
            hoy
            );

        }

    }

    mostrarRacha();

}

function mostrarRacha(){

    const racha =
    localStorage.getItem(
    "racha"
    ) || 0;

    document.getElementById(
    "racha"
    ).innerText =
    "🔥 Racha: " +
    racha +
    " días";

}

// =====================
// AGUA
// =====================

function sumarAgua(){

    let agua =
    parseInt(
    localStorage.getItem(
    "agua"
    )
    ) || 0;

    agua++;

    localStorage.setItem(
    "agua",
    agua
    );

    mostrarAgua();

}

function mostrarAgua(){

    let agua =
    parseInt(
    localStorage.getItem(
    "agua"
    )
    ) || 0;

    document.getElementById(
    "agua"
    ).innerText =
    agua +
    " vasos";

}

// =====================
// PESO
// =====================

function guardarPeso(){

    const peso =
    document.getElementById(
    "peso"
    ).value;

    localStorage.setItem(
    "pesoActual",
    peso
    );

    mostrarPeso();

}

function mostrarPeso(){

    const peso =
    localStorage.getItem(
    "pesoActual"
    );

    if(peso){

        document.getElementById(
        "pesoActual"
        ).innerText =
        "⚖ Peso actual: " +
        peso +
        " lbs";

    }

}

// =====================
// INICIO
// =====================

mostrarAgua();

mostrarPeso();

mostrarRacha();

actualizarProgreso();