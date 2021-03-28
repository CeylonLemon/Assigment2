/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */
const getJSON = (path, options) => 
    fetch(path, options)
        .then(res => {return processResponse(res)})
        .then(data => {return data});
        // .catch(err => console.warn(`API_ERROR: ${err.message}`));

function processResponse(r){
    if(r.status === 200){
        return r.json();
    }else {
            let error = new Error(r.status+' ');

            error.status = r.status;
            throw error;
    }
}
/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
export default class API {
    /** @param {String} url */
    constructor(url) {
        this.url = url;
    } 

    /** @param {String} path */
    makeAPIRequest(path,options) {
        return getJSON(`${this.url}/${path}`,options);
    }
}