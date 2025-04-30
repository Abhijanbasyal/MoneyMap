// const SERVER_DOMAIN = "http://192.168.1.88:8000/api" //hostel_4/5 Wifi
const SERVER_DOMAIN = "http://192.168.100.78:8000/api" //hostel_4/5 Wifi
// const SERVER_DOMAIN = "http://192.168.80.41:8000/api" //wifi others



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
    },
    getCategories: {
        url: `${SERVER_DOMAIN}/categories`,
        method: 'GET'
    },
    createCategory: {
        url: `${SERVER_DOMAIN}/categories`,
        method: 'POST'
    },
    updateCategory: {
        url: `${SERVER_DOMAIN}/categories`,
        method: 'PUT'
    },
    deleteCategory: {
        url: `${SERVER_DOMAIN}/categories`,
        method: 'DELETE'
    },
    permanentDeleteCategory: {
        url: `${SERVER_DOMAIN}/categories/permanent`,
        method: 'DELETE'
    },
    restoreCategory: {
        url: `${SERVER_DOMAIN}/categories/restore`,
        method: 'PATCH'
    },
    restoreAllCategories: {
        url: `${SERVER_DOMAIN}/categories/restore-all`,
        method: 'PATCH'
    },
    getDeletedCategories: {
        url: `${SERVER_DOMAIN}/categories/deleted`,
        method: 'GET'
    }
}

export default APIEndPoints;