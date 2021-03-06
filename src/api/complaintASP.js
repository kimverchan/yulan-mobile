import { get, post, patch, put } from './httpASP'

//查询满足相应条件的当前用户的投诉信息
export function GetAllComplaint(data, config = {}) {
    return post('/Complaint/GetAllComplaint', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}

//查看投诉单详情
export function CheckDetailByID(data, config = {}) {
    return post('/Complaint/CheckDetailByID', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}

//提交投诉单
export function addSubmit(data, config = {}) {
    return post('/Complaint/AddRecord', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}

//修改投诉单
export function editSubmit(data, config = {}) {
    return post('/Complaint/EditRecord', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}

//根据用户id查找各种单号
export function QueryNoById(data, config = {}) {
    return post('/Complaint/QueryNoById', data, config).then((res) => {
        return Promise.resolve(res);
    }).catch((err) => {
        return Promise.reject(err);
    })
}