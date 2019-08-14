import { LOAD_HOME_PAGE, LOAD_ACTIONS_PAGE, LOAD_EVENTS_PAGE, LOAD_SERVICE_PROVIDERS_PAGE, LOAD_TESTIMONIALS_PAGE, LOAD_TEAMS_PAGE, LOAD_ABOUT_US_PAGE, LOAD_IMPACT_PAGE, LOAD_DONATE_PAGE, LOAD_EVENTS, LOAD_ACTIONS, LOAD_SERVICE_PROVIDERS, LOAD_TESTIMONIALS, ADD_TESTIMONIAL, REMOVE_TESTIMONIAL, JOIN_TEAM, LOAD_MENU, LOAD_POLICIES, LOAD_EVENT_RSVPS, ADD_RSVP, REMOVE_RSVP, CHANGE_RSVP } from '../actions/types';

const initialState = {
    //page data for each page
    homePage: null,
    actionsPage: null,
    serviceProvidersPage: null,
    testimonialsPage: null,
    teamsPage: null,
    aboutUsPage: null,
    impactPage: null,
    donatePage: null,
    eventsPage: null,
    //menu, navbar footer...
    menu: null,
    policies: null,
    //objects to be loaded
    actions: null,
    events: null,
    serviceProviders: null,
    testimonials: null,
};


export default function (state = initialState, action) {
    switch (action.type) {
        /**************************/
        case LOAD_HOME_PAGE:
            return {
                ...state,
                homePage: action.payload
            }
        case LOAD_ACTIONS_PAGE:
            return {
                ...state,
                actionsPage: action.payload
            }
        case LOAD_SERVICE_PROVIDERS_PAGE:
            return {
                ...state,
                serviceProvidersPage: action.payload
            }
        case LOAD_TESTIMONIALS_PAGE:
            return {
                ...state,
                testimonialsPage: action.payload
            }
        case LOAD_TEAMS_PAGE:
            return {
                ...state,
                teamsPage: action.payload
            }
        case LOAD_ABOUT_US_PAGE:
            return {
                ...state,
                aboutUsPage: action.payload
            }
        case LOAD_IMPACT_PAGE:
            return {
                ...state,
                impactPage: action.payload
            }
        case LOAD_DONATE_PAGE:
            return {
                ...state,
                donatePage: action.payload
            }
        case LOAD_EVENTS_PAGE:
            return {
                ...state,
                eventsPage: action.payload
            }
        case LOAD_MENU:
            return {
                ...state,
                menu: action.payload
            }
        case LOAD_POLICIES:
            return {
                ...state,
                policies: action.payload
            }
        case LOAD_ACTIONS:
            return {
                ...state,
                actions: action.payload
            }
        case LOAD_EVENTS:
            return {
                ...state,
                events: action.payload
            }
        case LOAD_SERVICE_PROVIDERS:
            return {
                ...state,
                serviceProviders: action.payload
            }
        case LOAD_TESTIMONIALS:
            return {
                ...state,
                testimonials: action.payload
            }
        case ADD_TESTIMONIAL:
            return {
                ...state,
                testimonials: [
                    ...state.testimonials,
                    action.payload
                ]
            }
        case REMOVE_TESTIMONIAL:
            return {
                ...state,
                testimonials: state.testimonials.filter(testimonial => testimonial.id !== action.payload.id)
            }
        case LOAD_EVENT_RSVPS:
            return {
                ...state,
                rsvps: action.payload
            }
        case ADD_RSVP:
            return {
                ...state,
                rsvps: [
                    ...state.rsvps,
                    action.payload
                ]
            }
        case REMOVE_RSVP:
            return {
                ...state,
                rsvps: state.rsvps.filter(rsvp => { return rsvp.id !== action.payload.id })
            }
        case CHANGE_RSVP:
            return {
                ...state,
                rsvps:[
                    ...state.rsvps.filter(rsvp => { return rsvp.id !== action.payload.id }),
                    action.payload
                ]
            }
        /**************************/
        default:
            return {
                ...state,
            };
    }
}