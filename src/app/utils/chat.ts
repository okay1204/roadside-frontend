// Make request to the server
export async function chat(session_id: string, text: string) {
    let data = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        body: JSON.stringify({ session_id, message: text }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let json = await data.json();

    // Play json.tts_url audio
    let audio = new Audio(json.tts_url);
    audio.play();

    // Return json
    return json;
};