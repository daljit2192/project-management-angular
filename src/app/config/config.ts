export var apiBaseUrl = 'http://localhost:8000';
// export var apiBaseUrl = 'http://api.uimatic.com';
export var apiRoutes = {
    user: {
        addNewUser: apiBaseUrl + "/api/user",
        updateUser: apiBaseUrl + "/api/user/update",
        updateUserPassword: apiBaseUrl + "/api/user/update/password",
        loginUser: apiBaseUrl + "/api/login",
        getSingleUser: apiBaseUrl + "/api/user/get"
    },
    project: {
        addProject: apiBaseUrl + "/api/project",
        getProjects: apiBaseUrl + "/api/projects"
    }
}    