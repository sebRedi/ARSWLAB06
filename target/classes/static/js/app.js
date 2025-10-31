// @author sebastianGalvis

var app = (function () {
    var dataSource = apiclient; // apiclient || apimock
    // Estado privado
    var _author = null;
    var _blueprints = [];
    var _canvas = null;
    var _ctx = null;
    var _currentBlueprint = null;
    var _isCreating = false;

    // Función privada para calcular puntos totales
    function _calculateTotalPoints() {
        return _blueprints.map(bp => bp.points.length)
            .reduce((a, b) => a + b, 0);
    }

    // Función privada para dibujar un blueprint en canvas
    function _drawBlueprint(bp) {
        _ctx.clearRect(0, 0, _canvas.width, _canvas.height); // limpiar antes de dibujar
        if (bp.points.length > 0) {
            _ctx.beginPath();
            _ctx.moveTo(bp.points[0].x, bp.points[0].y);
            for (var i = 1; i < bp.points.length; i++) {
                _ctx.lineTo(bp.points[i].x, bp.points[i].y);
            }
            _ctx.stroke();
        }
    }

    // Función privada para manejar clics o toques en el canvas
    function _handleCanvasClick(x, y) {
        // Si no hay un plano seleccionado, no hacer nada
        if (!_currentBlueprint) {
            console.warn("No hay blueprint seleccionado. Ignorando clic.");
            return;
        }
        // Agregar el punto al blueprint actual (solo en memoria)
        _currentBlueprint.points.push({ x: x, y: y });
        console.log("Nuevo punto agregado:", { x, y });
        // Repintar el blueprint con el nuevo punto
        _drawBlueprint(_currentBlueprint);
    }

    // API pública del módulo
    return {
        setAuthor: function (authorName) {
            _author = authorName;
        },

        getBlueprints: function () {
            return dataSource.getBlueprintsByAuthor(_author, function (data) {
                if (!data || data.length === 0) {
                    // si no hay planos
                    $("#blueprintsTable").empty();
                    $("#totalPoints").text(0);
                    $("#selectedAuthor").text(_author + " (sin planos)");
                    return;
                }

                _blueprints = data;
                $("#selectedAuthor").text(_author);

                // construir tabla
                var table = $("#blueprintsTable");
                table.empty();
                data.forEach(bp => {
                    var row = `<tr>
                        <td>${bp.name}</td>
                        <td>${bp.points.length}</td>
                        <td><button class="btn btn-info" onclick="app.openBlueprint('${bp.name}')">Open</button></td>
                    </tr>`;
                    table.append(row);
                });

                $("#totalPoints").text(_calculateTotalPoints());
            });
        },

        openBlueprint: function (bpName) {
            dataSource.getBlueprintsByNameAndAuthor(_author, bpName, function (bp) {
                if (bp) {
                    _currentBlueprint = bp;
                    $("#currentBlueprint").text(bp.name);
                    _drawBlueprint(bp);
                    console.info("Blueprint abierto:", bp.name);
                }
            });
        },

        createNewBlueprint: function () {
            if (!_author) {
                alert("Primero selecciona un autor.");
                return;
            }
            const newName = prompt("Ingrese el nombre del nuevo blueprint:");
            if (!newName) {
                alert("Debe ingresar un nombre válido.");
                return;
            }
            // Limpiar canvas
            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
            // Crear nuevo objeto blueprint en memoria
            _currentBlueprint = {
                author: _author,
                name: newName,
                points: []
            };
            _isCreating = true;
            $("#currentBlueprint").text(newName + " (nuevo)");
            console.info("Creando nuevo blueprint:", newName);
        },

        saveBlueprint: function () {
            if (!_currentBlueprint) {
                alert("No hay un blueprint seleccionado para guardar.");
                return;
            }
            const name = _currentBlueprint.name;
            const blueprintData = {
                author: _author,
                name: name,
                points: _currentBlueprint.points
            };
            // Si es un nuevo blueprint, POST
            const operation = _isCreating
                ? dataSource.createBlueprint(blueprintData)
                : dataSource.updateBlueprint(_author, name, blueprintData);
            // Ejecutar POST o PUT
            operation
                .then(() => {
                    console.log(_isCreating ? "Blueprint creado." : "Blueprint actualizado.");
                    _isCreating = false;
                    // Refrescar los blueprints del autor
                    return new Promise((resolve, reject) => {
                        dataSource.getBlueprintsByAuthor(_author, function (data) {
                            _blueprints = data;
                            resolve();
                        });
                    });
                })
                .then(() => {
                    // Recalcular puntos
                    $("#totalPoints").text(_calculateTotalPoints());
                    alert("Blueprint guardado correctamente.");
                })
                .catch(() => {
                    alert("Error al guardar el blueprint.");
                });
        },

        deleteBlueprint: function () {
            if (!_currentBlueprint) {
                alert("No hay un blueprint seleccionado para eliminar.");
                return;
            }
            if (!confirm(`¿Seguro que deseas eliminar "${_currentBlueprint.name}"?`)) {
                return;
            }
            const name = _currentBlueprint.name;
            // DELETE: eliminar el blueprint
            dataSource.deleteBlueprint(_author, name)
                .then(() => {
                    console.log("Blueprint eliminado correctamente.");
                    _clearCanvas();
                    _currentBlueprint = null;
                    // GET: obtener blueprints actualizados
                    return new Promise((resolve, reject) => {
                        dataSource.getBlueprintsByAuthor(_author, function (data) {
                            _blueprints = data;
                            resolve();
                        });
                    });
                })
                .then(() => {
                    // Recalcular puntos
                    $("#totalPoints").text(_calculateTotalPoints());
                    alert("Blueprint eliminado y lista actualizada.");
                })
                .catch(() => {
                    alert("Error al eliminar el blueprint.");
                });
        },

        // Inicializar eventos en el canvas
        init: function () {
            console.info("App inicializada con manejador de eventos en canvas");

            _canvas = document.getElementById("blueprintCanvas");
            _ctx = _canvas.getContext("2d");

            if (window.PointerEvent) {
                _canvas.addEventListener("pointerdown", function (event) {
                    const rect = _canvas.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    _handleCanvasClick(x, y);
                });
            } else {
                _canvas.addEventListener("mousedown", function (event) {
                    const rect = _canvas.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    _handleCanvasClick(x, y);
                });
            }
        }
    };
})();
