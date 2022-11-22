export function ContactForm(){
    const d = document,
        $form = d.createElement("form"),
        $styles = d.getElementById("dynamic-styles");

    $form.classList.add("contact-form");

    $styles.innerHTML= `
    .contact-form{
        --form-ok-color: #4caf50;  
        --form-error-color: #f44336;
        margin-left: auto;
        margin-right: auto;
        width: 80%;
    }

    .contact-form > *{  
        padding: 0.5rem;
        margin: 1rem auto;
        display: block;  
        width: 100%;
    }

    .contact-form textarea{
        resize: none;    
    }

    .contact-form legend,    
    .contact-form-response {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
    }

    .contact-form input,   
    .contact-form textarea{
        font-size: 1rem;
        font-family: sans-serif;
    }

    .contact-form input[type="submit"]{   
        width: 50%;
        font-weight: bold;
        cursor: pointer;   
    }

    .contact-form *::placeholder{
        color: #000;
    }

    .contact-form [required]:valid{
        border: thin solid var(--form-ok-color);
    }

    .contact-form [required]:invalid{   
        border: thin solid var(--form-error-color);
    }

    .contact-form-error{     
        margin-top: -1rem;
        font-size: 80%;
        background-color: var(--form-error-color);
        color: #fff;
        transition: all 800ms ease;
    }

    .contact-form-error.is-active {  
        display:block;
        animation: show-message 1s 1 normal 0s ease-out both;  
    }

    .contact-form-loader{
        text-align: center;
    }

    .none {
        display: none;
    }

    @keyframes show-message { 
        0%{
            visibility: hidden;
            opacity: 0;
        }

        100%{
            visibility: visible;
            opacity: 1;
        }
    }
    `;

    $form.innerHTML= `
    <legend>Envianos tus comentarios</legend>
    <input name="name" type="text" placeholder="Escribe tu nombre" 
    title="El Nombre solo acepta letras y espacios en blanco" 
    pattern="^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\\s]+$" required>
    <input type="email" name="email" placeholder="Escribe tu correo" title="Email incorrecto"
    pattern="^[a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,15})$" required>
    <input type="text" name="subject" placeholder="Asunto a tratar"
    title="El asunto es requerido" required>
    <textarea name="comments" cols="50" rows="5" placeholder="Escribe tus comentarios"
    data-pattern="^.{1,255}$" title="Tu comentario no debe exceder 255 caracteres" required></textarea>
    <input type="submit" value="Enviar">
    <div class="contact-form-loader none">
        <img src="assets/circles.svg" alt="Cargando">
    </div>
    <div class="contact-form-response none">
        <p>Los datos han sido enviados</p>
    </div>`;

    function validarForm(){
        const $form = d.querySelector(".contact-form"),  //osea tecnicamente el form
            $inputs = d.querySelectorAll(".contact-form [required]"); //lo que esta dentro del form con required

        $inputs.forEach((input) => {
            const $span = d.createElement("span");  //crea un span
            $span.id = input.name;  //en el id utiliza el name de cada input
            $span.textContent = input.title;  //oInserta el title que es el error marcado
            $span.classList.add("contact-form-error", "none");  //agrega la barra roja de abajo que indica el error y lo pone invisible
            input.insertAdjacentElement("afterend", $span); //y que sea despues del input al final
        });


        d.addEventListener("keyup", (e) =>{
            if(e.target.matches(".contact-form [required]")){  //solo los que tengan required dentro del form
                let $input = e.target,
                    pattern = $input.pattern || $input.dataset.pattern;  //que agarr eel patron del inputo o el dataset patter que es del text area

                if(pattern && $input.value !== ""){  //si cumple el patron o es vacio
                    let regex = new RegExp(pattern);  //aca guardamos la regular expresion
                    return !regex.exec($input.value)   //y la ejecutamos con los valores del input oara comprobar
                        ? d.getElementById($input.name).classList.add("is-active")
                        : d.getElementById($input.name).classList.remove("is-active");
                }

                if(!pattern){  //si no tiene patron entonces 
                    return $input.value === ""   //revisa si esta vacio y de ahi toda la validacion
                        ? d.getElementById($input.name).classList.add("is-active")
                        : d.getElementById($input.name).classList.remove("is-active");
                }
            }
        });

        d.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Enviando formulario");

            const $loader = d.querySelector(".contact-form-loader"),  //es el logo de carga 
                $response = d.querySelector(".contact-form-response");  //es el mensaje que dice datos envaidos

            $loader.classList.remove("none");   //osea ahorita se esta mostrando hasta qe se envie

            fetch("https://formsubmit.co/ajax/rodrigopamo323@gmail.com",{
                method: "POST",
                body: new FormData(e.target)
            })
            .then(res => res.ok ? res.json(): Promise.reject(res))
            .then(json => {
                console.log(json);
                $loader.classList.add("none");
                $response.classList.remove("none");
                $response.innerHTML = `<p>${json.message}</p>`;
                $form.reset();
            })
            .catch(err => {
                console.log(err);
                let message =  err.statusText || "Ocurrió un error al enviar, intentar nuevamente";
                $response.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
            })
            .finally(() => setTimeout(() => {
                $response.classList.add("none");
                $response.innerHTML = "";
            }, 3000));
        });
    }
    setTimeout(() => validarForm(), 100);
    return $form;
}