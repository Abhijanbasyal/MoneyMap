const SERVER_DOMAIN = "http://192.168.80.41:8000/api" //hostel_4/5 Wifi



console.log("Server Domain:", SERVER_DOMAIN);

const APIEndPoints = {
    sign_in: {
        url: `${SERVER_DOMAIN}/users/login`,
        method: 'post'
    },
    get_subjects: {
        url: `${SERVER_DOMAIN}/subjects/all`,
        method: 'GET'
    },
}

export default APIEndPoints;