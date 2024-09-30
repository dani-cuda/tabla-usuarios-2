// Guardo los elementos en variables
let input_nombre = document.getElementById("nombre");
let input_edad = document.getElementById("edad");
let input_email = document.getElementById("email");
let boton_agregar = document.getElementById("boton-agregar");
let boton_guardar = document.getElementById("boton-guardar");
let boton_cancelar = document.getElementById("boton-cancelar");
let tabla = document.getElementById("cuerpo-tabla");
let usuarios = [];
let indice_a_editar = null;

localStorage.setItem('usuarios', JSON.stringify(usuarios));


boton_cancelar.onclick = () => {
    limpiarInputs();
    boton_agregar.style.display = "inline-block";
    boton_guardar.style.display = "none";
    boton_agregar.innerText = "Agregar";
    boton_cancelar.style.display = "none";
};

boton_guardar.onclick = () => {
    editarUsuario();
};

function agregarUsuario() {

    let nombre = input_nombre.value;
    let edad = input_edad.value;
    let email = input_email.value;

    if (nombre === "" || edad === "" || email === "") {
        alert("Complete todos los datos")
    }
    else if (existeEmail(email)) {
        alert("Ya existe un usuario cargado en el sistema con ese email")
    } else {
        usuarios.push(
            {
                "nombre": nombre,
                "edad": edad,
                "email": email
            }
        );

        limpiarInputs();

        localStorage.removeItem("usuarios");
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
    }
}

function eliminarUsuario(indice) {

    usuarios.splice(indice, 1)

    localStorage.removeItem("usuarios");
    localStorage.setItem("usuarios", JSON.stringify(usuarios))

}

function editarUsuario(indice_a_editar) {
    if (nombre.value === "" || edad.value === "" || email.value === "") {
        alert("Complete todos los datos");
    }else if(existeEmailEditar(indice_a_editar)){
        alert("El email seleccionado ya esta en uso");
    }else{
        let nuevos_valores = {
            "nombre" : input_nombre.value,
            "edad" : input_edad.value,
            "email" : input_email.value
        }

        usuarios[indice_a_editar] = nuevos_valores;

        localStorage.removeItem("usuarios");
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        completarTabla();

        limpiarInputs();
        boton_guardar.style.display = "none";
        boton_agregar.style.display = "inline-block";
        boton_cancelar.style.display = "none";

        indice_a_editar = null;
    }
}

function completarTabla() {
    let lista_usuarios = JSON.parse(localStorage.getItem("usuarios"));

    // Mientras la tabla tenga filas (excluyendo el encabezado si lo tiene)
    while (tabla.rows.length > 0) {
        tabla.deleteRow(0); // Elimina la primera fila repetidamente
    }

    lista_usuarios.forEach((element) => {
        // Creo una nueva fila en la tabla
        const nueva_fila = tabla.insertRow();

        // Inserto las celdas en la fila
        const celda_nombre = nueva_fila.insertCell(0);
        const celda_edad = nueva_fila.insertCell(1);
        const celda_email = nueva_fila.insertCell(2);
        const celda_boton = nueva_fila.insertCell(3);

        // Asigno los valores ingresados a las celdas
        celda_nombre.innerHTML = element.nombre;
        celda_edad.innerHTML = element.edad;
        celda_email.innerHTML = element.email;


        // Creo un botón para eliminar la fila
        let boton_eliminar = document.createElement('button');
        boton_eliminar.textContent = 'Eliminar'; // Le pongo el texto al boton
        boton_eliminar.setAttribute("data-id", `btn-eliminar-${email}`)

        // Creo un botón para editar la fila
        let boton_editar = document.createElement('button');
        boton_editar.textContent = 'Editar'; // Le pongo el texto al boton
        boton_editar.setAttribute("data-id", `btn-editar-${email}`);

        // Agrego el botón de eliminar a la ultima celda
        celda_boton.appendChild(boton_eliminar);
        celda_boton.appendChild(boton_editar);

        // Le pongo una funcion al click del boton
        boton_eliminar.onclick = function () {
            tabla.deleteRow(eliminarUsuario(nueva_fila.rowIndex - 1)); // Elimino la fila
            completarTabla();
        };

        boton_editar.onclick = function () {
            let usuario = usuarios[nueva_fila.rowIndex - 1];

            input_nombre.value = usuario.nombre;
            input_edad.value = usuario.edad;
            input_email.value = usuario.email;

            boton_agregar.style.display = "none";
            boton_guardar.style.display = "inline-block";

            boton_cancelar.style.display = "inline-block";
            boton_agregar.innerText = "Guardar"

            indice_a_editar = nueva_fila.rowIndex - 1;
        }


    });
}

function existeEmail(email) {
    let existe = false;

    usuarios.forEach((element) => {
        if (element.email === email) {
            existe = true
        }
    });

    return existe;
};

function existeEmailEditar(email){
    return usuarios.every((usuario, indice) => {
        // Verifica si el email existe en la lista, excluyendo el usuario que está siendo editado
        return indice === indice_a_editar || usuario.email !== email;
    });
};

function limpiarInputs() {
    input_nombre.value = "";
    input_edad.value = "";
    input_email.value = "";
};



// Funcion que se ejecuta cuando hago click en el boton "Agregar"
boton_agregar.addEventListener("click", () => {

    agregarUsuario();

    completarTabla();

});