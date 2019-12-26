'use strict';
import bcrypt from 'bcrypt';

export const hashPassword = (password) => {

    let hash = bcrypt.hash(password, 10);
    return hash;
};

export const checkPassword = (password, hash) => {

    let result = bcrypt.compare(password, hash);
    return result;
}
