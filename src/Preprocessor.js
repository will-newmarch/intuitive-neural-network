class Preprocessor {
	
	/**
	 * Normalises each row of a 2 dimensional array of numbers to between -0.5 and 0.5
	 * @param {array} data 
	 * @param {array} offset 
	 * @returns {array}
	 */
	static normalise(data,offset = 0.5) {
		let normalisedData = [];
		for (var r = 0; r < data.length; r++) {
			let row = data[r];
			let rowMin = Math.min(...row.map(c => c));
			let rowMax = Math.max(...row.map(c => c));
			let normalisedRow = [];
			for (var c = 0; c < row.length; c++) {
				let normalisedCell = (data[r][c] - rowMin) / (rowMax - rowMin);
				normalisedRow.push(normalisedCell - offset); // Mean of 0
			}
			normalisedData.push(normalisedRow);
		}
		return normalisedData;
	}
};

module.exports = Preprocessor;