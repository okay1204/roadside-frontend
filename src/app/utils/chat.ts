// Make request to the server
export async function chat(session_id: string, text: string) {
    console.log('SEND CHAT')
    let data = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        body: JSON.stringify({session_id, message: text }),
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',  // Include this line
        credentials: 'include'  // Include this line
        // mode: 'no-cors',  // Set mode to 'no-cors'
        // credentials: 'same-origin',  // You might need to adjust this based on your needs
    })

    console.log(data)
    if (data.headers.get('Access-Control-Allow-Origin')) {
        console.log('The header is present.');
      } else {
        console.log('The header is not present.');
      }

    let json = await data.json();
    console.log('RECIEVE CHAT')

    // Play json.tts_url audio
    let audio = new Audio(json.tts_url);
    console.log(audio)
    audio.play();

    // Return json
    return json;
};