// Defining CONSTANTS object for manipulation...
const CONSTANTS = {
    URL: {
       // ROOT: "http://api.massenergize.org"
        ROOT: "http://localhost:8000"
    }
}

// ...and dependence on other defined constants
CONSTANTS.URL["USER"] = CONSTANTS.URL.ROOT + "/user/";
CONSTANTS.URL["ACTIONS"] = CONSTANTS.URL.USER + "actions";
CONSTANTS.URL["MENU"] = CONSTANTS.URL.USER + "menu"

export default CONSTANTS;