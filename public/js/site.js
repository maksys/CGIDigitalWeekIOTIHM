(function () {
	"use strict";

	$(document).ready(function () {

		//Définition des varaibles.
		 var  minNumber = 2;
		 var maxNumber = 4;


		//retourn les informations de stands a partir de WS
		getStandsInfo();

		//détermine le mode de présentation
		getViewType();

		//initialiser le nombre des personnes
		setNumberPersons(minNumber,maxNumber);

		//appeler le WS avec un délai de 5 secondes
		var durationInMs = 1000 * 60 * 60;
		setInterval(getStandsInfo, durationInMs);
	});

	/** la fonction permet de récupérer les informations des stands **/
	function getStandsInfo() {
		$.ajax({
			method: "GET",
			headers: { 'Auth': 'CGIDigitalWeek' },
			url: "http://cgidigitalweekwebchat.azurewebsites.net/Crowd/StandsInfo",
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
		}).error(function (err) {
			console.error(err);
		});
	}

	/** la fonction permet de changer les couleurs en function de nombre de personnes **/
	function personNumber(number, className, standName, spaceName) {

	    //Définition des varaibles.
		var  minNumber = 2;
		var  maxNumber = 4;
		
		// le stand est vert
		if (number <= minNumber) {
			$(className).html(number);
			$(standName).attr("data-category", "1");
			$('.content__item[data-space="' + spaceName + '"]').attr("data-category", "1");
			$('.list__item[data-space="' + spaceName + '"]').attr("data-persons", number);

		}

		// le stand est orange
		if (number > minNumber && number <= maxNumber) {
			$(className).html(number);
			$(standName).attr("data-category", "2");
			$('.content__item[data-space="' + spaceName + '"]').attr("data-category", "2");
			$('.list__item[data-space="' + spaceName + '"]').attr("data-persons", number);
		}

		// le stand est rouge
		if (number > maxNumber) {
			$(className).html(number);
			$(standName).attr("data-category", "3");
			$('.content__item[data-space="' + spaceName + '"]').attr("data-category", "3");
			$('.list__item[data-space="' + spaceName + '"]').attr("data-persons", number);
		}

		// Ajouter une animation
		$('.pin--number').stop(true, true).fadeOut('3000').delay(1000).fadeIn('3000');
		

	}


	/* la fonction permet de déterminer le type d'affchage sur l'ecran */
	function getViewType() {
		var presentationMode = getUrlParameter('mode');
		if (presentationMode === "presentation") {

			//ajouter le style spécifique au mode présentation
			addStylePresentationMode();

		}
	}

	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	}

	/* la fonction suivante permet d'ajouter le style spécifique pour le mode presentation' */
	function addStylePresentationMode() {
		$(".search, .mallnav").hide();
		$("aside").css("padding", "0");
		$(".map").addClass('presentation');
		$(".pin--2-1").addClass('pin--pres--2-1');
		$(".pin--2-2").addClass('pin--pres--2-2');
		$(".pin--2-3").addClass('pin--pres--2-3');
		$(".pin--2-5").addClass('pin--pres--2-5');
		$(".pin--2-7").addClass('pin--pres--2-7');
		$(".pin--2-8").addClass('pin--pres--2-8');
	}

	/* la fonction initialise le nombre des personnes*/
	function setNumberPersons(min,max){
		$('.minNumber').html(min);
		$('.maxNumber').html(max);
		
	}

})();


