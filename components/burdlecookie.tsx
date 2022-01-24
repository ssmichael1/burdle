import Cookies from 'universal-cookie'


const cookies = new Cookies()

export interface CookieFormat {
    nplayed: number
    nwins: number;
    nlosses: number;
}

const set = (c: CookieFormat) => {
    cookies.set('burdle', c)
}

const get = (): CookieFormat => {
    let c = cookies.get('burdle')
    if (c === undefined) {
        return {
            nplayed: 0,
            nwins: 0,
            nlosses: 0
        }
    }
    return c as CookieFormat;
}

const BurdleCookie = {
    set: set,
    get: get
}

export default BurdleCookie
