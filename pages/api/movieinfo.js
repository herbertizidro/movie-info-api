import Cors from 'cors';

/* pega a url do trailer ou de um vídeo relacionado(making of por exemplo) */
const movieTrailer = require('movie-trailer');

const OMDBAPIKEY = "a7d879d7";

const cors = Cors({
	methods: ['GET'],
})

// configura o cors para o endpoint da api
function middlewareCors(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if(result instanceof Error) return reject(result)
			return resolve(result)
		})
	})
}

async function MovieInfoAPI(req, res) {
		
	if(req.method === 'GET'){
		await middlewareCors(req, res, cors);
		try{
			const userSearch = req.query.search;
			const url = `https://www.omdbapi.com/?apikey=${OMDBAPIKEY}&t=${userSearch}&plot=full`;
			const response = await fetch(url);
			const json = await response.json();
			let trailer = '';
	
			if(json["Title"].length){
				trailer = await movieTrailer(json["Title"], json["Year"]);
			}
			
			json["Trailer"] = trailer;
			res.status(200).json({ ...json });
		}catch(e){		
			res.status(500).json({ Response: "False", Message: `MovieInfoAPIError - 
				An internal error has ocurred: ` + e.message + "" });
		}
	}else{
		return
	}
	
}

export default MovieInfoAPI
