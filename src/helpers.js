/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export function closeById(id){
    document.getElementById(id).style.visibility = 'hidden'
}

export function addEventListener(params){
    // if (params.length === 4) document.getElementById(params[0]).addEventListener(params[1],()=>{params[2](params[3])});
    // else document.getElementById(params[0]).addEventListener(params[1],params[2]);
    document.getElementById(params[0]).addEventListener(params[1],()=>{params[2](params[3])})
}
// export default class EventListener{
//     constructor(para) {
//         this.tagId = para[0];
//         this.event = para[1];
//         this.func = para[2];
//     }

export function open(dom){
    dom.style.visibility = 'visible';
}

export function close(dom){
    dom.style.visibility = 'hidden';
}

export function cleanBox(box,...except){
    if(except){
        let itms = [];
        except.forEach(e=>{
            itms.push(document.getElementById(e).cloneNode(true))
        })
        while(box.hasChildNodes()) {
            box.removeChild(box.lastChild)
        }itms.forEach(i=>{
            box.appendChild(i)
        })
    }else{
        while(box.hasChildNodes()){box.removeChild(box.lastChild)}
    }
}

export function appendText(id,text){
    document.getElementById(id).appendChild(
        document.createTextNode(text))
}

export function createTextDom(tag,text){
    const dom = document.createElement(tag)
    dom.appendChild(document.createTextNode(text))
    return dom
}