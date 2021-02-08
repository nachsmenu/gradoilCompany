var main = (function(){
	var init = function(){		
		setUpListeners();
		setValueInputsAndSelects();
	};

	//----------------------- setUpListeners------------------------------------------------------------------
	var setUpListeners = function() {			
		$("#countForm").click(function(e){
			//e.preventDefault();			
			_serializeForm();
		});			
		$('#mainForm input,select').on('change', _saveValueInputsAndSelects);
		$('.btn-show-itemCount').on('click', _slideCountItem);
	};

	var _serializeForm = function() {
		/* const $data = {};	
		let countLayer, 
		countBoxes = 0; */
		let arrayParties = [];
				
		$('#mainForm').find ('.item-count__content').each(function() {						
			if(!$(this).hasClass('hide')) {
				arrayParties.push($(this));
			} 				
		});	

		$cont = $('#contCount');

		if(arrayParties.length <= 1) {
			_countOneParties(arrayParties[0], $cont);
		} else {
			_countAllParties(arrayParties, $cont);
		}		
	}

	var _saveValueInputsAndSelects = function () {		
		let arrayItems = [];
		let resultArray = [];
						
		$('#mainForm').find('.item-count__content').each(function() {						
		/* 	if(!$(this).hasClass('hide')) {
				arrayItems.push($(this));
			}  */
			arrayItems.push($(this));				
		});	

		for(let i = 0; i < arrayItems.length; i++) {
			let resultObject = {};
			let objectInputs = {};
			let objectSelects = {};	

			if(arrayItems[i].hasClass('hide')) {						
				resultObject['hide'] = true;
			} else {
				resultObject['hide'] = false;
			}

			let inputs = arrayItems[i].find('input');
			for(let i = 0; i < inputs.length; i++) {
				objectInputs[`${inputs[i].name}`] = inputs[i].value;
			}
				
			let selects = arrayItems[i].find('select');
			for(let i = 0; i < selects.length; i++) {
				objectSelects[`${selects[i].name}`] = selects[i].value;
			}			
			resultObject.inputs = objectInputs;
			resultObject.selects = objectSelects;			
			resultArray[i] = resultObject;
		}
		localStorage.setItem("ItemsCount", JSON.stringify(resultArray));		
	}

	var _slideCountItem = function() {		
		if($(this).text() == "Добавить позицию") {
			$(this).text("Удалить позицию");
			$(this).next().removeClass("hide");	
			_saveValueInputsAndSelects();				
		} else {
			$(this).text("Добавить позицию");	
			$(this).next().addClass("hide");
			_saveValueInputsAndSelects();
						
		}
	}

	// End -------------------- setUpListeners------------------------------------------------------------------

	// -------------------------setValueInputsAndSelects------------------------------------------------------------------
	var setValueInputsAndSelects = function() {
		let arrayItems = [];		
						
		$('#mainForm').find('.item-count__content').each(function() {		
			arrayItems.push($(this));						
		});	

		let localData = localStorage.getItem("ItemsCount");
		itemsCount = JSON.parse(localData);
		if(!itemsCount) {
			return false;
		}
		for(let i = 0; i < itemsCount.length; i++) {			
			if(itemsCount[i].hide) {
				if(!arrayItems[i].hasClass('hide')) {
					arrayItems[i].addClass('hide');	
				}							
			} else {
				arrayItems[i].removeClass('hide');
				arrayItems[i].prev().text('Удалить позицию');	
			} 

			let inputs = itemsCount[i].inputs;		
			_setValue(inputs, arrayItems[i], "input");

			let selects = itemsCount[i].selects;
			_setValue(selects, arrayItems[i], "select");		

		}	
	}

/* 	
	var setValueInputsAndSelects = function() {
		var inputs = $('#mainForm').find ('input');		
		inputs.each(function() {			
			$(this).val(_getSavedValue($(this).attr( "name" )));
		})
		var selects = $('#mainForm').find ('select');	
		selects.each(function() {
			$(this).val(_getSavedValue($(this).attr("name")));
		})
	} */

	var _setValue = function (items, curElem, nameElem) {		
		for (key in items) {			
			let selectItem = curElem.find(nameElem + "[name=" + key + "]").eq(0);
			selectItem.val(items[key]);			
		}
	}

	var _getSavedValue = function(v) {
		if (!localStorage.getItem(v)) {
			return "";
		}
		return localStorage.getItem(v);
	}	

	var _saveValue = function(e) {
		var name = e.target.name;
		var val = e.target.value;		
		localStorage.setItem(name, val);
	}

	// End -------------------------setValueInputsAndSelects------------------------------------------------------------------

	// -----------------------------countOneParties-----------------------------------------------------------------

	var _countOneParties = function($elem, $cont) {
		let dataParties = {};
		dataParties = _serializeFormOneParties($elem, $cont);
		console.log(dataParties);  
		if(!dataParties) {
			return false;
		}
		let countBoxes = dataParties["countBottle"]/dataParties["typeBox"]["countBottlesInBox"];
		let sOneBox = parseFloat(((dataParties["typeBox"]["length"]/1000)*(dataParties["typeBox"]["width"]/1000)*(dataParties["typeBox"]["height"]/1000)).toFixed(2));
		let sParties =	sOneBox * countBoxes;		
		let countLeyer = _countLayer(dataParties["countBoxesInRow"], dataParties["containerLength"], dataParties["typeBox"]["length"], countBoxes, 32, 0.7);
		countLeyer.sParties = sParties;
		console.log(countLeyer);

		_showViewParties(countLeyer);

	}

	// End -----------------------------countOneParties-----------------------------------------------------------------

	// -----------------------------countTwoParties--------------------------------------------------------------------

	var _countAllParties = function($elements, $cont) {	
		let arrayParties = [];

		for(let i = 0; i < $elements.length; i++) {
			arrayParties[i] = {};
			arrayParties[i].data = _serializeFormOneParties($elements[i], $cont);
			if(arrayParties[i].data) {
				let partiesData = arrayParties[i].data;
				arrayParties[i].countBoxes = partiesData["countBottle"]/partiesData["typeBox"]["countBottlesInBox"];
				arrayParties[i].countParties = _countSParties(arrayParties[i].data, arrayParties[i].countBoxes);
			} else {
				return false;
			}
			
		}

		let partiesProportion = _countPartiesProportion(arrayParties, arrayParties[0].data["containerWidth"], arrayParties[0].data["containerLength"]);

		for(let i = 0; i < partiesProportion.length; i++) {
			arrayParties[i].data.containerLength = partiesProportion[i];
		}
		
		for(let i = 0; i < arrayParties.length; i++) {
			let curData = arrayParties[i].data;
			arrayParties[i].countLeyer = _countLayer(curData["countBoxesInRow"], curData["containerLength"], curData["typeBox"]["length"], arrayParties[i].countBoxes, 31, 0.1);
		}
		console.log(arrayParties);
		_showViewAllParties(arrayParties);

	}

	// End-----------------------------countTwoParties-----------------------------------------------------------------

	// _serializeFormOneParties

	var _serializeFormOneParties = function($elem, $cont){	

		const $data = {};	
		let countLayer, 
		countBoxes = 0;

		_getValueInputs($cont, $data);
		_getValueInputs($elem, $data);

		$elem.find ('select option:selected').each(function() {			
			let elemName = $(this).parent().closest( "select" ).attr("name");
			$data[elemName] = {};
			let elemData = $(this).data();
			for (var key in elemData) {
				$data[elemName][key] = elemData[key];			    
			}			
		});	
		console.log($data);
		let isValidForm = true;
		for (key in $data) {
			if($data[key] == 0) {
				isValidForm = false;
			}
		}
		if(isValidForm) {
			return $data; 
		} else {
			console.log('valid');
			_showError();
			return false;
			
		}		 
			
		/* for (const property in $data) { */
		/* 	console.log(`${property}: ${$data[property]}`); */
		/* } */
	
	}	
	
	// _showError()
	var _showError = function () {		
		$resultsBox = $('#results-count');
		$resultsBox.empty();
		$resultsError = $('<p>').addClass('text-result text-allert').text('Вы заполнили не все поля!!!');
		$resultsBox.append($resultsError);
	}

	// _getValueInputs
	var _getValueInputs = function (elem , data) {		
		elem.find('input').each(function() {		
			if($(this).val() == "") {
				data[this.name] = 0;
			} else {		  	
				data[this.name] = $(this).val();		  	
			}		  
		});			
	}
	
	// makeTable
	function makeTable(array, addBoxes) {
		let max = 0;
		let countEmptyBox = false;
		for (let i = 0; i < array.length; i++) {
			if(array[i] > max){
				max = array[i];
			}			
		}
		var table = document.createElement('table');
		table.classList.add("contView");
		var cellMax = max;
		for (var i = 0; i < max; i++) {
			var row = document.createElement('tr');
			for (var j = 0; j < array.length; j++) {
				var cell = document.createElement('td');
				if(array[j] >= cellMax) {
					if(i == (max - 1)){
						let curNumbCell = j + 1;
						cell.innerHTML = "&nbsp" + curNumbCell + "&nbsp";
						cell.classList.add("cellBox","cellFullBox");
					}else {		
						if(i == 0 ) {
							cell.innerHTML = "&nbsp;" + array[j] + "&nbsp;";
						} else if (i == 1 && array[j] == (max - 1)) {
							cell.innerHTML = "&nbsp;" + array[j] + "&nbsp;";
						} else {
							cell.innerHTML = "&nbsp;&nbsp;"
						}							
						cell.classList.add("cellBox","cellFullBox");
					}					
				} else {
					if(!countEmptyBox) {
						countEmptyBox = true;
						cell.innerHTML = "&nbsp;" + addBoxes + "&nbsp;";
						cell.classList.add("cellBox","cellAddBox");	
					} else {
						cell.innerHTML = "&nbsp;&nbsp;";
						cell.classList.add("cellBox","cellEmptyBox");	
					}
					
								
				}				
				row.appendChild(cell);
			}
			cellMax--;
			table.appendChild(row);
		}
		return table;
	}

	// _countLayer
	var _countLayer = function(countRow, contLength, boxLength, countBoxes, minBoxLength, procentBoxLength) {
		let result = {};

		// count leyer length
		boxLength = boxLength/10;		
		let remainder = parseFloat((contLength%boxLength).toFixed(2));		
		if(boxLength < minBoxLength) {
			if(remainder < boxLength) {
				remainder = remainder + boxLength;
			}
		} else {
			if(remainder < (boxLength * procentBoxLength)) {
				remainder = parseFloat((remainder + boxLength).toFixed(2));				
			}
		}
	
		wholeContLength = contLength - remainder;		
		let leyerLength = parseInt(wholeContLength/boxLength);

		// count boxes leyer
		let oneLeyer = countRow * leyerLength;

		// count leyers
		let remainderBox = countBoxes%oneLeyer;
		let wholeCountLeyer = countBoxes - remainderBox;
		let countLeyer = wholeCountLeyer/oneLeyer;

		// count additional leyers
		let remainderAddBoxes = remainderBox%countRow;
		let wholeAddLeyers = remainderBox - remainderAddBoxes;
		let countAddLeyers = wholeAddLeyers/countRow;

		// set array leyers
		let arrayLeyers =[];
		let indexAddLeyers = countAddLeyers;
		let curCountBoxInCol = 0;
		for (let index = 0; index < leyerLength; index++) {
			
			if(indexAddLeyers > 0) {
				curCountBoxInCol = countLeyer + 1;
			} else {
				curCountBoxInCol = countLeyer;
			}

			indexAddLeyers--;
			arrayLeyers[index] = curCountBoxInCol;			
		}
		result.arrayLeyers = arrayLeyers;
		result.addBoxes = remainderAddBoxes;
		result.contLengthRemainder = remainder;
		result.countLeyer = countLeyer;
		result.leyerLength = leyerLength;
		result.remainderBox = remainderBox;
		return result;
	}

	// _showViewParties

	var _showViewParties = function (countLeyer) {
		let $resultTable =  makeTable(countLeyer.arrayLeyers, countLeyer.addBoxes);
		$resultsBox = $('#results-count');
		$resultsBox.empty();
		$resultsBox.append($resultTable);

		$resultsCountRow = $('<p>').addClass('text-result').text('Количество рядов : ' + countLeyer.leyerLength);
		$resultsCountAddBox = $('<p>').addClass('text-result').text('Количество ящиков которые необходимо добавить : ' + countLeyer.addBoxes);
		$resultsCountLengthRemainder = $('<p>').addClass('text-result').text('Растояние от последнего ряда ящиков до конца контейнера : ' + countLeyer.contLengthRemainder + ' см.');
		$resultSParties = $('<p>').addClass('text-result').text('Обьем партии : ' + countLeyer.sParties + ' м3');
		$resultsBox.append($resultsCountRow)
						.append($resultsCountAddBox)
							.append($resultsCountLengthRemainder)
								.append($resultSParties);
	}	


	// _showViewAllParties

	var _showViewAllParties = function (arrayParties) {
		$resultsBox = $('#results-count');
		$resultsBox.empty();

		for(let i = 0; i < arrayParties.length; i++) {
			let $resultTable =  makeTable(arrayParties[i].countLeyer.arrayLeyers, arrayParties[i].countLeyer.addBoxes);
			$resultsBox.append($resultTable);
			
			$resultsCountRow = $('<p>').addClass('text-result').text('Количество рядов : ' + arrayParties[i].countLeyer.leyerLength);
			$resultsCountAddBox = $('<p>').addClass('text-result').text('Количество ящиков которые необходимо добавить : ' + arrayParties[i].countLeyer.addBoxes);
			$resultsCountLengthRemainder = $('<p>').addClass('text-result').text('Растояние от последнего ряда ящиков до конца контейнера : ' + arrayParties[i].countLeyer.contLengthRemainder + ' см.');
			$resultSParties = $('<p>').addClass('text-result').text('Обьем партии : ' + arrayParties[i].countParties + ' м3');
			$resultsBox.append($resultsCountRow)
						.append($resultsCountAddBox)
							.append($resultsCountLengthRemainder)
							.append($resultSParties);
			
		}
	}


	// _countSParties
	
	var _countSParties = function(parties, countBoxesParties) {
		let result = 0;
		result = parseFloat((((parties["typeBox"]["width"]/1000) * (parties["typeBox"]["length"]/1000) * (parties["typeBox"]["height"]/1000)) * countBoxesParties ).toFixed(2));
		//console.log(result);
		return result;
	}

	// _countPartiesProportion

	var _countPartiesProportion = function (arrayParties, containerWidth, containerLength) {
		let result = [];
		let persentPartiesArray = [];		
		
		let sAllParties = 0;
		for(let i = 0; i< arrayParties.length; i++) {
			sAllParties = sAllParties + arrayParties[i].countParties;
		}

		let onePersentAllParties = parseFloat((sAllParties/100).toFixed(2));

		for(let i = 0; i< arrayParties.length; i++) {
			persentPartiesArray[i] = arrayParties[i].countParties / onePersentAllParties;
		}

		let onePersentLength = parseFloat((containerLength/10000).toFixed(2));

		for(let i = 0; i < persentPartiesArray.length; i++) {
			result[i] = parseInt((persentPartiesArray[i] * onePersentLength) * 100);
		}	return result;
	};



	return {
		init: init
	}
})();

main.init();

