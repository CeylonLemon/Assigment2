import API from './api_.js'
import  { closeById,fileToDataUrl} from './helpers.js'





// document.getElementById('add-post-btn').addEventListener('click',()=>
//     document.getElementById('add-posts').style.visibility = 'visible'
// )

export default class SERVICE {
    /** @param {String} url */
    token
    un
    constructor(token,un) {
        this.token = token;
        this.un = un;
    } 

    /** @param {String} path */
    startService(stopLogin){
    	stopLogin
    	.then(this.renderService())
    }
    
    renderService(){
        console.log(this.token)
    	const api = new API('http://localhost:5000');
    	const Para = {
    		headers:{
                        "Content-Type": "application/json",
                        "Authorization": 'Token '+this.token
                    },
            method:"GET"

    	}
    	api.makeAPIRequest('user/feed?p=1&n=10', Para)
    	.then(data=>readPosts(data))
        document.getElementById('main-page').style.visibility='visible';


    }
}

function readPosts(data){
    if(!data.posts) document.getElementById('no-posts').style.visibility='visible';
}

export function toStart(){
    const p = new Promise((resolve)=>{
        console.log('p1')
        console.log(document.getElementsByClassName('main-bar')[0].children)
        console.log(document.getElementById('add-posts-btn'))
        resolve( document.getElementsByClassName('main-bar')[0].children);
    })


    p.then(eles=>{
        console.log(eles.prototype)
        for(let i=0;i<eles.length;i++){
            eles[i].addEventListener('click',()=>
                switchState(eles[i].id))
        }
        // eles.prototype.forEach.call(parent.children,btn=>document.getElementById(btn.id.addEventListener('click',()=>
        //     switchState(btn.id))))
    });
}

export function switchState(btn){
    console.log('switxh')
    let btn_target = {
        'all-posts-btn':'all-posts',
        'add-posts-btn':'add-posts',
        'personal-posts-btn': 'personal-posts',
        'my-profile-btn': 'my-profile'
    }
    let all_eles = Array.from(document.getElementsByClassName('all_apps')[0].children)
    let close_eles = all_eles.filter(ele=>ele.id !== btn_target[btn])
    close_eles.forEach((b)=>b.style.visibility = 'hidden')
    document.getElementById(btn_target[btn]).style.visibility = 'visible'

}


export function addPostSubmit(service){
    const ap = new Promise((resolve,reject)=>{
        //check if src, des, valid
        const des = document.getElementById('add-posts-des').value;
        const file = document.querySelector('input[type="file"]').files[0]
        if(!des) reject('description should not be empty!');
        if(!file) reject('Please choose a file!');
        fileToDataUrl(file)
            .then(url=>{
                console.log(url)
                resolve([des,url.split(',')[1]])
            })

    })
    ap.then(data=>{
        const token = service.token;
        const Data = {
            "description_text": data[0],
            "src": data[1]
        };

        const othePram = {
            headers:{
                "Authorization": "Token "+token,
                "Content-Type": "application/json"
            },
            body:JSON.stringify(Data),
            method:"POST"
        };

        const api =  new API('http://localhost:5000');
        api.makeAPIRequest('post/',othePram)
            .then(data=>{
                alert('Post success!')
                let forms = document.querySelectorAll('.add-post-form')
                for(const i of forms){
                    i.value = '';
                }

            })
            .catch(e=>{alert(e.message)})
    }).catch(e=>{alert(e.message)})
}

export function getAllPosts(service){
    const api =  new API('http://localhost:5000');
    const token = service.token;
    console.log('gap')
    const othePram = {
        headers:{
            "Authorization": "Token "+token,
            "Content-Type": "application/json"
        },
        method:"GET"
    };
    api.makeAPIRequest('user/feed?p=0&n=10',othePram)
        .then(data=>{
            console.log(data)

        })
        .catch(e=>{alert(e.message)})

}
export function addPost(){
    switchState('add-post-btn')
}

export function showMyProfile(){
    switchState('my-profile-btn')
    alert('show my profile')
}

export function showMyPosts(){
    switchState('personal-posts-btn')
    alert('show my posts')
}



