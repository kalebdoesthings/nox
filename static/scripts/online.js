 const socket = io();
    
    socket.on('connect', () => {
        console.log('Connected to server');
    });
    
    socket.on('user_online', (data) => {
        console.log(data.uid + ' is online');
    });
    
    socket.on('user_offline', (data) => {
        console.log(data.uid + ' went offline');
    })