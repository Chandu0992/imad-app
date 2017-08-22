var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                alert('Logged in Sucessfully');
            }else if(request.status === 403)
            alert('Username/password is incorrect !');
        }else if(request.status === 500){
            alert('Something went wrong on the server')
        }
    }
};

