const isvalidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
}
const isvalidPass = (pass) => {
    const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/
    return passRegex.test(pass)
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

const isValidResume = (resume) => {
    const reg = /application\/doc|application\/pdf/
    return reg.test(resume);
}

const isValidCoverLetter = (coverLetter) => {
    const reg = /text\/md|text\/markdown/
    return reg.test(coverLetter);
}


const nameRegex = (value) => {
    if (!value) return false
    value = value.toLowerCase()
    if (value == "true" || value == "false") return false
    let nameRegex = /^[A-Za-z\s]+[.]?[A-Za-z0-9\s]*$/
    if (nameRegex.test(value)) return true;
};


module.exports = {
    isvalidEmail,
    isvalidPass,
    isValidString,
    nameRegex,
    isValidResume,
    isValidCoverLetter
}