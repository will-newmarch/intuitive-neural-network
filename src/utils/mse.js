/**
 * Calculate the Mean Squared Error of an array of errors
 * @param {Number} errors 
 */
function mse(errors) {
    
    let sum = 0;
    
    for (let index = 0, len = errors.length; index < len; index++) {
    
        sum += errors[index] * errors[index];
    
    }
    
    return sum / errors.length;
}

module.exports = mse;