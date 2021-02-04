const to = require('await-to-js').to;
const axios = require('axios');
const jwt_decode = require("jwt-decode").default;
// import $ from 'jquery'
// const jquery = require('jquery')
// import 'whatwg-fetch'
const cryptoRandomString = require('crypto-random-string');

// const Events = require("./EventEmitter")
// import $ from 'jquery'
const Events = require("./EventEmitter").default;



console.log(Events)

class _authHelpers extends Events {
    settings = {}
    constructor() {
        super()
    }
    setSettings = (values) => {
        for (let key in values) {
            let value = values[key]
            this.settings[key] = value
        }
    }
    /**
     * setToken
     * @param {Object} tokenData 
     */
    setToken = (tokenData) => {
        let token = tokenData.token;
        let refreshToken = tokenData.refreshToken;
        window.localStorage.setItem("tbTokenGSAC", token);
        window.localStorage.setItem("tbRefreshTokenGSAC", refreshToken);
        return;
    }
    /**
     * logout
     */
    logout = () => {
        window.localStorage.removeItem("tbTokenGSAC");
        window.localStorage.removeItem("tbRefreshTokenGSAC");
        this.jwt_token = null
        return;
    }
    login = async (params) => {
        return new Promise(async (resolve, reject) => {
            let url = `${this.settings.TBURL}/auth/login`
            let [err, care] = await to(axios.post(url, params));
            if (err) return reject(err);
            return resolve(care.data)
        })
    }
    getToken = async (token, refreshToken) => {
        return new Promise(async (resolve, reject) => {
            // let scheme = window.location.href.split(':')[0];
            // let url = `${scheme}://` + window.location.host + '/api/auth/token';
            let url = `${this.settings.TBURL}/auth/token`
            let [err, care] = await to(axios.post(url, { refreshToken: refreshToken }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': 'Bearer ' + refreshToken
                }
            }));
            if (err) {
                return reject(err);
            }
            return resolve(care.data);
        });
    };

    isLoggedIn = async () => {
        return new Promise(async (resolve, reject) => {
            let jwt_token = localStorage.getItem('tbTokenGSAC');
            if (!jwt_token) {
                return reject('missing token');
            }
            let decoded = jwt_decode(jwt_token);
            console.log(decoded)
            this.userId = decoded.userId
            this.jwt_token = jwt_token
            let tokenExpiry = decoded.exp; //localStorage.getItem('jwt_token_expiration');
            if (!tokenExpiry) {
                return reject('missing token expiry');
            }
            let refresh_token = localStorage.getItem('tbRefreshTokenGSAC');
            tokenExpiry = parseInt(tokenExpiry);
            if (new Date().getTime() > tokenExpiry || true) {
                let [err, care] = await to(this.getToken(jwt_token, refresh_token));
                if (err) {
                    return reject('could not find token');
                }
                this.setToken(care)
                jwt_token = care.token;
            }
            return resolve(jwt_token);
        });
    };

    fetchRoles = async () => {
        return new Promise(async (resolve, reject) => {
            let [err, care] = await to(this.sendSaveTeletry({ "type": "roles", "action": "get" }))
            if (err) {
                return reject(err);
            }
            resolve(care)
        })
    }
    fetchProjects = async () => {
        return new Promise(async (resolve, reject) => {
            let [err, care] = await to(this.sendSaveTeletry({ "type": "projects", "action": "get" }))
            if (err) {
                return reject(err);
            }
            resolve(care)
        })
    }
    whoAmI = async () => {
        return new Promise(async (resolve, reject) => {
            let [err, care] = await to(this.readUserData());
            console.log('WHOAMI')
            if (err) return reject(err);
            resolve(care)
        });
    }
    fetchUsers = async () => {
        return new Promise(async (resolve, reject) => {
            let [err, care] = await to(this.whoAmI())
            if (err) return reject(err);
            let authority = care.authority;
            let customerId;
            if (authority === 'TENANT_ADMIN') {
                let url = `${this.settings.TBURL}/tenant/customers?customerTitle=GS Publications`
                    ;[err, care] = await to(axios.get(url, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Authorization': 'Bearer ' + this.jwt_token
                        }
                    }));
                if (err) return reject(err);
                customerId = care.data.id.id;

            } else {

                console.log("i am a customer....")
                console.log(care)
                customerId = care.customerId.id;
            }
            console.log("CUSTOMER ID", customerId)
                ;[err, care] = await to(this.sendSaveTeletry({ "type": "users", "action": "get", "customerId": customerId }));


            if (err) return reject(err.msg || err);
            // console.log(care)
            resolve(care)
            // let [err, care] = await to(this.sendSaveTeletry({ "type": "customer", "action": "get" }));
            // // https://demo.thingsboard.io/api/customer/f3bbd0c0-6585-11eb-abf1-db171cd9ed33/users?pageSize=10&page=0&sortProperty=createdTime&sortOrder=DESC
            // [err, care] = await to(axios.get())
            // if (err) {
            //     return reject(err);
            // }
            // resolve(care)
        })
    }
    createRole = async (role) => {
        return new Promise(async (resolve, reject) => {
            let [err, care] = await to(this.sendSaveTeletry({ "type": "roles", "action": "create", "role": role }))
            if (err) {
                return reject(err);
            }
            resolve(care)
        })
    }
    createUser = async (userParams, dontWait) => {
        let { user, firstName, lastName, password } = userParams;
        console.log('PPPPPPPPPPPPPPPPPPPPp')
        return new Promise(async (resolve, reject) => {
            console.log('step1...')
            let [err, care] = await to(this.sendSaveTeletry({ "type": "users", "action": "create", "user": user, firstName, lastName, password }, dontWait))
            if (err) {
                console.log('REJECTED========')
                console.log(err)
                return reject(err);
            }
            if (dontWait) {
                console.log('NEVER WAITING')
                    ;[err, care] = await to(this.checkSuccessfulCreateUser(user, password))
                if (err) {
                    return reject(err)
                }
                resolve(care)
            } else {
                console.log('result from creating user')
                let userData = JSON.parse(JSON.stringify(care));
                console.log(care)
                if (Object.keys(care).length === 0) {
                    [err, care] = await to(this.login({ username: user, password }))
                    if (err) {
                        return reject('Registration failed. Please try submitting the form again')
                    }
                    resolve({})
                } else {
                    resolve(userData)
                }
            }
        })
    }
    checkSuccessfulCreateUser = async (user, password) => {
        return new Promise(async (resolve, reject) => {
            let beginLongWaitAt = new Date().getTime();;
            console.log('starting for sure...')
            const getResponse = async () => {
                console.log('here.....')
                let listener = cryptoRandomString({ length: 20, type: 'url-safe' });
                this.once(listener, getResponse);
                return new Promise(async (resolve1, reject1) => {
                    let [err, care] = await to(this.login({ username: user, password }));
                    if (err) {
                        console.log(err.data)
                        let now = new Date().getTime();
                        let timeDiff = now - beginLongWaitAt;
                        if (timeDiff <= 10000) { // 1 minute
                            this.emit(listener);
                        } else {
                            this.removeListener(listener, getResponse)
                            reject(`Error creating account. Probably ${user} already exists`)
                            reject1('Timed out')
                        }
                    }
                    if (care === undefined) {
                        let now = new Date().getTime();
                        let timeDiff = now - beginLongWaitAt;
                        if (timeDiff <= 10000) { // 1 minute
                            this.emit(listener);
                        } else {
                            this.removeListener(listener, getResponse)
                            reject('Error creating account. Probably ${user} already exists')
                            reject1('Timed out')
                        }
                    } else {
                        console.log(care)
                        this.removeListener(listener, getResponse)
                        resolve1(care.data)
                        return resolve(care.data)
                    }


                })
            }
            await to(getResponse())
        })
    }
    deleteUser = async (userId) => {
        return new Promise(async (resolve, reject) => {
            console.log('STARGINT TO DELETE')
            let [err, care] = await to(this.sendSaveTeletry({ "type": "users", "action": "delete", "user": userId }))
            if (err) {
                console.log('REJECTED========')
                console.log(err)
                return reject(err);
            }
            let userData = JSON.parse(JSON.stringify(care));
            console.log(care)
            resolve(userData)
        })
    }
    getActivationLink = async (userId, token) => {
        return new Promise(async (resolve, reject) => {
            let url = `${this.settings.TBURL}/user/${userId}/activationLink`
            let [err, care] = await to(axios.get(`${this.settings.JSONPROXY}?path=${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': 'Bearer ' + token
                }
            }));
            if (err) {
                return reject(err);
            }
            resolve(care.data)
        })
    }
    createProject = async (project) => {
        return new Promise(async (resolve, reject) => {
            let [err, care] = await to(this.sendSaveTeletry({ "type": "projects", "action": "create", "project": project }))
            console.log('adhkjashdkhasdk')
            if (err) {
                return reject(err);
            }
            console.log('RETURNED...')
            console.log(care)
            resolve(care)
        })
    }
    deleteRole = async (role) => {
        return new Promise(async (resolve, reject) => {
            let [err, care] = await to(this.sendSaveTeletry({ "type": "roles", "action": "delete", "role": role }))
            if (err) {
                return reject(err);
            }
            resolve(care)
        })
    }
    deleteProject = async (project) => {
        return new Promise(async (resolve, reject) => {
            let [err, care] = await to(this.sendSaveTeletry({ "type": "projects", "action": "delete", "project": project }))
            if (err) {
                return reject(err);
            }
            resolve(care)
        })
    }
    readUserData = async () => {
        return new Promise(async (resolve, reject) => {
            let url = `${this.settings.TBURL}/auth/user`
            let [err, care] = await to(axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': 'Bearer ' + this.jwt_token
                }
            }));
            if (err) {
                return reject(err)
            }
            return resolve(care.data)
        })
    }

    /**
     * save telemetry
     */
    sendSaveTeletry = async (data, dontWait = false) => {
        if (!data.userId) {
            data.userId = this.userId
        }
        if (!data.jwt_token) {
            if (this.jwt_token)
                data.jwt_token = this.jwt_token
        }
        if (!data.rqId) {
            data.rqId = cryptoRandomString({ length: 20, type: 'url-safe' });
        }
        // let dontWait = data.dontWait;
        // delete data.dontWait
        console.log("step2")
        console.log({ data })
        return new Promise(async (resolve, reject) => {
            let publicToken = this.settings.PUBLIC_DEVICE_ACCESS_TOKEN
            console.log(this.settings)
            let proxyUrl = this.settings.CORS_PROXY
            let url = `${this.settings.TBURL}/v1/${publicToken}/telemetry`
            console.log(data)
            let [err, care] = await to(axios.post(`${proxyUrl}/${url}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }))
            console.log('ERRED......')
            console.log(err)
            console.log(care)
            if (err) return reject(err);
            if (dontWait) {
                console.log('NO WAITING..')
                return resolve(true);
            }
            let rqId = data.rqId;
            let wait, repeat;
            let numRequests = 0;
            // if(dontWait){

            // }
            // make this even driven
            let beginLongWaitAt = new Date().getTime();
            const getResponse = async () => {
                return new Promise(async (resolve1, reject1) => {
                    let [err, care] = await to(this.readUserData());
                    let listener = cryptoRandomString({ length: 20, type: 'url-safe' });
                    this.once(listener, getResponse);
                    if (err) {
                        console.log(err.status)
                        console.log(err.response.data.status)
                        console.log(err.data)

                        console.log(err)
                        this.removeListener(listener, getResponse)
                        if (err.response.data.status === 401) {   // anuthorized
                            console.log('---------160')
                            resolve1({})
                            resolve({})
                        } else {
                            // clearTimeout(wait);
                            // clearInterval(repeat);
                            console.log('---------1601')
                            reject1(err)
                            reject(err);
                        }
                    } else if (care.additionalInfo === undefined) {
                        reject('Unknown error occured')
                        reject1('Unknown error occured')
                    } else {
                        let responses = care.additionalInfo.responses;
                        if (responses && responses[rqId]) {
                            console.log('---------167')
                            let response = responses[rqId];
                            console.log(response)
                            if (!response.msg.error) {
                                console.log('returned....')
                                console.log(response.msg);
                                resolve(response.msg);
                                resolve1(true)
                                console.log('after resolve.....')
                                this.removeListener(listener, getResponse)
                                return resolve(response.msg);
                            } else {
                                this.removeListener(listener, getResponse)
                                reject1(response.msg.error)
                                return reject(response.msg.error);
                            }
                        } else {
                            let now = new Date().getTime();
                            let timeDiff = now - beginLongWaitAt;
                            if (timeDiff <= 120000) {
                                console.log(timeDiff, rqId)
                                this.emit(listener);
                            } else {
                                this.removeListener(listener, getResponse)
                                reject('timed out')
                                reject1('timed out')
                            }
                        }
                    }
                })
            }
            await to(getResponse())
            // let [err, care] = await to(this.readUserData());

            // repeat = setInterval(async () => {
            //     let [err, care] = await to(this.readUserData());
            //     if (err) {
            //         console.log('---------160')
            //         clearTimeout(wait);
            //         clearInterval(repeat);
            //         return reject(err);
            //     }
            //     let responses = care.additionalInfo.responses;
            //     if (responses[rqId]) {
            //         console.log('---------167')
            //         clearTimeout(wait);
            //         clearInterval(repeat);
            //         let response = responses[rqId];
            //         console.log(response)
            //         if (!response.msg.error) {
            //             return resolve(response.msg);
            //         } else {
            //             return reject(response.msg.error);
            //         }
            //     }

            // }, 500);
            // wait = setTimeout(() => {// wait to a minute
            //     clearInterval(repeat);
            //     console.log('---------------123')
            //     return reject('request timed out')
            // }, 6000)
            // return resolve(data.rqId)
        })
    };

}

const authHelpers = new _authHelpers()

export default authHelpers
// module.exports = authHelpers
