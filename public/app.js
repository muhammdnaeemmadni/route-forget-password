function signup() {
    axios({
        method: 'post',
        url: 'http://localhost:3000/signup',
        data: {
            name: document.getElementById('names').value,
            email: document.getElementById('emails').value,
            password: document.getElementById('passwords').value,
            phone: document.getElementById('numbers').value,
            gender: document.getElementById('gender').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
          window.location.href = "./login.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false;
}

function loginForm() {
    axios({
        method: 'post',
        url: "http://localhost:3000/login",
        data: {
            email: document.getElementById("logemail").value,
            password: document.getElementById("loginpass").value,
        },
        withCredentials: true
    }).then((response) => {
        if(response.data.status === 200){
            console.log(response.data.message);
            alert(response.data.message);
            window.location.href = "./profile.html"
            return
        }else{
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false;
}


function getProfile() {
    axios: ({
        method: "get",
        url: "http://localhost:3000/profile",
        credentials: "include",
    }).then((response) => {
        console.log(response.data.profile.name);
        document.getElementById("username").value = response.data.profile.name
        document.getElementById("email").value = response.data.profile.email
        document.getElementById("number").value = response.data.profile.number
        document.getElementById("gender").value = response.data.profile.gender
    }, (error) => {
        console.log(error.message);
        location.href = "signin.html"
    })
    return false;
}

function logout() {
    axios({
        method: 'post',
        url: 'http://localhost:3000/logout',
    }).then((response) => {
        console.log(response);
        location.href = "signin.html"
    }, (error) => {
        console.log(error);
    });
    return false;
}
