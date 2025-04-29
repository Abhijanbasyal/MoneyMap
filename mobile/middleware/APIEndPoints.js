// const SERVER_DOMAIN = "http://192.168.1.88:8000/api" //hostel_4/5 Wifi
const SERVER_DOMAIN = "http://192.168.80.41:8000/api" //wifi others



console.log("Server Domain:", SERVER_DOMAIN);

const APIEndPoints = {
    sign_in: {
        url: `${SERVER_DOMAIN}/users/login`,
        method: 'post'
    },
    sign_up: {
        url: `${SERVER_DOMAIN}/users/register`,
        method: 'POST'
    },
    logOutUser: {
        url: `${SERVER_DOMAIN}/users/logout`,
        method: 'POST'

    },
    update_user: {
        url: `${SERVER_DOMAIN}/users`,
        method: 'PUT'
    },
    delete_user:{
        url: `${SERVER_DOMAIN}/users`,
        method: 'DELETE'
    }
}

export default APIEndPoints;