import {App} from "./App.js";
import api from "./helpers/wp_api.js";

const d = document;

d.addEventListener("DOMContentLoaded", App);  //si ponemos con los parentesis el App() seria invocacion inmediata, entonces en este caso debemos de poner hasta cuando el domsea cargado
window.addEventListener("hashchange", () => {
    api.page = 1;
    App();
});
