
import API from './src/api_.js';
import addEventListener from './src/helpers'
// window.onload=function(){
//             const event_listeners = [
//                 ['login-btn', 'click', openLogin],
//                 ['register-btn','click',openRegister],
//                 ['login-submit','click', login],
//                 ['register-submit','click', register]
//
//             ]
//             event_listeners.forEach((params)=>addEventListener(params));
//             // document.getElementById('login-btn').addEventListener('click', openLogin);
//             // document.getElementById('register-btn').addEventListener('click', openRegister);
//             // document.getElementById('login-submit').addEventListener('click',login);
//             // document.getElementById('register-submit').addEventListener('click',register);
//
//             close_btns.forEach((btn,i)=>document.getElementById(btn).addEventListener('click', function(){closePopup(btn.slice(6))}));
//             close_btns_reg.forEach((btn,i)=>document.getElementById(btn).addEventListener('click', function(){closePopup(btn.slice(6))}));
//             // document.getElementById('close_username_error').addEventListener('click', closeError);
//         }
//
//         let close_btns = ['close_username_error', 'close_pwd_error', 'close_cpwd_empty_error','close_cpwd_mismatch_error']
//
//         let close_btns_reg = ['close_username_error_reg', 'close_pwd_error_reg', 'close_cpwd_empty_error_reg','close_cpwd_mismatch_error_reg','close_email_error','close_name_error']
//
//         let popErrors = ['username_error','pwd_error','cpwd_empty_error','cpwd_mismatch_error']
//
//         let popErrors_reg = ['username_error_reg','pwd_error_reg','cpwd_empty_error_reg','cpwd_mismatch_error_reg','email_error','name_error']
//
//         let inputboxs = ['username','password','confirm']
//
//         let inputboxs_reg = ['username_reg','password_reg','confirm_reg', 'email', 'name']


        function clearboxs(reg=false){
            var ib = (reg)?inputboxs_reg:inputboxs;
            ib.forEach((id,i)=>document.getElementById(id).value='')
        }

        function displaylogin(){
            var username = document.getElementById('username').value;
            console.log(username);
        }

        function openLogin(){
            document.getElementById('register').style.visibility = 'hidden';
            document.getElementById('login').style.visibility = 'visible';
        }

        function openRegister(){
            document.getElementById('login').style.visibility = 'hidden';
            document.getElementById('register').style.visibility ='visible';
        }

        function login(){
            console.log('login');
            closeAllPopups();
            let name = document.getElementById('username').value;
            let pwd1 = document.getElementById('password').value;
            let pwd2 = document.getElementById('confirm').value;
             console.log(name);
            // if(pwd1!=pwd2) popupError('password');
            if(!name||!pwd1||!pwd2||pwd1!=pwd2){
                if(!name) popupError('username_error'); 
                if(!pwd1) popupError('pwd_error');
                if(!pwd2) popupError('cpwd_empty_error');
                else if(pwd1!=pwd2)  popupError('cpwd_mismatch_error'); 
            }else{
                clearboxs();
    
                const url = 'http://127.0.0.1:5000/auth/login';
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
                // console.log(Data)
                // fetch(url, othePram)
                // .then(data=>{return data.json()})
                // .then(res=>{console.log(res.token)})
                // .catch(error=>console.log(error))
                const api = new API('http://localhost:5000',othePram);
                makeAPIRequest('auth/login');
            }
            // console.log(name.value,pwd1.value);
            
        }

        function register(){
            console.log('login');
            closeAllPopups(true);
            let username = document.getElementById('username_reg').value;
            let pwd1 = document.getElementById('password_reg').value;
            let pwd2 = document.getElementById('confirm_reg').value;
            let email = document.getElementById('email').value;
            let name = document.getElementById('name').value;
             console.log(name);
            // if(pwd1!=pwd2) popupError('password');
            if(!username||!pwd1||!pwd2||pwd1!=pwd2||!email||!name){
                if(!username) popupError('username_error_reg'); 
                if(!pwd1) popupError('pwd_error_reg');
                if(!pwd2) popupError('cpwd_empty_error_reg');
                else if(pwd1!=pwd2)  popupError('cpwd_mismatch_error_reg'); 
                if(!email) popupError('email_error');
                if(!name) popupError('name_error');

            }else{
                clearboxs(true);
                // (async () =>{
                //     const rawResponse = await fetch('http://127.0.0.1:5000/auth/signup' ,{
                //         method: 'POST',
                //         headers: {
                //             'Accept': 'application/json',
                //             'Content-Type': 'application/json'
                //         },
                //         body:JSON.stringify({"username":username,
                //             "password":pwd1,"email":email, "name":name})

                //     });
                //     const content = await rawResponse.json();

                //     console.log(content);
                // })
                const url = 'http://127.0.0.1:5000/auth/signup';
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
                console.log(Data)
                fetch(url, othePram)
                .then(data=>{return data.json()})
                .then(res=>{console.log(res)})
                .catch(error=>console.log(error))
            }
        }

        function closeAllPopups(reg=false){
            var errors = (reg)?popErrors_reg:popErrors
            console.log(errors)

            errors.forEach((pe,i)=>document.getElementById(pe).style.visibility='hidden')
        }

        function popupError(id){

           document.getElementById(id).style.visibility='visible';
        }

        function closePopup(id){
            console.log(id);
            document.getElementById(id).style.visibility='hidden';
        }
