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
        },

        updateBlueprint: function (authname, bpname, blueprint) {
            return $.ajax({
                url: "/blueprints/" + authname + "/" + bpname,
                type: 'PUT',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            });
        },

        createBlueprint: function (blueprint) {
            return $.ajax({
                url: "/blueprints",
                type: 'POST',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            });
        },

        deleteBlueprint: function (authname, bpname) {
            return $.ajax({
                url: "/blueprints/" + authname + "/" + bpname,
                type: 'DELETE'
            });
        }
    };

})();
