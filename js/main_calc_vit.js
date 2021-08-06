var main = (function(){
	var init = function(){		
		setUpListeners();
		//setValueInputs();
	};

	var setUpListeners = function() {
		$('#countForm').on('click', _serializeForm);		
		//$('#mainForm input').on('blur', _saveValue);
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

    var _calcVit = function(quantityVit, coef) {
        return (quantityVit*coef[0]/coef[1]).toFixed(4);
    }

	var _serializeForm = function(){	
        const VITCOEF = {
            "countBeta": [99.96, 0.04],
            "countAvit": [98.955, 1.045],
            "countADvit": [98.225,1.775]
        };	
        let data = $( "form" ).serializeArray().reduce(function(a, x) { a[x.name] = x.value; return a; }, {});
        let resultData = {};
        for (const property in data) {
            let curProperty = (parseFloat(data[property])).toFixed(4);
            if(curProperty !== 0) {
                resultData[property] = _calcVit(curProperty, VITCOEF[property]);
            } else {
                resultData[property] = 0;
            }
        }

        console.log(resultData);

        $resultsBox = $('.results-count');
		$resultsBox.empty();

        for (const propResult in resultData) {
            $resultsCountText = $('<p>').addClass('text-result').text('Кол-во масла подсолн. : ' + resultData[propResult] + ' кг.');
            let $curInputBox = $('.' + propResult + "-js" );
            $curInputBox.find('.results-count').append($resultsCountText); 
        }    		
	
	}	

	return {
		init: init
	}
})();

main.init();