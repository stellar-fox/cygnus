import { emptyString } from "@xcmats/js-toolbox"




/**
 * Holds regular expression used to check the validity of the domain format.
 */
const regexpDomainFormat = new RegExp(
    /^(\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/
)


/**
 * This function checks the validity of email address format.
 * @param {String} email
 * @returns {Boolean}
 */
export const emailIsValid = (email) => !!(
    new RegExp([
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))/,
        /@/,
        regexpDomainFormat,
    ].map(r => r.source).join(emptyString()))
).test(email)


/**
 * This function checks the validity of password.
 * @param {String} email
 * @returns {Boolean}
 */
export const passwordIsValid = (password) => !!/^.{8,}$/.test(password)
