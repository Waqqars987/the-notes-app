'use strict';
export const isFieldAcceptable = (fieldName, fieldValue) => {

    if (typeof fieldValue === "undefined") {
        throw new Error("Missing Value for " + fieldName);
    }
    else if (fieldValue === "") {
        throw new Error("Value cannot be Empty for " + fieldName);
    }
    else if (fieldValue < 0) {
        throw new Error("Value cannot be Negative for " + fieldName);
    }
    else if (fieldValue === null) {
        throw new Error("Null Value provided for " + fieldName);
    }
    return fieldValue;
};