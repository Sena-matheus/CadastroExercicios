if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js') // Ajuste o caminho conforme necessário
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.error('Falha ao registrar o Service Worker:', error);
            });
    });
}

let exerciseActive = false;


document.getElementById('startExercise').addEventListener('click', () => {
    exerciseActive = true;
    document.getElementById('output').innerText = "Exercício iniciado!";
});


document.getElementById('takePhoto').addEventListener('click', async () => {
    if (exerciseActive) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        video.addEventListener('loadeddata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png');

            
            const img = document.createElement('img');
            img.src = imageData;
            img.className = 'captured-image'; 

            
            document.getElementById('output').appendChild(img);

            stream.getTracks().forEach(track => track.stop());
            video.remove();
        });
    } else {
        alert("Inicie um exercício primeiro!");
    }
});


document.getElementById('getLocation').addEventListener('click', () => {
    if (exerciseActive) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                document.getElementById('output').innerText = `Localização obtida: Latitude: ${latitude}, Longitude: ${longitude}`;
            }, (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        document.getElementById('output').innerText = "Permissão negada para acessar a localização.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        document.getElementById('output').innerText = "Localização indisponível.";
                        break;
                    case error.TIMEOUT:
                        document.getElementById('output').innerText = "A solicitação de localização excedeu o tempo limite.";
                        break;
                    case error.UNKNOWN_ERROR:
                        document.getElementById('output').innerText = "Um erro desconhecido ocorreu.";
                        break;
                }
            });
        } else {
            document.getElementById('output').innerText = "Geolocalização não é suportada por este navegador.";
        }
    } else {
        alert("Inicie um exercício primeiro!");
    }
});
