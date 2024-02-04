import axios from 'axios'

axios.defaults.url = 'https://countriesnow.space/api/v0.1/countries';

const getCoutries = async () => {
    const url = '/positions';
    return await axios.get(url);
}

const getStates = async (country ) => {
    const url = `/states/q?country=${country}`
    return await axios.get(url);
}

const getCities = async (country,state ) => {
    const url = `/states/cities/q?country=${country}&state=${state}`
    return await axios.get(url);
}

export {getCoutries, getCities, getStates};