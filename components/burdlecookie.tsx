import Cookies from 'universal-cookie'


const cookies = new Cookies()

export interface CookieFormat {
    nplayed: number
    nwins: number;
    nlosses: number;
}

const set = (c: CookieFormat) => {
    // Cookie expires 10 years in future
    cookies.set('burdle', c,
        {
            domain: 'bordle.app',
            secure: true,
            expires: new Date(Date.now() + 86400 * 365.25 * 10 * 1000)
        })
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
