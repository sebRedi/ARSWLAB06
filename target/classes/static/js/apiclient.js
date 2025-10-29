// @author sebastianGalvis

apiclient = (function () {

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            $.get("/blueprints/" + authname, function (data) {
                callback(data);
            }).fail(function () {
                alert("No se pudieron obtener los planos del autor: " + authname);
            });
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            $.get("/blueprints/" + authname + "/" + bpname, function (data) {
                callback(data);
            }).fail(function () {
                alert("No se pudo obtener el plano " + bpname + " de " + authname);
            });
        }
    };

})();
