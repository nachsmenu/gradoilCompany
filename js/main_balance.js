var main = (function(){
	//alert("Вован, Тебе это батл не победить");
	var init = function(){
		//_displayDialogWindow();
		_setUpListeners();
	};

	var _setUpListeners = function() {
		$('#countForm').on('click', _serializeForm);
		$('#btnYes').on('click', _closeDialogWindow);
		$('#btnNo').on('mouseenter',_dinamicButton);
		//$('#btnNo').on('click',_closeDialogWindow);
	};
	
	var _closeDialogWindow = function() {
		$('#dialogWindow').hide();
	}
	
	var _dinamicButton = function() {
		var maxX = $(".dialog-window__box").width() - $(this).width();
		var maxY = $(".dialog-window__box").height() - $(this).height();
		$(this).css({
			'left':_getRandomInt(0, maxX),
			'top':_getRandomInt(0, maxY),
			'bottom': 'initial',
		});		
		
	}
	
	var _displayDialogWindow = function() {
		$dialogWindow = $('<div>').addClass('dialog-window').attr('id','dialogWindow');
		$dialogBox = $('<div>').addClass('dialog-window__box');
		$firstText = $('<p>').addClass('dialog-window__text-box text-box_first').text('Уважаемые сотрудники, в связи со сложившейся кризисной ситуацией, проводится опрос сотрудников по поводу зароботной платы:')
		$twoText = $('<p>').addClass('dialog-window__text-box text-box_two').text('Вы довольны своей зарплатой?');
		$buttonYes = $('<button>').addClass('btn btn-success dialog-window__button btnYes').attr('id','btnYes').text('Да');
		$buttonNo = $('<button>').addClass('btn btn-danger dialog-window__button btnNo').attr('id','btnNo').text('Нет');
		$dialogBox.append($firstText)
					.append($twoText)
					.append($buttonYes)
						.append($buttonNo);
		$dialogWindow.append($dialogBox);
		$('#mainContainer').append($dialogWindow);
	};
	
	var _getRandomInt = function(min,max) {
		return Math.floor(Math.random()*(max - min + 1)) + min;
	}	

	var _dataTank = {
		tank_E1n: 25000,
		tank_E8n: 3600,
		tank_E13n: 2000,
		tank_E15n: 8500,
		tank_E41n: 2000,
		tank_E1o: 25000,
		tank_E3o: 10000,
		tank_E19o: 1000,
		tank_F5_1o: 4800,
		tank_F5_2o: 4800,
		tank_E3v: 25000,
		tank_E7v: 55000,
		tank_F11_1v: 13100,
		tank_F11_2v: 13100,
		tank_E19v: 12000,
		tank_E4d: 2000,
		tank_E6d: 10400,
		tank_E7d: 11700,
		tank_E31d: 12700
	};

	var _dataLimits = {
		limit_E31d: 0,
		limit_E3v: 0,
		limit_E19v: 0,
		limit_E7v: 0
	};
	
	var _dataMissing = {
		missing_E31d: 0,
		missing_E3v: 0,
		missing_E19v: 0,
		missing_E7v: 0
	}
	

	var _serializeForm = function(){
		var $data = {};		
		var count = 0;
		_clearDataMissing(_dataMissing);
		$('#mainForm').find ('input').each(function() {		
		  if($(this).val() == "") {
		  	$data[this.name] = 0;
		  } else {
		  	if(this.name == 'limit_E31d') {
		  		_dataLimits.limit_E31d = $(this).val();		  		
		  	} else if (this.name == 'limit_E19v') {
		  		_dataLimits.limit_E19v = $(this).val();		  		
 		  	} else if (this.name == 'limit_E3v') {
					_dataLimits.limit_E3v = $(this).val();				
				}	else if (this.name == 'limit_E7v') {
					_dataLimits.limit_E7v = $(this).val();
					console.log('_dataLimits.limit_E7v - ' + _dataLimits.limit_E7v);
				} else {
 		  		$data[this.name] = $(this).val();
 		  	}
		  	
		  }		  
		});

		for (var key in $data) {			
			switch (key) {
			  case 'tank_E3o':			    
			  	var tankPercent = parseInt($data[key]);
			    count = count + _countTank(_dataTank[key], tankPercent, $data);
			    if($data.tank_F5_1o != 0 && $data.tank_F5_2o != 0) {
			    	count = count + _countTank(_dataTank.tank_F5_1o, 100)
			    }
			    console.log('countE3o - ' + count);
			    break;
			  case 'tank_F5_1o':
			  	count = count;
			  	break;
			  case 'tank_F5_2o':
			  	count = count;
			  	break;	
			  case 'tank_E7v':			  	
					var tankE7vPercent = parseInt($data[key]);
					var tankF11Percent = _countTankInTank(_dataTank[key],_dataTank.tank_F11_1v);					
			    	count = _countE7v(count, _dataTank[key], tankE7vPercent, $data, tankF11Percent, _dataLimits.limit_E7v);
			    	console.log('countE7v - ' + count);
			    break;
			  case 'tank_E3v':
					var tankE3vPercent = parseInt($data[key]);				
			  		if(tankE3vPercent > _dataLimits.limit_E3v) {						
						tankE3vPercent = tankE3vPercent - _dataLimits.limit_E3v;					
						count = count + _countTank(_dataTank[key], tankE3vPercent);										
			  		} else if (tankE3vPercent < _dataLimits.limit_E3v) {						
					var diffPercents = _dataLimits.limit_E3v - tankE3vPercent;
					_dataMissing.missing_E3v = _countTank(_dataTank[key], diffPercents);				
					} else {
						count = count;						
			  	}
			  	break; 
			  case 'tank_E19v':
					var tankE19vPercent = parseInt($data[key]);								
			  		if(tankE19vPercent > _dataLimits.limit_E19v) {
			  		tankE19vPercent = tankE19vPercent - _dataLimits.limit_E19v;
			  		count = count + _countTank(_dataTank[key], tankPercent);
			  		} else if (tankE19vPercent < _dataLimits.limit_E19v) {
					var diffPercents = _dataLimits.limit_E19v - tankE19vPercent;
					_dataMissing.missing_E19v = _countTank(_dataTank[key], diffPercents);					
					} else {
			  		count = count;
			  	}
			  	break;  
			  case 'tank_F11_1v': 
			  	count = count;
			  	break;
			  case 'tank_F11_2v': 
			  	count = count;
			  	break;
			  case 'tank_E31d':
			  	var tankPercent = parseInt($data[key]);
			  	if(tankPercent > _dataLimits.limit_E31d) {
			  		tankPercent = tankPercent - _dataLimits.limit_E31d;
			  		count = count + _countTank(_dataTank[key], tankPercent);
			  	} else if (tankPercent < _dataLimits.limit_E31d) {
					var diffPercents = _dataLimits.limit_E31d - tankPercent;					
					_dataMissing.missing_E31d = _countTank(_dataTank[key], diffPercents);									
				} else {
			  		count = count;
			  	}
			  	break; 				  			 			 
			  default:
			  	console.log(key);
			  	var tankPercent = parseInt($data[key]);
			    count = count + _countTank(_dataTank[key], tankPercent);
			    console.log('count - ' + count);
			}			
		}
		
		var totalMissing = 0,
		totalResult = 0;
		for (var key in _dataMissing) {
			totalMissing = (totalMissing) + (_dataMissing[key]);
		}
		
		if( totalMissing <= count) {
			totalResult = count - totalMissing;
		}	
		
		$resultsBox = $('#results-count');
		$resultsBox.empty();
		$resultsCount = $('<p>').addClass('text-result').text('Результат: ' + totalResult + ' кг.');
		$resultsBox.append($resultsCount);
		var sumMissing = 0;
		if(_dataMissing.missing_E3v != 0) {
			$missing3v = $('<p>').addClass('text-allert').text('В емкость 3в необходимо докачать: ' + _dataMissing.missing_E3v + ' кг.' + ' чтобы достичь - ' + _dataLimits.limit_E3v + ' %');
			$resultsBox.append($missing3v);
			sumMissing = sumMissing + _dataMissing.missing_E3v;
		}
		if(_dataMissing.missing_E19v != 0) {
			$missing19v = $('<p>').addClass('text-allert').text('В емкость 19в необходимо докачать: ' + _dataMissing.missing_E19v + ' кг.' + ' чтобы достичь - ' + _dataLimits.limit_E19v + ' %');
			$resultsBox.append($missing19v);
			sumMissing = sumMissing + _dataMissing.missing_E19v;
		}
		if(_dataMissing.missing_E31d != 0) {
			$missing31d = $('<p>').addClass('text-allert').text('В емкость 31д необходимо докачать: ' + _dataMissing.missing_E31d + ' кг.' + ' чтобы достичь - ' + _dataLimits.limit_E31d + ' %');
			$resultsBox.append($missing31d);
			sumMissing = sumMissing + _dataMissing.missing_E31d;
		}

		if(_dataMissing.missing_E7v != 0) {
			$missing7v = $('<p>').addClass('text-allert').text('В емкость E7в необходимо докачать: ' + _dataMissing.missing_E7v + ' кг.' + ' чтобы достичь - ' + _dataLimits.limit_E31d + ' %');
			$resultsBox.append($missing7v);
			sumMissing = sumMissing + _dataMissing.missing_E7v;
		}
		
		$sumMissing = $('<p>').addClass('text-allert').text('СУММА того что необходимо докачать: ' + sumMissing + ' кг.');
		$resultsBox.append($sumMissing);
		
	}

	var _clearDataMissing = function(dataMissing) {
		for (var key in dataMissing) {
			dataMissing[key] = 0;
		}
	}

	var _countTank = function(tankVal, tankPercent) {
		var countPercent = tankVal / 100;
		var item = tankPercent * countPercent;		
		return item;
	}	

	var _countTankInTank = function(tankVal, tankInTankVal) {
		var countPercent = tankVal / 100;	
		var result = parseInt(tankInTankVal/countPercent);
		return result;
	}
	
	var _countE7v = function(count, tankVal, tankPercent, dataTanks, tankF11Percent, tankLimit) {
		var result = count,
					item,
					curTankPercent = tankPercent,
					countPercent = tankVal / 100,
					optimTankPercent = tankLimit - tankF11Percent;	
										
		if(dataTanks.tank_F11_1v != 0 && dataTanks.tank_F11_2v != 0) {			
			if(tankPercent > optimTankPercent) {
				curTankPercent = (tankPercent - optimTankPercent) + tankF11Percent;				
				item = curTankPercent * countPercent;				
				result = count + item;
			} else {
				curTankPercent = tankPercent + (tankF11Percent * 2);				
				if(curTankPercent > tankLimit) {
					curTankPercent = (curTankPercent - tankLimit);
					item = curTankPercent * countPercent;
					result = count + item;					
				} else {
					var diffPercents = tankLimit - curTankPercent;					
					_dataMissing.missing_E7v = _countTank(tankVal, diffPercents);	
				}
			}
		}

		if(dataTanks.tank_F11_1v != 0 && dataTanks.tank_F11_2v == 0) {			
			if(tankPercent > optimTankPercent) {				
				curTankPercent = tankPercent + tankF11Percent;				
				if(curTankPercent > tankLimit) {
					curTankPercent = curTankPercent - tankLimit;				
					item = curTankPercent * countPercent;				
					result = count + item;
				}	else {
					var diffPercents = tankLimit - curTankPercent;					
					_dataMissing.missing_E7v = _countTank(tankVal, diffPercents);	
				}		
				
			}
		}

		if(dataTanks.tank_F11_1v == 0 && dataTanks.tank_F11_2v != 0) {			
			if(tankPercent > optimTankPercent) {
				curTankPercent = tankPercent + tankF11Percent;
				if(curTankPercent > tankLimit) {
					curTankPercent = curTankPercent - tankLimit;
					item = curTankPercent * countPercent;				
					result = count + item;
				} else {
					var diffPercents = tankLimit - curTankPercent;					
					_dataMissing.missing_E7v = _countTank(tankVal, diffPercents);	
				}
			}
		}

		if(dataTanks.tank_F11_1v == 0 && dataTanks.tank_F11_2v == 0) {				
			if(tankPercent > tankLimit) {
				curTankPercent = tankPercent - tankLimit;
				item = curTankPercent * countPercent;				
				result = count + item;
			} else {
				var diffPercents = tankLimit - curTankPercent;					
				_dataMissing.missing_E7v = _countTank(tankVal, diffPercents);	
			}
		}

		return result;
	}

	

	return {
		init: init
	}
})();

main.init();

