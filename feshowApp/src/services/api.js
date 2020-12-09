import axios from 'axios';

export default api = axios.create({
    baseURL: 'http://localhost:3001'
});

export const apiIbge = axios.create({
    baseURL: 'http://servicodados.ibge.gov.br/api/v1/localidades/estados'
});

export const apiCep = axios.create();
