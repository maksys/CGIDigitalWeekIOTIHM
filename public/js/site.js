(function(){
  "use strict";

  	$(document).ready(function () {
		getStandsInfo();
		
		//appeler le WS avec un délai de 5 secondes
		var durationInMs = 5000;
		setInterval(getStandsInfo, durationInMs);
	});
	
	/** la fonction permet de récupérer les informations des stands **/
	function getStandsInfo() {
			$.ajax({
				method:"GET",
				headers: { 'Auth': 'CGIDigitalWeek' },
				url:"http://cgidigitalweekwebchat.azurewebsites.net/Crowd/StandsInfo",
				contentType: "json",
				cache: false,
				timeout: 10000
			}).done(function (data) {
				//la fonction permer de gérer l'affichage en fonction de numbre des personnes
				for (var i = 0; i < data.length; i++) {
					$.each(this, function () {
						if (data[i].deviceId === "DGWStand1") {
							personNumber(data[i].persons, ".stand--partenariat", ".pin--2-1", "2.01");
						}
						else if (data[i].deviceId === "DGWStand2") {
							personNumber(data[i].persons, ".stand--chatbot", ".pin--2-2", "2.02");

						}
						else if (data[i].deviceId === "DGWStand3") {
							personNumber(data[i].persons, ".stand--maeva", ".pin--2-3", "2.03");

						}
						else if (data[i].deviceId === "DGWStand4") {
							personNumber(data[i].persons, ".stand--block--chain", ".pin--2-5", "2.05");

						}
						else if (data[i].deviceId === "DGWStand5") {
							personNumber(data[i].persons, ".stand--iot", ".pin--2-7", "2.07");

						}
						else if (data[i].deviceId === "DGWStand6") {
							personNumber(data[i].persons, ".stand--api", ".pin--2-8", "2.08");
						}
					});
				}
			}).error(function(err){
				console.error(err);
			});
		}

	/** la fonction permet de changer les couleurs en function de nombre de personnes **/
	function personNumber(number, className, standName, spaceName) {
		// le stand est vert
		if (number <= 2) {

			$(className).html(number);
			$(standName).attr("data-category", "1");
			$('.content__item[data-space="' + spaceName + '"]').attr("data-category", "1");
		}

		// le stand est orange
		if (number > 2 && number <= 4) {
			$(className).html(number);
			$(standName).attr("data-category", "2");
			$('.content__item[data-space="' + spaceName + '"]').attr("data-category", "2");
		}

		// le stand est rouge
		if (number > 4) {
			$(className).html(number);
			$(standName).attr("data-category", "3");
			$('.content__item[data-space="' + spaceName + '"]').attr("data-category", "3");
		}

		// Ajouter une animation
		if (number != $('.pin--number').html()) {
				$('.pin--number').addClass('.pin--number-animation');
		}
	}
})();


