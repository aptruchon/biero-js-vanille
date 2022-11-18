class Async {
    
    get = async (ressource) => {
        try{
            let response = await fetch(ressource);
            if(response.ok) {
                const contentType = response.headers.get("Content-type");
                if(contentType && contentType.indexOf("application/json") != -1) return response.json();
                else return response.text();
            }
            else throw new Error("La réponse n'est pas ok.")
        }
        catch(error) {
            return error.message;
        }
    }
}

export const { get } = new Async();