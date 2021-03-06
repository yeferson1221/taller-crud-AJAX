const d = document,
    $table = d.querySelector(".table"),
    $form = d.querySelector(".crud-form"),
    $title = d.querySelector(".crud-title"),
    $template = d.getElementById("crud-template").content,
    $fragment = d.createDocumentFragment();

const getAll = async() => {
    try {
        let res = await fetch("http://localhost:5000/santos"),
            json = await res.json();

        if (!res.ok) throw {
            status: res.status,
            statusText: res.statusText
        };

        console.log(json);
        json.forEach(el => {
            $template.querySelector(".name").textContent = el.nombre;
            $template.querySelector(".constellation").textContent = el.constelacion;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.nombre;
            $template.querySelector(".edit").dataset.constellation = el.constelacion;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragment);
    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
    }
}

d.addEventListener("DOMContentLoaded", getAll);


/**
 * [
 *  contiene la funsion asincrona dentro de esta se ejecutan los  metodos 
 *  eliminar actualizar agregar 
 * ]
 * @version [1,0.0]
 *
 * @author [Yeferson Valencia, alejandro.yandd@gmail.com]
 * @since [1,0,0]
 *
 */
d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            /**
             * [
             *  nos pérmite agregar un nuevo nombre y constealcion,adicional tiene el try  catch para 
             *  el manejo de errores en el metodo ejecutado 
             * ]
             * @version [1,0.0]
             *
             * @author [Yeferson Valencia, alejandro.yandd@gmail.com]
             * @since [1,0,0]
             *
             */

            try {
                let options = {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            nombre: e.target.nombre.value,
                            constelacion: e.target.constelacion.value
                        })
                    },
                    res = await fetch("http://localhost:5000/santos", options),
                    json = await res.json();

                if (!res.ok) throw {
                    status: res.status,
                    statusText: res.statusText
                };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        } else {
            /**
             * [
             *  nos pérmite editar con el id el nombre y la constelacion, adicional tiene el try  catch para 
             *  el manejo de errores
             * ]
             * @version [1,0.0]
             *
             * @author [Yeferson Valencia, alejandro.yandd@gmail.com]
             * @since [1,0,0]
             *
             */
            try {
                let options = {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        },
                        body: JSON.stringify({
                            nombre: e.target.nombre.value,
                            constelacion: e.target.constelacion.value
                        })
                    },
                    res = await fetch(`http://localhost:5000/santos/${e.target.id.value}`, options),
                    json = await res.json();

                if (!res.ok) throw {
                    status: res.status,
                    statusText: res.statusText
                };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
            }
        }
    }
});

d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
        let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);

        if (isDelete) {
            /**
             * [
             *  nos permite eliminar por id el nombre y la contelacion adicional tiene el try  catch para 
             *  el manejo de errores
             * ]
             * @version [1,0.0]
             *
             * @author [Yeferson Valencia, alejandro.yandd@gmail.com]
             * @since [1,0,0]
             *
             */
            try {
                let options = {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json; charset=utf-8"
                        }
                    },
                    res = await fetch(`http://localhost:5000/santos/${e.target.dataset.id}`, options),
                    json = await res.json();

                if (!res.ok) throw {
                    status: res.status,
                    statusText: res.statusText
                };

                location.reload();
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                alert(`Error ${err.status}: ${message}`);
            }
        }
    }
})