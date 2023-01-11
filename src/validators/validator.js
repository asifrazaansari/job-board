const isvalidEmail = (email) => {
    const emailRegex = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/
    return emailRegex.test(email)
}
const isvalidPass = (pass) => {
    const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/
    return passRegex.test(pass)
}

const validateObjectId = (id) => {
    var bool = false;
    if (id.length == 24) bool = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/.test(id);
    return bool;
}
const isValidString = (data) => {
    if (typeof data !== 'string' || data === undefined || data === null) {
        return false;
    } else if (typeof data === 'string' && data.trim().length === 0) {
        return false;
    } else {
        return true;
    }
}

const imageValid = (img) => {
    const reg = /image\/png|image\/jpeg|image\/jpg/;
    return reg.test(img);
};


const nameRegex = (value) => {
    if (!value) return false
    value = value.toLowerCase()
    if (value == "true" || value == "false") return false
    let nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    if (nameRegex.test(value)) return true;
};


module.exports = {
    isvalidEmail,
    isvalidPass,
    validateObjectId,
    isValidString,
    nameRegex,
    imageValid,
}