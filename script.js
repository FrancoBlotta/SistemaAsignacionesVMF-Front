/*Funcion Logica para manejar el formulario de login*/
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener los valores de email y password del formulario
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    // Crear el cuerpo de la solicitud
    const requestBody = {
        email: email,
        password: password
    };

    // Realizar la solicitud POST al endpoint /usuario/login
    fetch('http://localhost:8080/usuario/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        // Convertir la respuesta a JSON y capturar el estado y datos
        return response.json().then(data => ({
            status: response.status,
            body: data
        }));
    })
    .then(response => {
        // Mostrar la respuesta según el estado recibido
        const responseDiv = document.getElementById('responseLogin');
        if (response.status === 200) {
            //responseDiv.innerHTML = '<p>Inicio de sesión exitoso</p>';
            window.location.href = 'ABM/index.html';
        } else {
            responseDiv.innerHTML = `<p>Error: Usuario/contraseña incorrectos</p>`;
        }
    })
    /*Para las excepciones */
    .catch(error => {
        // Capturar y manejar cualquier error ocurrido durante la solicitud
        const responseDiv = document.getElementById('responseLogin');
        responseDiv.innerHTML = '<p>Error: ' + error.message + '</p>';
    });
});

/*Funcion Logica para el formulario de registro*/
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener los valores de nombre, apellido, email y password del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Crear el cuerpo de la solicitud
    const requestBody = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password
    };
    // Realizar la solicitud POST al endpoint /usuario/registro
    fetch('http://localhost:8080/usuario/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        // Convertir la respuesta a JSON y capturar el estado y datos
        return response.json().then(data => ({
            status: response.status,
            body: data
        }));
    })
    .then(response => {
        console.log(response);
        // Mostrar la respuesta según el estado recibido
        const responseDiv = document.getElementById('responseRegistro');
        if (response.status === 201) {
            responseDiv.innerHTML = '<p>Usuario registrado exitosamente</p>';
        } else {
            // Verificar si el error es específico de la Password, del mail o si el usuario es existente
            let errorMessage;
            if (response.body.password) {
                errorMessage = response.body.password;
            } else if (response.body.email) {
                errorMessage = response.body.email;
            } else if(response.body.message){
                errorMessage = response.body.message
            }
    
            responseDiv.innerHTML = `<p>Error: ${errorMessage}</p>`;
        }
    })
    .catch(error => {
        
        // Capturar y manejar cualquier error ocurrido durante la solicitud
        const responseDiv = document.getElementById('responseRegistro');
        responseDiv.innerHTML = '<p>Error: ' + error.message + '</p>';
    });
});

/* 
  Función para mostrar el formulario de registro cuando se hace clic en "Registrar"
 */
document.getElementById('showRegistro').addEventListener('click', function() {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('registroContainer').classList.remove('hidden');
    document.getElementById('restablecerPasswordContainer').classList.add('hidden');
});

/* 
  Función para mostrar el formulario de login cuando se hace clic en "Volver al Login" desde el registro
 */
document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('loginContainer').classList.remove('hidden');
    document.getElementById('registroContainer').classList.add('hidden');
    document.getElementById('restablecerPasswordContainer').classList.add('hidden');
});

/* 
  Función para mostrar el formulario de Recuperar Password cuando se hace clic en "¿Olvidaste tu contraseña?"
 */
  document.getElementById('showRestablecerPassword').addEventListener('click', function() {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('registroContainer').classList.add('hidden');
    document.getElementById('restablecerPasswordContainer').classList.remove('hidden');
});

/* 
  Función para mostrar el formulario de login cuando se hace clic en "Volver al Login" desde restablecer password
 */
  document.getElementById('showLogin2').addEventListener('click', function() {
    document.getElementById('loginContainer').classList.remove('hidden');
    document.getElementById('registroContainer').classList.add('hidden');
    document.getElementById('restablecerPasswordContainer').classList.add('hidden');
});

/* 
  Función para manejar el evento de "Olvidé mi contraseña"
 */
document.getElementById('restablecerPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();

     // Obtener el valor del email ingresado para restablecer la contraseña
    const email = document.getElementById('restablecerPasswordEmail').value;
    // Verificar si se ingresó un email válido
    if (!email) {
        const responseDiv = document.getElementById('responseRestablecerPassword');
        responseDiv.innerHTML = '<p>Por favor, ingresa tu correo electrónico.</p>';
        return;
    }
    // Realizar la solicitud POST al endpoint /usuario/restablecer-password
    fetch('http://localhost:8080/usuario/restablecer-password?email=' + encodeURIComponent(email), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }
        return response.text(); // Recibir como texto en lugar de JSON
    })
    .then(data => {
        // Mostrar el mensaje de éxito con la nueva contraseña generada
        const responseDiv = document.getElementById('responseRestablecerPassword');
        responseDiv.innerHTML = '<p>' + data + '</p>'; // Mostrar el mensaje directamente
    })
    .catch(error => {
        console.error('Error:', error);
        const responseDiv = document.getElementById('responseRestablecerPassword');
        responseDiv.innerHTML = '<p>Error: ' + error.message + '</p>';
    });
});