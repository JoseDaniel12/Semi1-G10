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

export function enviarSolicitud(user) {
    return storageApi.post('amigos/enviarSolicitud', user)
}

export function rechazarSolicitud(user) {
    return storageApi.post('amigos/rechazarSolicitud', user)
}

export function aceptarSolicitud(user) {
    return storageApi.post('amigos/aceptarSolicitud', user)
}