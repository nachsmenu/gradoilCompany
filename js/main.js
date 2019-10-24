var main = (function(){
	var init = function(){		
		setUpListeners();
		setValueInputs();
	};

	var setUpListeners = function() {
		$('#countForm').on('click', _serializeForm);		
		$('#mainForm input').on('blur', _saveValue);
	};

	var setValueInputs = function() {
		var inputs = $('#mainForm').find ('input');		
		inputs.each(function() {			
			$(this).val(_getSavedValue($(this).attr( "name" )));
		})
	}

	var _saveValue = function(e) {
		var name = e.target.name;
		var val = e.target.value;		
		localStorage.setItem(name, val);
	}

	var _getSavedValue = function(v) {
		if (!localStorage.getItem(v)) {
			return "";
		}
		return localStorage.getItem(v);
	}	

	var _serializeForm = function(){
		const $data = {};
		const doseVit = 10;		
		let count,
			countVolumeAllbottles,
			countWeightAllbottles,
			countDoseHour,
			countHourWork;
				
		$('#mainForm').find ('input').each(function() {		
		  if($(this).val() == "") {
		  	$data[this.name] = 0;
		  } else {		  	
 		  	$data[this.name] = $(this).val();		  	
		  }		  
		});	
		
		countVolumeAllbottles = $data['numberBottle'] * $data['numberVolume'];
		countWeightAllbottles = (countVolumeAllbottles * 0.92)/1000;
		//console.log(countVolumeAllbottles);
		countDoseHour = $data['numberDose'] * 60;
		//console.log(countDoseHour);
		countHourWork = (countVolumeAllbottles/($data['workFlow'] * 1000)).toFixed(1);
		//console.log(countHourWork);
		count = ((countHourWork * countDoseHour)/1000).toFixed(2);			
		countVit = ((countWeightAllbottles * $data['numberVit'])/1000).toFixed(3); 
		countVitDose = ((doseVit * countVit)/count).toFixed(4);

		$resultsBox = $('#results-count');
		$resultsBox.empty();
		$resultsCount = $('<p>').addClass('text-result').text('Кол. концентрата : ' + count + ' кг.');
		$resultsCountVit = $('<p>').addClass('text-result').text('Кол. витамина : ' + countVit + ' кг.');
		$resultsCountVitDose = $('<p>').addClass('text-result').text('Кол. витамина на 10кг : ' + countVitDose + ' кг.');
		$resultsBox.append($resultsCount)
						.append($resultsCountVit)
							.append($resultsCountVitDose);		
	}	

	return {
		init: init
	}
})();

main.init();

