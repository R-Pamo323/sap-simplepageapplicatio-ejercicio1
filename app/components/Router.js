import api from "../helpers/wp_api.js";
import {ajax} from "../helpers/ajax.js";
import { PostCard } from "./PostCard.js";
import { Posts } from "./Post.js";
import { SearchCard } from "./SearchCard.js";
import { ContactForm } from "./ContactForm.js";
 
 
 export async function Router(){
    const d= document,
        w=window,
        $main = d.getElementById("main");
        
    let { hash } = location;
    $main.innerHTML = null;

    if(!hash || hash === "#/"){
        await ajax({
            url: api.POSTS,    //va a los Posts donde crea un elemento post
            cbSuccess: (posts) => {
                console.log(posts);
                let html="";
                posts.forEach((post) => html += PostCard(post));   //porcada posts se va iterad un postcard que tiene su titulo fecha imagen etc.
                $main.innerHTML= html;   //y a los posts le agregamos el codigo hhtml de cada postcard
            },
        });
    } else if(hash.includes("#/search")){
        let query = localStorage.getItem("wpSearch");

        if(!query){
            d.querySelector(".loader").style.display="none";
            return false;
        } 

        await ajax({
            url: `${api.SEARCH}${query}`,
            cbSuccess: (search) => {
                console.log(search);
                let html = "";
                if (search.length === 0){
                    html = `
                    <p class="error">
                        No existen resultados de búsqueda para el término
                        <mark>${query}</mark>
                    </p>`;
                } else{
                    search.forEach((post) => (html += SearchCard(post))); 
                }
                $main.innerHTML = html;
            },
        });
      
    } else if(hash.includes("#/contacto")){
        $main.appendChild(ContactForm());
    } else{
        await ajax({
            url: `${api.POST}/${localStorage.getItem("wpPostId")}`,    //va a los Posts donde crea un elemento post
            cbSuccess: (posts) => {
                console.log(posts);
                $main.innerHTML = Posts(posts);
            },
        });
       
    }
    d.querySelector(".loader").style.display="none";  //quitamos el cargador cuando esten cargados
} 
