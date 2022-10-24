import storageApi from "../../api/storageApi";

export function getNoAmigos(user) {
    return storageApi.post('amigos/getNoAmigos', user)
}

export function getEnviadas(user) {
    return storageApi.post('amigos/getEnviadas', user)
}

export function getRecibidas(user) {
    return storageApi.post('amigos/getRecibidas', user)
}

export function getAmigos(user) {
    return storageApi.post('amigos/getAmigos', user)
}

export function enviarSolicitud(usuario, destino) {
    return storageApi.post('amigos/enviarSolicitud', { usuario: usuario, destino: destino })
}

export function aceptarSolicitud(usuario, destino) {
    return storageApi.post('amigos/aceptarSolicitud', { usuario: usuario, destino: destino })
}

export function eliminarAmistad(usuario, destino) {
    return storageApi.post('amigos/eliminarAmistad', { usuario: usuario, destino: destino })
}

