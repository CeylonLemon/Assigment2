import SERVICE, {addPost, addPostSubmit, getAllPosts, showMyPosts, showMyProfile, toStart} from "./service.js";
import {addEventListener} from "./helpers.js";
import {openLogin, openRegister, login, closePopup, register, logout} from "./loginRegister.js"
import {switchState} from "./service.js"

const service = new SERVICE();
window.onload=function(){
    const id_func = {
        'login-btn': [openLogin,''],
        'register-btn': [openRegister,''],
        'login-submit': [login,service],
        'register-submit': [register,service],
        'add-posts-submit': [addPostSubmit,service],
        'add-posts-btn':[addPost,''],
        'all-posts-btn': [getAllPosts,service],
        'logout-btn': [logout,''],
        'personal-posts-btn': [showMyPosts,''],
        'my-profile-btn':[showMyProfile,'']
}

    const btn1s = Array.from(document.getElementsByClassName('btn1'))
    const btn2s = Array.from(document.getElementsByClassName('pop-error-btn'))

    btn2s.forEach((btn)=>{
        console.log(btn);
        console.log(btn.id);
        console.log(id_func[btn.id])
    })
    btn1s.forEach((btn)=>addEventListener([btn.id,'click',id_func[btn.id][0],id_func[btn.id][1]]))
    btn2s.forEach((btn)=>addEventListener([btn.id,'click',closePopup,btn.id.slice(6)]))

    toStart();
}


