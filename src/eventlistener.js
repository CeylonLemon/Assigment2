import SERVICE, {
    addFeed,
    addPost,
    addPostSubmit,
    editSubmit, followUser,
    getAllPosts, getMyPosts,
    showMyPosts,
    showMyProfile, submitComment,
    toStart
} from "./service.js";
import {addEventListener} from "./helpers.js";
import {openLogin, openRegister, login, closePopup, register, logout} from "./loginRegister.js"
import {edit} from "./service.js"

const service = new SERVICE();

window.onload=function(){
    localStorage.setItem('scrollPosition', '0');
    const id_func = {
        'login-btn': [openLogin,''],
        'register-btn': [openRegister,''],
        'login-submit': [login,service],
        'register-submit': [register,service],
        'add-posts-submit': [addPostSubmit,service],
        'add-posts-btn':[addPost,''],
        'all-posts-btn': [getAllPosts,service],
        'logout-btn': [logout,''],
        'personal-posts-btn': [getMyPosts,service],
        'my-profile-btn':[showMyProfile,service],
        'edit-submit':[editSubmit,service],
        'follow-btn':[followUser,service],
        'comment-submit':[submitComment,service]
}

    const btn1s = Array.from(document.getElementsByClassName('btn1'))
    const btn2s = Array.from(document.getElementsByClassName('pop-error-btn'))
    const btn3s = Array.from(document.getElementsByClassName('edit'))

    btn1s.forEach((btn)=>addEventListener([btn.id,'click',id_func[btn.id][0],id_func[btn.id][1]]))
    btn2s.forEach((btn)=>addEventListener([btn.id,'click',closePopup,btn.id.slice(6)]))
    btn3s.forEach((btn)=>addEventListener([btn.id,'click',edit,[btn.id,service]]))
    addEventListener(['edit-submit','click',editSubmit,service]);
    toStart();
    document.getElementById('add-posts-submit').addEventListener('click',()=>{addPostSubmit(service)});
    const dom1 = document.getElementsByClassName('posts')[0]
    dom1.addEventListener('scroll',function() {

        //When scroll change, you save it on localStorage.
        localStorage.setItem('scrollPosition',dom1.scrollTop);
        if (dom1.offsetHeight + dom1.scrollTop >= dom1.scrollHeight &&
        !service.stopScroll) {
            addFeed(service);
        }
    },false);
    dom1.addEventListener('onchange',function(){
        console.log('change!')
        if(localStorage.getItem('scrollPosition') !== null)
            dom1.scrollTo(0, localStorage.getItem('scrollPosition'));
    },false);
}


