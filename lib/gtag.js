// Can't figure out how to hard-code this and
// have it served up via static github pages,
// but I don't think it matters if it is 
// public, so...
export const GA_TRACKING_ID = 'G-PLSFESTZJQ'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
}