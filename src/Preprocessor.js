class Preprocessor {
	
	/**
	 * Normalises each row of a 2 dimensional array of numbers to between -0.5 and 0.5
	 * @param {array} data 
	 * @returns {array}
	 */
	static normalise(data) {
		let normalisedData = [];
		for (var r = 0; r < this.data.length; r++) {
			let row = this.data[r];
			let rowMin = Math.min(...row.map(c => c));
			let rowMax = Math.max(...row.map(c => c));
			let normalisedRow = [];
			for (var c = 0; c < row.length; c++) {
				let normalisedCell = (this.data[r][c] - rowMin) / (rowMax - rowMin);
				normalisedRow.push(normalisedCell - 0.5); // Mean of 0
			}
			normalisedData.push(normalisedRow);
		}
		return normalisedData;
	}
};

module.exports = Preprocessor;