import SERVICE from './service.js'
import API from './api_.js';
import {toStart,addPost,getAllPosts} from "./service.js";
import {addEventListener} from "./helpers.js";


        function clearboxs(){
            const boxes = Array.from(document.getElementsByTagName('input'))
            boxes.forEach((box)=>box.value='')
        }

        function displaylogin(){
            var username = document.getElementById('username').value;
            console.log(username);
        }

        export function openLogin(){
            closeAllPopups();
            document.getElementById('register').style.visibility = 'hidden';
            document.getElementById('login').style.visibility = 'visible';
        }

        export function openRegister(){
            closeAllPopups();
            document.getElementById('login').style.visibility = 'hidden';
            document.getElementById('register').style.visibility ='visible';
        }

        export function login(service){
            console.log('login');
            closeAllPopups();
            let name = document.getElementById('username').value;
            let pwd1 = document.getElementById('password').value;
            let pwd2 = document.getElementById('confirm').value;
             console.log(name);
            // if(pwd1!=pwd2) popupError('password');
            if(!name||!pwd1||!pwd2||pwd1!==pwd2){
                if(!name) popupError('username_error'); 
                if(!pwd1) popupError('pwd_error');
                if(!pwd2) popupError('cpwd_empty_error');
                else if(pwd1!==pwd2)  popupError('cpwd_mismatch_error');
            }else{
                clearboxs();
                const Data = {
                    "username": name,
                    "password": pwd1
                };

                const othePram = {
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify(Data),
                    method:"POST"
                };


                const api = new API('http://localhost:5000')

                api.makeAPIRequest('auth/login',othePram)
                    .then(data=>{console.log(data);localStorage.setItem(name,data.token)})
                    .then(()=>{
                        const t = localStorage.getItem(name);
                        console.log(t)
                        return t
                    })
                    .then(t=>{

                        // const s = new SERVICE(t,name);
                        service.token = t;
                        service.username = name
                        service.password = pwd1
                        // const Para = {
                        //     headers:{
                        //         "Content-Type": "application/json",
                        //         "Authorization": 'Token '+t
                        //     },
                        //     method:"GET"
                        //
                        // }
                        service.update =
                            service.httpGet(`user/?username=${name}`)
                            .then(data=>{service.updateInfo(data);return 'ok'})

                        // service.update =
                        //     service.api.makeAPIRequest(`user/?username=${name}`, Para)
                        //         .then(data => {service.updateInfo(data);return 'yes';})


                        service.startService();
                    }).catch(e=>{
                        alert('Invalid username/password!')
                })

            }
            // console.log(name.value,pwd1.value);
            
        }

        export function register(service){
            console.log('login');
            closeAllPopups();
            let username = document.getElementById('username_reg').value;
            let pwd1 = document.getElementById('password_reg').value;
            let pwd2 = document.getElementById('confirm_reg').value;
            let email = document.getElementById('email').value;
            let name = document.getElementById('name').value;
             console.log(name);
            // if(pwd1!=pwd2) popupError('password');


            if(!username||!pwd1||!pwd2||pwd1!==pwd2||!email||!name){
                if(!username) popupError('username_error_reg'); 
                if(!pwd1) popupError('pwd_error_reg');
                if(!pwd2) popupError('cpwd_empty_error_reg');
                else if(pwd1!==pwd2)  popupError('cpwd_mismatch_error_reg');
                if(!email) popupError('email_error');
                if(!name) popupError('name_error');

            }else{
                clearboxs();

                const Data = {
                    "username": username,
                    "password": pwd1,
                    "email": email,
                    "name": name
                };
                const othePram = {
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify(Data),
                    method:"POST"
                };

                const api = new API('http://localhost:5000');
                const stopLogin = new Promise(()=>{
                    document.getElementById('register').style.visibility='hidden'
                    document.getElementsByClassName('lgin')[0].style.display='none'
                    document.getElementsByClassName('lgout')[0].style
                        .visibility = 'visible'
                    })
                
                api.makeAPIRequest('auth/signup',othePram)
                .then(data=>{console.log(data);localStorage.setItem(username,data.token)})
                .then(()=>{
                    const t = localStorage.getItem(username);
                    console.log(t)
                    return t
                })
                .then(t=>{
                    service.token = t;
                    service.username = username;
                    service.password = pwd1;
                    service.startService(stopLogin);
                }).catch(e=>alert(e.message))                
            }
        }

        function closeAllPopups(){
            const all_pops = Array.from(document.getElementsByClassName('pop-error'))

            all_pops.forEach((pe,i)=>pe.style.visibility='hidden')
        }

        function popupError(id){

           document.getElementById(id).style.visibility='visible';
        }

        export function closePopup(id){
            console.log(id,document.getElementById(id));
            document.getElementById(id).style.visibility='hidden';
        }

        export function logout(){
            alert('logout!')
        }