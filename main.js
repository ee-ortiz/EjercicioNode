// correr el archivo con el comando node main.js
// antes de correr el programa note que los htmls están sin la información de clientes y proveedores

// Utilizar los siguientes links para probar el programa: http://localhost:8081/api/proveedores, http://localhost:8081/api/clientes

const http = require('http');
const fs = require('fs');
const axios = require('axios');

// una lista que contiene objetos sobre cada uno de los datos de los clientes
let listaClientes = [];

// una lista que contiene objetos sobre cada uno de los datos de los proveedores
let listaProveedores = [];

// string html de que se mostrará de los clientes
let clientesHtml;

// string html de que se mostrará de los clientes
let proveedoresHtml;

// obtener proveedores mediante axios
promesa1 = axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json')
.then((response) => {
    listaProveedores = response.data; // response.data ya devuelve un objeto javascript tipo lista
})

// obtener clientes
promesa2 = axios.get('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json')
.then((response) => {
    listaClientes = response.data; // response.data ya devuelve un objeto javascript tipo lista
})

// una lista que contiene todos los clientes solo con la información relevante a mostrar en el html
var listaClientesAMostrar = [];

// una lista que contiene todos los proveedores solo con la información relevante a mostrar en el html
var listaProveedoresAMostrar = [];

// cuando se logran objeter y guardar ambos json con Axios
promesa3 = Promise.all([promesa1, promesa2]).then(() =>{
    
    // lista de datos relevantes de los clientes
    let datosClientesAMostrar = JSON.parse(datosRelevantesClientes(listaClientes));
    // lista de datos relevantes de los proveedores
    let datosProveedoresAMostrar = JSON.parse(datosRelevantesProveedores(listaProveedores));

    // se abre el html de clientes que aun no tiene las rows de todos los clientes
    fs.readFile("clientes.html", 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        // recorro el arreglo de clientes y obtengo el formato html que hay que agregar
        // para modificar el contenido de la página html
        let bloqueDatosClientes = "";
        datosClientesAMostrar.forEach((cliente, index) =>{
            
            let bloqueHtml = stringRowsHtmlCliente(cliente);
            bloqueDatosClientes+= bloqueHtml;
        })

        // String html actualizado
        let result = data.replace("CONTENIDO A CAMBIAR", bloqueDatosClientes);  
        clientesHtml = result;     
        
    });

    fs.readFile("proveedores.html", 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        // recorro el arreglo de clientes y obtengo el formato html que hay que agregar
        // para modificar el contenido de la página html
        let bloqueDatosProveedores = "";
        datosProveedoresAMostrar.forEach((proveedor, index) =>{
            
            let bloqueHtml = stringRowsHtmlProveedor(proveedor);
            bloqueDatosProveedores+= bloqueHtml;
        })

        // String html actualizado
        let result = data.replace("CONTENIDO A CAMBIAR", bloqueDatosProveedores);      
        
        proveedoresHtml = result;
    });

})

function datosRelevantesClientes(arrayClientes){
    
    let arrayRespuesta = [];
    arrayClientes.forEach((cliente) =>{
        
        const nuevoCliente = {}
        nuevoCliente.idCliente = cliente.idCliente;
        nuevoCliente.NombreCompania = cliente.NombreCompania;
        nuevoCliente.NombreContacto = cliente.NombreContacto;
        arrayRespuesta.push(nuevoCliente);

    } )
    // acá ya el array de clientes está finalizado con todos los datos relevantes
    // se convierten los datos de la lista a formato JSON y se vuelve un string
    return JSON.stringify(arrayRespuesta, null, "\t"); // Indented with tab

}

function datosRelevantesProveedores(arrayProveedores){
    
    let arrayRespuesta = [];
    arrayProveedores.forEach((proveedor) =>{
        
        const nuevoProveedor = {}
        nuevoProveedor.idproveedor = proveedor.idproveedor;
        nuevoProveedor.nombrecompania = proveedor.nombrecompania;
        nuevoProveedor.nombrecontacto = proveedor.nombrecontacto;
        arrayRespuesta.push(nuevoProveedor);

    } )
    // acá ya el array de proveedores está finalizado con todos los datos relevantes
    // se convierten los datos de la lista a formato JSON y se vuelve un string
    return JSON.stringify(arrayRespuesta, null, "\t"); // Indented with tab

}

// recibe por parametro un cliente y vuelve sus atributos a un formato de row en html
function stringRowsHtmlCliente(cliente){
    let respuesta = "<tr>\n";
    respuesta += "<td>" + cliente.idCliente + "</td>\n";
    respuesta += "<td>" + cliente.NombreCompania + "</td>\n";
    respuesta += "<td>" + cliente.NombreContacto + "</td>\n";
    respuesta += "</tr>"
    return respuesta;

}
// recibe por parametro un proveedor y vuelve sus atributos a un formato de row en html
function stringRowsHtmlProveedor(proveedor){
    let respuesta = "<tr>\n";
    respuesta += "<td>" + proveedor.idproveedor + "</td>\n";
    respuesta += "<td>" + proveedor.nombrecompania + "</td>\n";
    respuesta += "<td>" + proveedor.nombrecontacto + "</td>\n";
    respuesta += "</tr>\n";
    return respuesta;

}

// ahora finalmente creo el servidor
const server = http.createServer((req, res) =>{
    // defino las urls del server
    if(req.url === '/'){
        res.write("Página pricipal, visita: /proveedores y /clientes para obtener la información que buscas");
    }
    if(req.url === '/api'){
        res.write("Página pricipal, visita: /proveedores y /clientes para obtener la información que buscas");
    }
    if(req.url === '/api/proveedores'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(proveedoresHtml);
    }
    if(req.url === '/api/clientes'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(clientesHtml);
    }
    res.end();
});

server.on("connection", (socket) =>{
    console.log("Nueva conexión en el server");
})

// el servidor esucha en puerto 8081
server.listen(8081)

