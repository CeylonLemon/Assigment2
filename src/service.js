import API from './api_.js'
import {appendText, cleanBox, closeById, createTextDom, fileToDataUrl} from './helpers.js'


export default class SERVICE {
    /**
     * @param token
     * @param un
     * @param pwd
     */
    constructor(token,un,pwd) {
        this.id = undefined;
        this.token = token;
        this.username = un;
        this.password = pwd;
        this.api = new API('http://localhost:5000');
        this.editMode = [];
        this.userid = undefined;
        this.posts = [];
        this.following = [];
        this.followed_num = undefined;
        this.posts = [];
        this.allposts = [];
        this.likes = [];
        this.email = undefined;
        this.stopScroll = false;





    }
    // updateInfo = new Promise((resolve)=>{
    //     this.httpGet(`user/?username=${this.username}`)
    //         .then(data=>{
    //             console.log(data)
    //             this.id = data["id"];
    //             this.username = data["username"];
    //             this.email = data["email"];
    //             this.posts = data["posts"];
    //             this.following = data["following"];
    //             this.followed_num = data["followed_num"];
    //             console.log('after update, following',this.following);
    //             resolve();
    //         })
    // })
    updateInfo(data){
        console.log(data)
        this.id = data["id"];
        this.username = data["username"];
        this.email = data["email"];
        this.posts = data["posts"];
        this.following = data["following"];
        this.followed_num = data["followed_num"];
        console.log('after update, following',this.following);
    }
    startService(){
        console.log(111)
        document.getElementById('login').style.visibility='hidden'
        document.getElementsByClassName('lgin')[0].style
            .display='none'

        document.getElementsByClassName('lgout')[0].style
            .visibility = 'visible'
        document.getElementById('main-page').style.visibility='visible';

        this.httpGet(`user/?username = ${this.username}`)
            .then(data=>this.userid = data["id"])
            .then(()=>{getAllPosts(this)})

    }




    httpGet(path,method="GET"){
        const Para = {
            headers:{
                "Content-Type": "application/json",
                "Authorization": 'Token '+this.token
            },
            method:method

        }
        return this.api.makeAPIRequest(path, Para)
    }

    httpPost(path,Data,method="POST"){
        const Para = {
            headers:{
                "Content-Type": "application/json",
                "Authorization": 'Token '+this.token
            },
            body:JSON.stringify(Data),
            method:method
        }
        return this.api.makeAPIRequest(path, Para)
    }
}
// function updateInformation(service){
//     return service.httpGet(`user/?username=${service.username}`)
//         .then(data=>{
//             console.log(data)
//             service.id = data["id"];
//             service.username = data["username"];
//             service.email = data["email"];
//             service.posts = data["posts"]
//             service.following = data["following"]
//             service.followed_num = data["followed_num"]
//             console.log('after update, following',service.following)
//         })
//
// }

export function toStart(){
    const p = new Promise((resolve)=>{
        resolve( document.getElementsByClassName('main-bar')[0].children);
    })

    p.then(eles=>{
        for(let i=0;i<eles.length;i++){
            eles[i].addEventListener('click',()=>
                switchState(eles[i].id))
        }
    });
}


export function switchState(btn){
        const id = btn.slice(0,btn.length-4)
        const all_eles = Array.from(document.getElementsByClassName('all_apps')[0].children)
        const close_eles = all_eles.filter(ele=>ele.id !== id)
        console.log(close_eles)
        close_eles.forEach((b)=>b.style.visibility = 'hidden')
        document.getElementById(id).style.visibility = 'visible'

}


export function addPostSubmit(service){
    console.log('aps')
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
        const Data = {
            "description_text": data[0],
            "src": data[1]
        }
            service.httpPost('post/',Data)
                .then(alert('success'))
            .catch(e=>{alert(e.message)})
    }).catch(e=>{alert(e.message)})
}


export function getAllPosts(service) {

    switchState('all-posts-btn')
    const box = document.getElementsByClassName('posts')[0]
    cleanBox(box)
    const pos = localStorage.getItem('scrollPosition')
    service.httpGet('user/feed?p=0&n=10')
        .then(data => {
            Array.from(data["posts"]).reverse().forEach((post) =>{
                if(!service.allposts.includes(post['id'])){
                    service.allposts.push(post['id'])
                }
                if(post["meta"]["likes"].includes(service.userid)
                    && !service.likes.includes(post["id"])) service.likes.push(post["id"])
                renderPost(post, box, service);

                })

        }).then(()=>{box.scrollTo(0, pos);console.log(pos)})
    // .catch(e=>{alert(e.message)})
    service.httpGet(`user/?username = ${service.username}`)
        .then(data=>{
            service.following = data["following"];
            return 'ok'})
        .then((pos)=>{renderFollowList(service)})

    // service.update.then(data=>{console.log(service.following);renderFollowList(service)})


    // service.httpGet(`user/?username = ${service.username}`)
    //     .then(data => {
    //         console.log(service.following, data["following"])
    //         const arr1 = Array.from(service.following)
    //         const arr2 = Array.from(data["following"])
    //         if (!arraysMatch(service.following, data["following"])) {
    //             service.following = data["following"]
    //             const box = document.getElementsByClassName('follow')[0];
    //             cleanBox(box);
    //             return true
    //         }
    //         return false
    //     }).then(refresh => {
    //     if (refresh) renderFollowList(service)
    // })
    // .catch(e=>alert(e.message))
    console.log(localStorage.getItem('scrollPosition'))
    // box.scrollTo(0, localStorage.getItem('scrollPosition'));
}

export function addFeed(service){
    let n = service.allposts.length;
    let parent = document.getElementsByClassName('posts')[0];
    console.log(service.allposts)
    if(!service.stopScroll){
        service.stopScroll = true;
        service.httpGet(`user/feed?p=${n}&n=${n+10}`)
            .then((data)=>{
                console.log(data)
                data["posts"].forEach((post)=>{
                    console.log(post["id"],post)
                    if(!service.allposts.includes(post["id"])){
                        service.allposts.push(post["id"])}
                        console.log(data)
                        renderPost(post,parent,service);

                });return "ok";
            }).then(()=>service.stopScroll=false)

    }
    // service.httpGet(`user/feed?n=${n}&p=${n+10}`)
    //     .then((data)=>{
    //         data["posts"].forEach((post)=>{
    //             console.log(post["id"],post)
    //             if(!service.allposts.includes(post["id"])){
    //                 service.allposts.push(post["id"])
    //                 console.log(data)
    //                 renderPost(post,parent,service);
    //             }
    //         });return "ok";
    //     }).then(()=>service.stopScroll=false)

}

export function addPost(){
    switchState('add-posts-btn')

}


export function showMyProfile(service){
    switchState('my-profile-btn')
    service.httpGet('user/?username='+service.username)
        .then(data=>{
            ['pf_username','pf_name','pf_email'].forEach((id)=>{
                document.getElementById(id).innerText = data[id.slice(3)]
                service[id.slice(3)] = data[id.slice(3)]
            })
            document.getElementById('pf_password').innerText = service.password
        })
        .catch(e=>{alert(e.message)})
}


export function showUserProfile(id,service){
    switchState('user-profile-btn')
    //fetch profile
    const doms = document.getElementsByClassName('user_content')
    Array.from(doms).forEach((dom)=>{
        dom.innerText = '';
    })
    service.httpGet(`user/?username=${id}`)
        //display profile
        .then(data=>{
            console.log(service)
            document.getElementById("follow_user").addEventListener('click',()=>{
                followUser(service,id)
            })
            console.log(data)
            appendText('user_username',data["username"])
            appendText('user_name',data["name"])
            appendText('user_email',data["email"])
            appendText('following',`Following:  ${data["following"].length}`)
            appendText('followed',`Followed:  ${data["followed_num"]}`)
            appendText('posts',`Posts:  ${data["posts"].length}`)
        })


}


export function showMyPosts(){
    switchState('personal-posts-btn')
    alert('show my posts')

}

export function edit(para){
    const id = para[0].slice(5)
    const s = para[1]
    const item = document.getElementById(`pf_${id}`);
    const newItem = document.createElement('input');
    newItem.id= `${id}_text`
    newItem.type = "text"
    newItem.value = s[id]
    item.replaceWith(newItem)
    s.editMode.push(id)
    document.getElementById('edit-submit').style.visibility = 'visible'
}


export function editSubmit(s){
    //get value of element
    const Data = {}
    s.editMode.forEach((id)=>
        Data[id] = document.getElementById(`${id}_text`).value
    )
    //sent request
    s.httpPost('user/',Data,"PUT")
        .then(data=>{
            //change the content of page
            s.editMode.forEach((id)=>{
                const item = document.getElementById(`${id}_text`);
                const newItem = document.createElement('span');

                newItem.className = "pf_content"
                newItem.id =`pf_${id}`
                newItem.innerHTML = Data[id]
                item.replaceWith(newItem)
                s[id] = Data[id]
                s.editMode =[]
                closeById('edit-submit')
            })
            alert('success!')
        })
}



export function getMyPosts(service){
    //send http request
    const p = new Promise((resolve)=>{
        console.log(1)
        let refresh = false
        service.httpGet('user/')
            .then(data=>{
                console.log(data["posts"])
                console.log(service.posts)
                if (!arraysMatch(data["posts"],service.posts)){

                    console.log(2)
                    service.posts = data["posts"]
                    refresh = true
                }
                service.userid = data["id"];
                resolve(refresh)
            })

    })
    p.then((refresh)=>{
        console.log(service.posts);
        console.log(service.posts)
        if(refresh){
            const Parent = document.getElementById('personal-posts');
            const box = document.getElementById('personal-posts')
            cleanBox(box)
            service.posts.reverse().forEach((id)=>{
                service.httpGet(`post/?id=${id}`)
                    .then(data=>{
                        console.log(data)

                        renderPost(data,Parent,service)

                    })
            })
            Parent.scrollTo(0, localStorage.getItem('scrollPosition'));
        }
    })
}

function renderPost(data,Parent,service){
    //create dom
    const Post = document.createElement('div');
    const Description = document.createElement('div');
    const picDate = document.createElement('div');
    const likes = document.createElement('div');
    const Author = document.createElement('button');
    const Author_Date = document.createElement('div');
    const newCell = document.createElement('div');
    const metaData = document.createElement('div');
    const icons = document.createElement('div');



    //build pic
    const Img = document.createElement('img');
    Img.src= 'data:image/png;base64,'+data["src"]
    newCell.className = "grid-item"
    Author.appendChild(document.createTextNode(data["meta"]["author"]))


    Description.appendChild(document.createTextNode(data["meta"]["description_text"]));
    Description.id = "description_text"
    picDate.className = 'date';
    picDate.appendChild(document.createTextNode(toDateTime(data["meta"]["published"])));

    Author_Date.appendChild(Author);
    Author_Date.appendChild(picDate);
    Author_Date.className = 'author-date'


    metaData.appendChild(Author_Date);
    metaData.appendChild(Description);
    metaData.className = 'metaData';

    //build icon
    const heart_icon = document.createElement('button');
    const  heart= document.createElement('div');
    console.log(data["id"],service.likes)
    if(service.likes.includes(data["id"])){
        heart_icon.appendChild(document.createTextNode(String.fromCodePoint(9829)))
        heart_icon.addEventListener('click',()=>{likePost(service,data["id"],false)})
    }else{
        heart_icon.appendChild(document.createTextNode(String.fromCodePoint(9825)))
        heart_icon.addEventListener('click',()=>{likePost(service,data["id"])})
    }
    heart_icon.style.cssText  = "background:none;border:none";
    heart_icon.id = `like-${data["id"]}`

    likes.appendChild(document.createTextNode(data["meta"]["likes"].length))
    heart.className = 'heart'
    heart.appendChild(heart_icon)
    heart.appendChild(likes)

    const dialogs = document.createElement('div');
    const dialog_icon = document.createElement('div')
    dialog_icon.appendChild(document.createTextNode(String.fromCodePoint(128172)))
    const comments = document.createElement('div')
    comments.appendChild(document.createTextNode(data["comments"].length));
    dialogs.appendChild(dialog_icon)
    dialogs.appendChild(comments)

    icons.append(heart)
    icons.append(dialogs)
    icons.className = 'icons'

    metaData.appendChild(icons)

    //build comments


    //
    newCell.appendChild(Img);
    newCell.appendChild(metaData);

    Post.appendChild(newCell)
    Post.appendChild(renderComment(data,service))
    Post.className = "post"

    Parent.appendChild(Post);

    //show meta data
    //show comments
}

function renderComment(data,service){
    //comments(comments-container(likedby,comments[1,2,3]))
    const comments = document.createElement('div');
    const comments_container = document.createElement('div');
    const add_comment = document.createElement('div');
    // comments.appendChild(comments_container)
    const users_liked = data["meta"]["likes"].join(', ');
    const liked_by = document.createElement('div');
    const text = createTextDom('h4',`Liked by: ${users_liked}`)

    liked_by.appendChild(text);
    liked_by.style.margin = "0 0 0 1vw";
    comments.appendChild(liked_by)

    const comments_content = document.createElement('div');
    const comments_header = createTextDom('h3','comments');
    comments_header.style.margin = "0 0 0 1vw";
    Array.from(data["comments"]).reverse().forEach((comment)=>{
        const author = createTextDom('button',`${comment['author']}: `)
        author.addEventListener('click', ()=>{showUserProfile(comment['author'],service)})
        author.style.cssText = "display:inline;border:none;background:none;"
        author.className = 'comment-user';
        const content = createTextDom('span',` ${comment["comment"]}`)
        const date = createTextDom('div', `${toDateTime(comment["published"])}`)
        content.className="comment-content"
        comments_content.appendChild(author)
        comments_content.appendChild(content)
        comments_content.appendChild(date)
        comments_content.className = "comments-content"
    })
    comments_content.id = "comments-content"
    comments.appendChild(comments_header)
    comments.appendChild(comments_content)

    const textarea = document.createElement('textarea');
    textarea.id = `comment-content-${data["id"]}`
    textarea.placeholder = "Write your comment..."
    const comment_btn = document.createElement('button');
    comment_btn.appendChild(document.createTextNode('submit'))
    comment_btn.id = `comment-submit-${data["id"]}`
    comment_btn.style.display = "block"
    // comment_btn.className = "btn1"
    comment_btn.addEventListener('click',()=>{submitComment(service,data["id"])})
    add_comment.appendChild(textarea);
    add_comment.appendChild(comment_btn);
    add_comment.style.margin = "1vw 0 0 1vw";
    add_comment.id="add-comment"



    comments.appendChild(add_comment);
    comments.id = "comments"



    return comments;

}

function toDateTime(secs) {
    const t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(parseFloat(secs));
    return t.toDateString().slice(4)
}

var arraysMatch = function (arr1, arr2) {
    console.log(arr1,arr2,[].length)

    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;

};

export function followUser(service,user=undefined){
    console.log(service)
    if(!user) user = document.getElementById('follow-username').value;
    if(user===service.username){
        alert('Cannot follow yourself!')
        return
    }
    service.httpGet(`user/follow/?username=${user}`,"PUT")
        .then(()=>{
            getAllPosts(service);
        })
        // .catch(e=>alert(e.message))
}

export function unFollowUser(service,user){
    console.log('unfollow')
    service.httpGet(`user/unfollow?username=${user}`,"PUT")
        .then(()=>{
            getAllPosts(service);
        })
        .catch(e=>alert(e.message))
}

function renderFollowList(service){
    // service.updateInfo.then(console.log(service.following));
    // p.then(()=>{console.log(service.following)})

    // console.log(service.following);
    const parent = document.getElementsByClassName('follow')[0];
    cleanBox(parent)

    if(!service.following){
        const ele = document.createElement('ul');
        ele.appendChild(document.createTextNode('You are not following any user!'))
        parent.appendChild(ele)
    }else{
        console.log(service.following)
        service.following.forEach((id)=>{
            service.httpGet(`user/?id=${id}`)
                .then(data=>{console.log(data);return data["username"]})
                .then(name=>{
                    const ele = createTextDom('ul',name)
                    const uf_btn = createTextDom('button','unfollow');
                    uf_btn.addEventListener('click',()=>{
                        unFollowUser(service,name)
                    })
                    uf_btn.style.display = "inline-block";
                    parent.appendChild(ele)
                    parent.appendChild(uf_btn)
                })
        })
    }

    console.log(service.following)
}

//get feed
//

export function submitComment(service,id){
    //get content
    console.log(1)
    const content = document.getElementById(`comment-content-${id}`).value;
    //send request
    const Data = {
        "comment":content
    }
    service.httpPost(`post/comment?id=${id}`, Data,"PUT")
        .then(()=> {
            service.allPosts = [];
            //rerender comment
            getAllPosts(service);
        })
}

function addMyComment(text,service){
    const comments_content = document.getElementById('comments-content');
    const author = createTextDom('button',`${service.username}: `)
    author.addEventListener('click', ()=>{showUserProfile(service.username,service)})
    author.style.cssText = "display:inline;border:none;background:none;"
    author.className = 'comment-user';
    const content = createTextDom('span',` ${comment["comment"]}`)
    const date = createTextDom('div', `${toDateTime(comment["published"])}`)
    content.className="comment-content"
    comments_content.appendChild(author)
    comments_content.appendChild(content)
    comments_content.appendChild(date)
    comments_content.className = "comments-content"
}

function likePost(service,id,like=true){
    //send request
    if(!like){
        service.httpGet(`post/unlike?id=${id}`,"PUT")
            .then(removeItem(service.likes,id))
            .then(()=>{getAllPosts(service)})
    }else{
        service.httpGet(`post/like?id=${id}`,"PUT")
            .then(()=>{
                service.likes.push(id)
            }).then(()=>{getAllPosts(service)})
    }
    //rerender

}

function removeItem(arr,val){
    for( var i = 0; i < arr.length; i++){

        if ( arr[i] === val) {

            arr.splice(i, 1);
        }

    }
}
