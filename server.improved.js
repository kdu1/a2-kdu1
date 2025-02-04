const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      console.log(data)
      dataString += data 
  })

  request.on( 'end', function() {
    let newItem = JSON.parse( dataString )
    if(!newItem.listItem || !newItem.dueDate || !newItem.priority){
    }
    else if(newItem.del === true){
        remove(appdata)
    }
    else{
        appdata.push(newItem)
        if(newItem.priority === "high"){
            if(getMin(appdata) === parseInt(newItem.dueDate)){
                newItem.urgent = 1
            }
        }
    }

    console.log( newItem )
    
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.write(JSON.stringify(appdata))
    response.end()
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

//gets soonest dated task that has high priority
const getMin = function(array){
    let date = 10000;
    let indexPrev = [];
    for(let i = 0; i < array.length; i++){
        curDate = parseInt(array[i].dueDate)
        curPrior = array[i].priority
        if(curDate < date){
            if(curPrior === "high"){
                if(indexPrev.length > 0){
                    for(let j = 0; j < indexPrev.length; j++){
                        array[indexPrev[j]].urgent = 0
                    }
                    indexPrev = []
                }
                date = curDate
                indexPrev.push(i)
            }
        }
        else if(curDate === date){
            if(curPrior === "high"){
                indexPrev.push(i)
            }
        }
        console.log("indexPrev")
        console.log(indexPrev)
    }
    console.log("date")
    console.log(date)
    return date
}

const remove = function(array){
    const index = 0
    if(index > -1){
        array.splice(index, 1)
    }
}

server.listen( process.env.PORT || port )
