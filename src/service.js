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
            .visibility = 'hidden'

        document.getElementsByClassName('lgout')[0].style
            .visibility = 'visible'
        document.getElementsByClassName('main-bar')[0].style.visibility = 'visible'
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
        console.log(all_eles)
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
    service.allposts = [];
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
    .catch(e=>{alert(e.message)})
    service.httpGet(`user/?username = ${service.username}`)
        .then(data=>{
            service.following = data["following"];
            return 'ok'})
        .then((pos)=>{renderFollowList(service)})
        .catch(e=>{alert(e.message)})


    console.log(localStorage.getItem('scrollPosition'))
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
            .catch(e=>{alert(e.message)})

    }

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
            document.getElementById('pf_password').innerText = service.password;
            document.getElementById('follow_num').innerText = data["following"].length;
            document.getElementById('pf_followed').innerText = data["followed_num"];
            return data["following"]

        })
        .then((data)=>{
            const parent = document.getElementsByClassName('pp-window-body')[0];
            cleanBox(parent);
            data.forEach((id) =>{
                    service.httpGet(`user/?id=${id}`)
                        .then(data=>{
                            parent.appendChild(createTextDom('ul',data["username"]))
                        })
                }
            )
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
            appendText('user_follow',data["following"].length)
            appendText('user_followed',data["followed_num"])
            appendText('user_posts',data["posts"].length)
            return data["following"]

        }).then((data)=>{
        const parent = document.getElementsByClassName('window-body')[0];
        cleanBox(parent);
        data.forEach((id) =>{
                service.httpGet(`user/?id=${id}`)
                    .then(data=>{
                        parent.appendChild(createTextDom('ul',data["username"]))
                    })
            }
        )
    }).catch(e=>{alert(e.message)})



}

export function openFollowWindow(window,overlay){
    console.log('open!')
    console.log(window)

    if(window==null) return
    window.classList.add('active')
    console.log(window);
    overlay.classList.add('active')
}

export function closeFollowWindow(window,overlay){
    console.log(window,overlay)
    if(window==null) return
    window.classList.remove('active')
    overlay.classList.remove('active')
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
        }).catch(e=>{alert(e.message)})
}



export function getMyPosts(service,user=''){
    const path = (user) ?`user/?username=${user}`:'user/';
    service.httpGet(path)
        .then(data=>{
            service.posts = data["posts"]
            service.userid = data["id"];
            return "ok"
        })
        .then(()=>{
            let Id = (user) ?'user-posts':'personal-posts';
            let Parent = document.getElementById(Id);
            if(user) {
                cleanBox(Parent, 'up-follow-window', 'up-overlay');
                document.getElementById('up-window-close').addEventListener('click', () => {
                    const win = document.getElementById('up-follow-window');
                    const overlay = document.getElementById('up-overlay')
                    closeFollowWindow(win, overlay)
                });
            }
            else {
                cleanBox(Parent, 'pp-follow-window');
                document.getElementById('pp-window-close').addEventListener('click', () => {
                    const win = document.getElementById('pp-follow-window');
                    const overlay = document.getElementById('pp-overlay')
                    closeFollowWindow(win, overlay)
                });
            }

            let postType = (user)?'userPost':'myPost';
            if(user){
                Parent.appendChild(createTextDom('h1',`${user}'s Posts`))
                const p = createTextDom('div','')
                p.id = 'up-container'
                Parent.appendChild(p);
                Parent = p
            }

            service.posts.reverse().forEach((id)=>{
                service.httpGet(`post/?id=${id}`)
                    .then(data=>{
                        renderPost(data,Parent,service,postType)
                    })
            })
    })
}


function renderPost(data,Parent,service,postType='allPost'){
    //create dom
    const Post = document.createElement('div');
    const Description = document.createElement('div');
    const picDate = document.createElement('div');

    const Author = document.createElement('button');
    const Author_Date = document.createElement('div');
    const newCell = document.createElement('div');
    const metaData = document.createElement('div');
    const icons = document.createElement('div');
    let prefix = undefined;
    if(postType==='myPost') prefix = 'pp';
    else if(postType==='userPost') prefix = 'up';
    else  prefix = 'all';



    //build pic
    const Img = document.createElement('img');
    Img.src= 'data:image/png;base64,'+data["src"]
    newCell.className = "grid-item"
    if(postType==='myPost'){
        Author.appendChild(document.createTextNode('Delete'))
        Author.addEventListener('click',()=>{deletePost(data["id"],service)})
        Author.style.color = "red";
    }
    else{
        Author.appendChild(document.createTextNode(data["meta"]["author"]))
        Author.addEventListener('click',()=>{showUserProfile(data["meta"]["author"],service)})
    }



    Description.appendChild(document.createTextNode(data["meta"]["description_text"]));
    Description.id = "description_text"
    picDate.className = 'date';
    picDate.appendChild(document.createTextNode(toDateTime(data["meta"]["published"])));

    Author_Date.appendChild(Author);
    Author_Date.appendChild(picDate);
    Author_Date.className = 'author-date'


    // metaData.appendChild(Author_Date);
    metaData.appendChild(Description);
    metaData.className = 'metaData';

    //build icon
    const heart_icon = document.createElement('button');
    const  heart= document.createElement('div');
    console.log(data["id"],service.likes)
    if(service.likes.includes(data["id"])){
        heart_icon.appendChild(document.createTextNode(String.fromCodePoint(9829)))
        if(postType!=='myPost') heart_icon.addEventListener('click',()=>{likePost(service,data,false,postType)})
    }else{
        heart_icon.appendChild(document.createTextNode(String.fromCodePoint(9825)))
        if(postType!=='myPost') heart_icon.addEventListener('click',()=>{likePost(service,data,true,postType)})
    }
    heart_icon.style.cssText  = "background:none;border:none";
    heart_icon.id = `like-${data["id"]}`


    const likes = createTextDom('button',data["meta"]["likes"].length);

        // dialog_icon.setAttribute('data-modal-target', '#up-follow-window');


        likes.addEventListener('click', ()=>{
            const header = document.getElementById(`${prefix}-follow-window`).children[0].children[0]
            header.replaceWith(createTextDom('div','Liked by:'))
            header.className='window-title'
            const p = document.getElementsByClassName(`${prefix}-window-body`)[0];
            cleanBox(p);

                console.log(data["meta"]["likes"],data)
                const likes = data["meta"]["likes"]
                likes.forEach(id=>{
                    service.httpGet(`user/?id=${id}`)
                        .then(dt=>{
                            let name = createTextDom('button',dt["username"])
                            name.addEventListener('click',()=>{showUserProfile(dt["username"],service)})
                            p.appendChild(name);
                        }).catch(e=>{alert(e.message)})
                })


            let win = document.getElementById(`${prefix}-follow-window`);
            console.log(win)
            console.log(document.getElementsByClassName('follow-window'))
            const overlay = document.getElementById(`${prefix}-overlay`);
            openFollowWindow(win,overlay)
        })


    heart.className = 'heart'
    heart.appendChild(heart_icon)
    heart.appendChild(likes)

    const dialogs = document.createElement('div');
    const dialog_icon = document.createElement('button')
    dialog_icon.appendChild(document.createTextNode(String.fromCodePoint(128172)))

        // dialog_icon.setAttribute('data-modal-target', '#up-follow-window');


        dialog_icon.addEventListener('click', ()=>{
            const header = document.getElementById(`${prefix}-follow-window`).children[0].children[0]
            header.replaceWith(createTextDom('div','Comments:'))
            header.className='window-title'
            const p = document.getElementsByClassName(`${prefix}-window-body`)[0];
            cleanBox(p);
            data["comments"].forEach(c=>{
                let author = createTextDom('button',`${c["author"]} :`);
                author.addEventListener('click',()=>{showUserProfile(author,service)});
                let content = createTextDom('h3',c["comment"]);
                let author_content = createTextDom('div','');
                let Date = createTextDom('h4',toDateTime(c["published"]));
                let comment = createTextDom('div','');
                console.log(content)
                author_content.appendChild(author);
                author_content.appendChild(content);
                comment.appendChild(author_content);
                comment.appendChild(Date);

                p.appendChild(comment)
            })
            let win = document.getElementById(`${prefix}-follow-window`);
            console.log(win)

            const overlay = document.getElementById(`${prefix}-overlay`);
            console.log(overlay)
            openFollowWindow(win,overlay)
        })


    const comments = document.createElement('div')
    comments.appendChild(document.createTextNode(data["comments"].length));
    dialogs.appendChild(dialog_icon)
    dialogs.appendChild(comments)

    icons.appendChild(heart)
    icons.appendChild(dialogs)
    icons.className = 'icons'
    if(postType==='myPost'){
        const edit_des = createTextDom('button','edit')
        edit_des.addEventListener('click',()=>{editDescription(data["id"],Description,icons,service)})
        icons.appendChild(edit_des);
    }


    icons.className = 'icons'

    metaData.appendChild(icons)

    //build comments


    //
    newCell.appendChild(Author_Date);
    newCell.appendChild(Img);
    newCell.appendChild(metaData);

    Post.appendChild(newCell)
    if(postType==='allPost') Post.appendChild(renderComment(data,service))

    Post.className = "post"

    Parent.appendChild(Post);

    //show meta data
    //show comments
}

function editDescription(id, des, icons,service){
    const edit = createTextDom('textarea',des.innerText);
    const btn = icons.children[2];
    console.log(btn);
    const new_btn = createTextDom('button','submit');
    const file_input = createTextDom('input','New file');
    file_input.type = "file";

    des.replaceWith(edit);
    btn.replaceWith(new_btn);
    new_btn.parentNode.insertBefore(file_input, new_btn.nextSibling)
    new_btn.addEventListener('click',()=>{SubmitEditDes(edit,btn,id,file_input,service)})
    console.log(des,btn);
}

function SubmitEditDes(edit,btn,id,file_input,service){
    const des = edit.value;

    const file = file_input.files[0];
    const Data = {
        "description_text":des,
    }
    if(file) {
        fileToDataUrl(file)
            .then(url=>{
                console.log(url)
                return url.split(',')[1]
            })
            .then((url)=>{
                Data["src"] = url;
                return "ok"
            })
            .then(()=>{
                service.httpPost(`post/?id=${id}`,Data,"PUT")
                    .then(getMyPosts(service))
                    .catch(e=>{alert(e.message)})
        })
    }else{
        service.httpPost(`post/?id=${id}`,Data,"PUT")
            .then(getMyPosts(service))
    .catch(e=>{alert(e.message)});
    }




}

function renderComment(data,service){
    //comments(comments-container(likedby,comments[1,2,3]))
    const comments = document.createElement('div');
    const comments_container = document.createElement('div');
    const add_comment = document.createElement('div');
    // comments.appendChild(comments_container)





    const comments_content = document.createElement('div');
    const comments_header = createTextDom('h3','comments');
    comments_header.id = 'comment-header';
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
    textarea.cols = 25;
    textarea.rows = 2;
    const comment_btn = document.createElement('button');
    comment_btn.appendChild(document.createTextNode('submit'))
    comment_btn.id = `comment-submit-${data["id"]}`
    comment_btn.style.display = "block"
    // comment_btn.className = "btn1"
    comment_btn.addEventListener('click',()=>{submitComment(service,data["id"])})
    add_comment.appendChild(textarea);
    add_comment.appendChild(comment_btn);
    add_comment.id="add-comment"



    comments.appendChild(add_comment);
    comments.id = "comments"

    const users_liked =data["meta"]["likes"]
    console.log(users_liked)
    let liked_users = users_liked.join(', ');
    const liked_by = document.createElement('div');
    const text = createTextDom('h4',`Liked by: ${liked_users}`)
    liked_by.appendChild(text);
    liked_by.style.margin = "0.5vw 0 0 0vw";
    comments.appendChild(liked_by)



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
        .then(service.following.push())
        .then(()=>{
            getAllPosts(service);
        }).catch(e=>{alert(e.message)})
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
        service.httpGet('user/')
            .then(data=>{
                data["following"].forEach((id)=>{
                    service.httpGet(`user/?id=${id}`)
                        .then(data=>{console.log(data);return data["username"]})
                        .then(name=>{
                            const oneLine = createTextDom('ul','');
                            const ele = createTextDom('button',name)
                            const uf_btn = createTextDom('button','unfollow');
                            uf_btn.addEventListener('click',()=>{
                                unFollowUser(service,name)
                            })
                            ele.addEventListener('click',()=>{
                                showUserProfile(name,service);
                            })
                            uf_btn.style.display = "inline-block";
                            ele.style.cssText = "background:none;border:none"

                            oneLine.appendChild(ele)
                            oneLine.appendChild(uf_btn)
                            parent.appendChild(oneLine);
                        }).catch(e=>{alert(e.message)})
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
        }).catch(e=>{alert(e.message)})
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

function likePost(service,data,like=true,postType="allPost"){
    //send request
    if(!like){
        service.httpGet(`post/unlike?id=${data["id"]}`,"PUT")
            .then(removeItem(service.likes,data["id"]))
            .then(()=>{
                if(postType==="allPost")getAllPosts(service);
                if(postType==="myPost")getMyPosts(service);
                if(postType==="userPost")getMyPosts(service,data["meta"]["author"]);
            }).catch(e=>{alert(e.message)})
    }else{
        service.httpGet(`post/like?id=${data['id']}`,"PUT")
            .then(()=>{
                service.likes.push(data["id"])
            }).then(()=>{
            if(postType==="allPost")getAllPosts(service);
            if(postType==="myPost")getMyPosts(service);
            if(postType==="userPost")getMyPosts(service,data["meta"]["author"]);

            }).catch(e=>{alert(e.message)})
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

function deletePost(id,service){
    service.httpGet(`post/?id=${id}`,"DELETE")
        .then(()=>getMyPosts(service))
        .catch(e=>{alert(e.message)})
}

