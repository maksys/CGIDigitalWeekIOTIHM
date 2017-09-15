(function () {
    "use strict";

    $(document).ready(function () {

        //Définition des varaibles.
        var minNumber = 2;
        var maxNumber = 4;

        //retourn les informations de stands a partir de WS
        getStandsInfo();

        //détermine le mode de présentation
        getViewType();

        //initialiser le nombre des personnes
        setNumberPersons(minNumber, maxNumber);

        //appeler le WS avec un délai de 5 secondes
        var durationInMs = 10000 * 5;
        setInterval(getStandsInfo, durationInMs);

        mallMap.showLevel(2);
    });

    /** la fonction permet de récupérer les informations des stands **/
    function getStandsInfo() {
        $.ajax({
            method: "GET",
            headers: {
                'Auth': 'CGIDigitalWeek'
            },
            url: "http://cgidigitalweekwebchat.azurewebsites.net/Crowd/StandsInfo",
            contentType: "json",
            cache: false,
            timeout: 10000
        }).done(function (data) {
            
            //la fonction permer de gérer l'affichage en fonction de numbre des personnes
            for (var i = 0; i < data.length; i++) {
                $.each(data, function(i, stand) {
                    
                    var message = JSON.parse(stand.message);

                    console.log(message);

                    console.log("\n");
                    console.log("deviceId: " + message.deviceId);
                    console.log("persons: " + message.persons);
                    console.log("males: " + message.males);
                    console.log("females: " + message.females);
                    console.log("age average: " + message.age);
                    console.log("sunglasses: " + message.sunglasses);
                    console.log("readingglasses: " + message.readingglasses);
                    console.log("happypersons: " + message.happypersons);
                    console.log("neutralpersons: " + message.neutralpersons);
                    console.log("disgustpersons: " + message.disgustpersons);
                    console.log("angerpersons: " + message.angerpersons);
                    console.log("hearypersons: " + message.hearypersons);

                    if (message.deviceId === "DGWStand1") {
                        personNumber(message.persons, ".stand--partenariat", ".pin--2-1", "2.01");
                    } else if (message.deviceId === "DGWStand2") {
                        personNumber(message.persons, ".stand--chatbot", ".pin--2-2", "2.02");

                    } else if (message.deviceId === "DGWStand3") {
                        personNumber(message.persons, ".stand--maeva", ".pin--2-3", "2.03");

                    } else if (message.deviceId === "DGWStand4") {
                        personNumber(message.persons, ".stand--block--chain", ".pin--2-5", "2.05");

                    } else if (message.deviceId === "DGWStand5") {
                        personNumber(message.persons, ".stand--iot", ".pin--2-7", "2.07");

                    } else if (message.deviceId === "DGWStand6") {
                        personNumber(message.persons, ".stand--api", ".pin--2-8", "2.08");
                    }

                    $('#' + message.deviceId).find('.genderMale').html(message.males);
                    $('#' + message.deviceId).find('.genderFemale').html(message.females);
                    $('#' + message.deviceId).find('.age').html('['+message.age+']');

                    $('#' + message.deviceId).find('.readingglasses').html(message.readingglasses);
                    $('#' + message.deviceId).find('.sunglasses').html(message.sunglasses);
                    $('#' + message.deviceId).find('.hearypersons').html(message.hearypersons);
                

                    var ctx = document.getElementById(message.deviceId + '_chart').getContext('2d');
                    var color = Chart.helpers.color;
                    var data = {
                        datasets: [{
                            data: [message.happypersons, message.neutralpersons, message.angerpersons],
                            backgroundColor: [
                                color('rgb(124, 191, 127)').alpha(0.5).rgbString(),
                                color('rgb(255, 165, 0)').alpha(0.5).rgbString(),
                                color('rgb(165, 13, 51)').alpha(0.5).rgbString(),
                            ],
                            borderColor: [
                                color('rgb(215, 215, 220)').alpha(0.5).rgbString(),
                                color('rgb(215, 215, 220)').alpha(0.5).rgbString(),
                                color('rgb(215, 215, 220)').alpha(0.5).rgbString(),
                            ]
                        }],

                        // These labels appear in the legend and in the tooltips when hovering different arcs
                        labels: [
                            'Joie',
                            'Neutre',
                            'Colere'
                        ]
                    }; 
                
                    Chart.scaleService.defaults.radialLinear.ticks.backdropColor = 'rgba(0, 0, 0, 0)';
                    new Chart(ctx, {
                        data: data,
                        type: 'polarArea',
                        responsive:true,
                        maintainAspectRatio: true,
                        options:{
                            legend:{
                                labels:{
                                    boxWidth: 20,
                                    fontStyle:'bold',
                                }
                            }
                        }
                    });
                });
            }
        }).error(function (err) {
            console.error(err);
        });
    }

    /** la fonction permet de changer les couleurs en function de nombre de personnes **/
    function personNumber(number, className, standName, spaceName) {

        //Définition des varaibles.
        var minNumber = 2;
        var maxNumber = 4;

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
    function setNumberPersons(min, max) {
        $('.minNumber').html(min);
        $('.maxNumber').html(max);

    }

})();
